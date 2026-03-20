import argparse
import asyncio
import json
import re
import ssl
import subprocess
import tempfile
from pathlib import Path
from xml.sax.saxutils import escape

import aiohttp
import certifi
import edge_tts
from edge_tts.communicate import (
    DRM,
    SEC_MS_GEC_VERSION,
    WSS_HEADERS,
    WSS_URL,
    connect_id,
    date_to_string,
    get_headers_and_data,
    remove_incompatible_characters,
    split_text_by_byte_length,
    ssml_headers_plus_data,
)
from edge_tts.data_classes import TTSConfig


QUESTION_SPLIT_PATTERNS = [
    re.compile(r"^(?P<question>.+?\?)(?:\s+)(?P<answer>The answer is.+)$", re.DOTALL),
    re.compile(r"^(?P<question>.+?\?)(?:\s+)(?P<answer>It helps .+)$", re.DOTALL),
]

PRONUNCIATION_HINTS_PATH = Path(__file__).resolve().parent.parent / "src" / "data" / "pronunciationHints.json"


def load_pronunciation_hints():
    raw_hints = json.loads(PRONUNCIATION_HINTS_PATH.read_text(encoding="utf8"))
    return raw_hints


PRONUNCIATION_HINTS = load_pronunciation_hints()
SSML_PHONEME_SUPPORTED = None


def normalize_pronunciation_hints(text: str):
    normalized = text
    for entry in PRONUNCIATION_HINTS:
        normalized = re.sub(entry["pattern"], entry["replacement"], normalized, flags=re.IGNORECASE)
    return normalized


def build_ssml_content(text: str):
    if not text:
        return ""

    compiled_hints = [
        {
            **entry,
            "regex": re.compile(entry["pattern"], re.IGNORECASE),
        }
        for entry in PRONUNCIATION_HINTS
    ]

    content_parts = []
    cursor = 0

    while cursor < len(text):
        next_match = None

        for source_index, entry in enumerate(compiled_hints):
            match = entry["regex"].search(text, cursor)
            if not match or not match.group(0):
                continue

            start = match.start()
            end = match.end()
            candidate = (start, end, entry, source_index)
            if next_match is None:
                next_match = candidate
                continue

            if start < next_match[0] or (start == next_match[0] and end > next_match[1]) or (start == next_match[0] and end == next_match[1] and source_index < next_match[3]):
                next_match = candidate

        if next_match is None:
            content_parts.append(escape(text[cursor:]))
            break

        start, end, entry, _ = next_match
        if start > cursor:
            content_parts.append(escape(text[cursor:start]))

        replacement = escape(entry["replacement"])
        if entry.get("ipa"):
            locale = entry.get("locale", "es-PR")
            ipa = escape(entry["ipa"])
            content_parts.append(
                f"<lang xml:lang='{locale}'><phoneme alphabet='ipa' ph='{ipa}'>{replacement}</phoneme></lang>"
            )
        else:
            content_parts.append(replacement)

        cursor = end

    return "".join(content_parts)


def build_ssml_document(text: str, voice: str, rate: str, pitch: str):
    content = build_ssml_content(remove_incompatible_characters(text))
    return (
        "<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='en-US'>"
        f"<voice name='{TTSConfig(voice, rate, '+0%', pitch, 'SentenceBoundary').voice}'>"
        f"<prosody pitch='{pitch}' rate='{rate}' volume='+0%'>"
        f"{content}"
        "</prosody>"
        "</voice>"
        "</speak>"
    )


def build_segments(text: str):
    speech_text = normalize_pronunciation_hints(text)
    paragraphs = [paragraph.strip() for paragraph in re.split(r"\n\s*\n", speech_text) if paragraph.strip()]
    segments = []

    for paragraph_index, paragraph in enumerate(paragraphs):
        split_match = None
        for pattern in QUESTION_SPLIT_PATTERNS:
            split_match = pattern.match(paragraph)
            if split_match:
                break

        if split_match:
            segments.append(("speech", split_match.group("question").strip()))
            segments.append(("silence", 5.0))
            segments.append(("speech", split_match.group("answer").strip()))
        else:
            segments.append(("speech", paragraph))

        if paragraph_index < len(paragraphs) - 1:
            segments.append(("silence", 0.8))

    return segments


