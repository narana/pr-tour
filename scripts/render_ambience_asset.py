import argparse
import math
import random
import wave
from pathlib import Path


SAMPLE_RATE = 22050


def clamp(value: float):
    return max(-1.0, min(1.0, value))


def chirp(time_seconds: float, start_time: float, duration: float, start_freq: float, end_freq: float, amplitude: float):
    progress = (time_seconds - start_time) / duration
    if progress < 0.0 or progress > 1.0:
        return 0.0
    envelope = math.sin(math.pi * progress) ** 2
    frequency = start_freq + ((end_freq - start_freq) * progress)
    return math.sin(2.0 * math.pi * frequency * (time_seconds - start_time)) * envelope * amplitude


def build_forest_sample(time_seconds: float):
    breeze = (random.random() * 2.0 - 1.0) * 0.12 * (0.45 + 0.55 * math.sin(2.0 * math.pi * 0.08 * time_seconds) ** 2)
    bird = 0.0
    cycle = time_seconds % 6.5
    if 0.9 <= cycle <= 1.25:
        bird += chirp(time_seconds, time_seconds - (cycle - 0.9), 0.35, 1400.0, 2200.0, 0.24)
    if 3.6 <= cycle <= 3.95:
        bird += chirp(time_seconds, time_seconds - (cycle - 3.6), 0.35, 1800.0, 2600.0, 0.18)
    return clamp((breeze * 0.55) + bird)


def build_waterfall_sample(time_seconds: float):
    base_noise = (random.random() * 2.0 - 1.0) * 0.22
    rumble = math.sin(2.0 * math.pi * 58.0 * time_seconds) * 0.02
    shimmer = math.sin(2.0 * math.pi * 720.0 * time_seconds) * 0.008
    pulse = 0.72 + 0.28 * math.sin(2.0 * math.pi * 0.22 * time_seconds) ** 2
    return clamp((base_noise + rumble + shimmer) * pulse)


def build_surf_sample(time_seconds: float):
    foam = (random.random() * 2.0 - 1.0) * 0.18
    swell = 0.55 + 0.45 * math.sin(2.0 * math.pi * 0.11 * time_seconds) ** 2
    undertow = math.sin(2.0 * math.pi * 44.0 * time_seconds) * 0.016
    return clamp((foam * swell) + undertow)


def build_wetland_sample(time_seconds: float):
    water = (random.random() * 2.0 - 1.0) * 0.08
    reeds = math.sin(2.0 * math.pi * 0.14 * time_seconds) * 0.03
    bird = 0.0
    cycle = time_seconds % 7.5
    if 1.0 <= cycle <= 1.28:
        bird += chirp(time_seconds, time_seconds - (cycle - 1.0), 0.28, 2100.0, 3200.0, 0.18)
    if 4.1 <= cycle <= 4.42:
        bird += chirp(time_seconds, time_seconds - (cycle - 4.1), 0.32, 1500.0, 2600.0, 0.15)
    return clamp((water * 0.5) + reeds + bird)


def build_coqui_sample(time_seconds: float):
    bed = (random.random() * 2.0 - 1.0) * 0.03
    cycle = time_seconds % 2.2
    call = 0.0
    if 0.18 <= cycle <= 0.28:
        call += chirp(time_seconds, time_seconds - (cycle - 0.18), 0.1, 1850.0, 2050.0, 0.22)
    if 0.38 <= cycle <= 0.56:
        call += chirp(time_seconds, time_seconds - (cycle - 0.38), 0.18, 2450.0, 2850.0, 0.28)
    if 1.24 <= cycle <= 1.34:
        call += chirp(time_seconds, time_seconds - (cycle - 1.24), 0.1, 1780.0, 1980.0, 0.18)
    if 1.42 <= cycle <= 1.6:
        call += chirp(time_seconds, time_seconds - (cycle - 1.42), 0.18, 2380.0, 2760.0, 0.22)
    return clamp(bed + call)


BUILDERS = {
    "forest": build_forest_sample,
    "waterfall": build_waterfall_sample,
    "surf": build_surf_sample,
    "wetland": build_wetland_sample,
    "coqui": build_coqui_sample,
}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--type", required=True, choices=BUILDERS.keys())
    parser.add_argument("--output", required=True)
    parser.add_argument("--duration", type=float, default=18.0)
    args = parser.parse_args()

    output_path = Path(args.output)
    output_path.parent.mkdir(parents=True, exist_ok=True)

    frame_count = int(args.duration * SAMPLE_RATE)
    builder = BUILDERS[args.type]

    with wave.open(str(output_path), "wb") as wav_file:
        wav_file.setnchannels(1)
        wav_file.setsampwidth(2)
        wav_file.setframerate(SAMPLE_RATE)

        frames = bytearray()
        for frame_index in range(frame_count):
            time_seconds = frame_index / SAMPLE_RATE
            sample_value = int(clamp(builder(time_seconds)) * 32767)
            frames.extend(sample_value.to_bytes(2, byteorder="little", signed=True))

        wav_file.writeframes(frames)


if __name__ == "__main__":
    main()