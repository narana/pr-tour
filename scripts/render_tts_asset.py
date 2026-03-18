import argparse
import asyncio
import re
import subprocess
import tempfile
from pathlib import Path

import edge_tts


QUESTION_SPLIT_PATTERNS = [
    re.compile(r"^(?P<question>.+?\?)(?:\s+)(?P<answer>The answer is.+)$", re.DOTALL),
    re.compile(r"^(?P<question>.+?\?)(?:\s+)(?P<answer>It helps .+)$", re.DOTALL),
]

PRONUNCIATION_HINTS = [
    (r"\bJardin Botanico y Cultural de Caguas William Miranda Marin\b", "Jardín Botánico y Cultural de Caguas William Miranda Marín"),
    (r"\bSan Ramon Nonato\b", "San Ramón Nonato"),
    (r"\bBosque Estatal de Carite\b", "Bosque Estatal de Carite"),
    (r"\bCordillera Central\b", "Cordillera Central"),
    (r"\bCarretera Patillas - Cayey\b", "Carretera Patillas, Cayey"),
    (r"\bCarretera Ciales - Jayuya\b", "Carretera Ciales, Jayuya"),
    (r"\bCarretera Jacaguas\b", "Carretera Jacaguas"),
    (r"\bTainos\b", "Taínos"),
    (r"\bTaino\b", "Taíno"),
    (r"\bBoriquen\b", "Borinquén"),
    (r"\bBoriken\b", "Borikén"),
    (r"\bBoricua\b", "Boricua"),
    (r"\bcoqui\b", "coquí"),
    (r"\bcoquis\b", "coquís"),
    (r"\bCaguas\b", "Cáguas"),
    (r"\bCarite\b", "Carite"),
    (r"\bCayey\b", "Ca-yey"),
    (r"\bGuavate\b", "Gua-vah-teh"),
    (r"\bCoamo\b", "Coámo"),
    (r"\bJayuya\b", "Ha-yú-ya"),
    (r"\bCoabey\b", "Coa-bey"),
    (r"\bCiales\b", "Ciáles"),
    (r"\bTortuguero\b", "Tortuguero"),
    (r"\bBalneario\b", "Balneario"),
    (r"\bCaparra\b", "Caparra"),
    (r"\bGuaynabo\b", "Guaynabo"),
    (r"\bCollores\b", "Coyores"),
    (r"\bPatillas\b", "Patillas"),
    (r"\bJacaguas\b", "Hacaguas"),
    (r"\bJardin Botanico\b", "Jardín Botánico"),
    (r"\bMiranda Marin\b", "Miranda Marín"),
    (r"\bJuana Diaz\b", "Juana Díaz"),
    (r"\bLuis Llorens Torres\b", "Luis Yórens Torres"),
    (r"\bPonce de Leon\b", "Ponce de León"),
    (r"\blechoneras\b", "lechoneras"),
    (r"\bmogotes\b", "mogotes"),
    (r"\bbomba\b", "bomba"),
    (r"\bplena\b", "plena"),
    (r"\byuca\b", "yuca"),
    (r"\bhuracan\b", "huracán"),
    (r"\bbarbacoa\b", "barbacoa"),
    (r"\bRincon\b", "Rincón"),
    (r"\bRio\b", "Río"),
]


def normalize_pronunciation_hints(text: str):
    normalized = text
    for pattern, replacement in PRONUNCIATION_HINTS:
        normalized = re.sub(pattern, replacement, normalized, flags=re.IGNORECASE)
    return normalized


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


async def render_speech(text: str, output_path: Path, voice: str, rate: str, pitch: str):
    communicate = edge_tts.Communicate(text=text, voice=voice, rate=rate, pitch=pitch)
    await communicate.save(str(output_path))


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