async def render_ssml_chunk(ssml_document: str, output_path: Path):
    ssl_ctx = ssl.create_default_context(cafile=certifi.where())
    timeout = aiohttp.ClientTimeout(total=None, connect=None, sock_connect=10, sock_read=60)

    async with aiohttp.ClientSession(trust_env=True, timeout=timeout) as session, session.ws_connect(
        f"{WSS_URL}&ConnectionId={connect_id()}&Sec-MS-GEC={DRM.generate_sec_ms_gec()}&Sec-MS-GEC-Version={SEC_MS_GEC_VERSION}",
        compress=15,
        headers=DRM.headers_with_muid(WSS_HEADERS),
        ssl=ssl_ctx,
    ) as websocket:
        with open(output_path, "wb") as audio:
            await websocket.send_str(
                f"X-Timestamp:{date_to_string()}\r\n"
                "Content-Type:application/json; charset=utf-8\r\n"
                "Path:speech.config\r\n\r\n"
                '{"context":{"synthesis":{"audio":{"metadataoptions":{"sentenceBoundaryEnabled":"true","wordBoundaryEnabled":"false"},"outputFormat":"audio-24khz-48kbitrate-mono-mp3"}}}}\r\n'
            )
            await websocket.send_str(ssml_headers_plus_data(connect_id(), date_to_string(), ssml_document))

            async for received in websocket:
                if received.type == aiohttp.WSMsgType.TEXT:
                    encoded_data = received.data.encode("utf-8")
                    header_end = encoded_data.find(b"\r\n\r\n")
                    if header_end == -1:
                        continue
                    parameters, _ = get_headers_and_data(encoded_data, header_end)
                    if parameters.get(b"Path") == b"turn.end":
                        break
                    continue

                if received.type != aiohttp.WSMsgType.BINARY:
                    continue

                if len(received.data) < 2:
                    continue

                header_length = int.from_bytes(received.data[:2], "big")
                if header_length > len(received.data):
                    continue

                parameters, data = get_headers_and_data(received.data, header_length)
                if parameters.get(b"Path") != b"audio":
                    continue

                if parameters.get(b"Content-Type") != b"audio/mpeg":
                    continue

                if data:
                    audio.write(data)

    if not output_path.exists() or output_path.stat().st_size == 0:
        raise RuntimeError("Edge TTS did not return audio for the SSML payload.")


async def render_plain_speech(text: str, output_path: Path, voice: str, rate: str, pitch: str):
    communicate = edge_tts.Communicate(text=text, voice=voice, rate=rate, pitch=pitch)
    await communicate.save(str(output_path))


async def render_speech(text: str, output_path: Path, voice: str, rate: str, pitch: str):
    global SSML_PHONEME_SUPPORTED

    clean_text = remove_incompatible_characters(text)
    text_chunks = [chunk.decode("utf-8") for chunk in split_text_by_byte_length(clean_text, 2500)]

    if SSML_PHONEME_SUPPORTED is False:
        await render_plain_speech(text, output_path, voice, rate, pitch)
        return

    try:
        if len(text_chunks) == 1:
            await render_ssml_chunk(build_ssml_document(text_chunks[0], voice, rate, pitch), output_path)
        else:
            with tempfile.TemporaryDirectory(prefix="tour-tts-chunks-") as temp_dir_name:
                temp_dir = Path(temp_dir_name)
                chunk_manifest = temp_dir / "concat.txt"
                chunk_paths = []

                for chunk_index, chunk_text in enumerate(text_chunks):
                    chunk_path = temp_dir / f"chunk-{chunk_index:03d}.mp3"
                    await render_ssml_chunk(build_ssml_document(chunk_text, voice, rate, pitch), chunk_path)
                    chunk_paths.append(chunk_path)

                chunk_manifest.write_text(
                    "\n".join(f"file '{part.as_posix()}'" for part in chunk_paths),
                    encoding="utf8",
                )

                subprocess.run(
                    [
                        "ffmpeg",
                        "-y",
                        "-f",
                        "concat",
                        "-safe",
                        "0",
                        "-i",
                        str(chunk_manifest),
                        "-acodec",
                        "libmp3lame",
                        "-q:a",
                        "4",
                        str(output_path),
                    ],
                    check=True,
                    stdout=subprocess.DEVNULL,
                    stderr=subprocess.DEVNULL,
                )

        SSML_PHONEME_SUPPORTED = True
        return
    except Exception:
        SSML_PHONEME_SUPPORTED = False
        if output_path.exists():
            output_path.unlink(missing_ok=True)

    await render_plain_speech(text, output_path, voice, rate, pitch)


def render_silence(output_path: Path, duration_seconds: float):
    subprocess.run(
        [
            "ffmpeg",
            "-y",
            "-f",
            "lavfi",
            "-i",
            "anullsrc=r=24000:cl=mono",
            "-t",
            f"{duration_seconds:.2f}",
            "-acodec",
            "libmp3lame",
            "-q:a",
            "6",
            str(output_path),
        ],
        check=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )


async def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", required=True)
    parser.add_argument("--text", required=True)
    parser.add_argument("--voice", default="en-US-AvaMultilingualNeural")
    parser.add_argument("--rate", default="-8%")
    parser.add_argument("--pitch", default="+0Hz")
    args = parser.parse_args()

    output_path = Path(args.output)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    segments = build_segments(args.text)

    with tempfile.TemporaryDirectory(prefix="tour-tts-") as temp_dir_name:
        temp_dir = Path(temp_dir_name)
        concat_manifest = temp_dir / "concat.txt"
        rendered_parts = []

        speech_index = 0
        silence_index = 0
        for segment_type, payload in segments:
            if segment_type == "speech":
                part_path = temp_dir / f"speech-{speech_index:03d}.mp3"
                speech_index += 1
                await render_speech(payload, part_path, args.voice, args.rate, args.pitch)
            else:
                part_path = temp_dir / f"silence-{silence_index:03d}.mp3"
                silence_index += 1
                render_silence(part_path, payload)

            rendered_parts.append(part_path)

        concat_manifest.write_text(
            "\n".join(f"file '{part.as_posix()}'" for part in rendered_parts),
            encoding="utf8",
        )

        subprocess.run(
            [
                "ffmpeg",
                "-y",
                "-f",
                "concat",
                "-safe",
                "0",
                "-i",
                str(concat_manifest),
                "-acodec",
                "libmp3lame",
                "-q:a",
                "4",
                str(output_path),
            ],
            check=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )


if __name__ == "__main__":
    asyncio.run(main())