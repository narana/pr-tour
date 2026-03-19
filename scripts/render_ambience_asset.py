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


def build_ceremonial_sample(time_seconds: float):
    bed = (random.random() * 2.0 - 1.0) * 0.02
    cycle = time_seconds % 2.6

    drum = 0.0
    for strike_time, amplitude, tone in ((0.0, 0.18, 108.0), (0.72, 0.13, 132.0), (1.46, 0.16, 116.0)):
        offset = cycle - strike_time
        if 0.0 <= offset <= 0.2:
            envelope = math.exp(-18.0 * offset)
            drum += math.sin(2.0 * math.pi * tone * offset) * envelope * amplitude
            drum += math.sin(2.0 * math.pi * (tone * 1.95) * offset) * envelope * amplitude * 0.22

    shaker = 0.0
    for strike_time in (0.36, 1.08, 1.84):
        offset = cycle - strike_time
        if 0.0 <= offset <= 0.08:
            shaker += (random.random() * 2.0 - 1.0) * math.exp(-45.0 * offset) * 0.14

    flute = 0.0
    melody_cycle = time_seconds % 5.2
    if 0.9 <= melody_cycle <= 1.48:
        flute += chirp(time_seconds, time_seconds - (melody_cycle - 0.9), 0.58, 480.0, 620.0, 0.07)
    if 2.75 <= melody_cycle <= 3.33:
        flute += chirp(time_seconds, time_seconds - (melody_cycle - 2.75), 0.58, 540.0, 430.0, 0.06)

    return clamp((bed * 0.4) + drum + shaker + flute)


def build_celebration_sample(time_seconds: float):
    bed = (random.random() * 2.0 - 1.0) * 0.018
    cycle = time_seconds % 3.2

    conga = 0.0
    for strike_time, tone, amplitude in ((0.0, 152.0, 0.15), (0.52, 178.0, 0.14), (1.04, 144.0, 0.17), (1.56, 198.0, 0.13), (2.08, 152.0, 0.16)):
        offset = cycle - strike_time
        if 0.0 <= offset <= 0.16:
            envelope = math.exp(-20.0 * offset)
            conga += math.sin(2.0 * math.pi * tone * offset) * envelope * amplitude
            conga += math.sin(2.0 * math.pi * (tone * 2.3) * offset) * envelope * amplitude * 0.18

    palmas = 0.0
    for strike_time in (0.26, 0.78, 1.3, 1.82, 2.34):
        offset = cycle - strike_time
        if 0.0 <= offset <= 0.06:
            palmas += (random.random() * 2.0 - 1.0) * math.exp(-55.0 * offset) * 0.18

    cheer = 0.0
    cheer_cycle = time_seconds % 6.4
    if 4.2 <= cheer_cycle <= 5.1:
        progress = (cheer_cycle - 4.2) / 0.9
        crowd_envelope = math.sin(math.pi * progress) ** 2
        cheer = ((random.random() * 2.0 - 1.0) * 0.08 + math.sin(2.0 * math.pi * 310.0 * time_seconds) * 0.012) * crowd_envelope

    brass = 0.0
    melody_cycle = time_seconds % 4.8
    if 1.0 <= melody_cycle <= 1.42:
        brass += chirp(time_seconds, time_seconds - (melody_cycle - 1.0), 0.42, 620.0, 760.0, 0.055)
    if 3.0 <= melody_cycle <= 3.42:
        brass += chirp(time_seconds, time_seconds - (melody_cycle - 3.0), 0.42, 760.0, 680.0, 0.05)

    return clamp((bed * 0.35) + conga + palmas + cheer + brass)


def build_mountain_sample(time_seconds: float):
    wind = (random.random() * 2.0 - 1.0) * 0.08 * (0.45 + 0.55 * math.sin(2.0 * math.pi * 0.07 * time_seconds) ** 2)
    low_rumble = math.sin(2.0 * math.pi * 62.0 * time_seconds) * 0.01
    bird = 0.0
    cycle = time_seconds % 8.4
    if 1.1 <= cycle <= 1.5:
        bird += chirp(time_seconds, time_seconds - (cycle - 1.1), 0.4, 1200.0, 1700.0, 0.11)
    if 4.6 <= cycle <= 5.0:
        bird += chirp(time_seconds, time_seconds - (cycle - 4.6), 0.4, 1460.0, 1920.0, 0.1)
    if 6.7 <= cycle <= 7.18:
        bird += chirp(time_seconds, time_seconds - (cycle - 6.7), 0.48, 980.0, 1420.0, 0.09)
    return clamp((wind * 0.7) + low_rumble + bird)


BUILDERS = {
    "forest": build_forest_sample,
    "waterfall": build_waterfall_sample,
    "surf": build_surf_sample,
    "wetland": build_wetland_sample,
    "coqui": build_coqui_sample,
    "ceremonial": build_ceremonial_sample,
    "celebration": build_celebration_sample,
    "mountain": build_mountain_sample,
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