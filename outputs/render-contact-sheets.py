"""Render the selected Caveat storyboard contact sheets. Requires Pillow."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent
FONT = ROOT / 'font-assets/caveat/Caveat[wght].ttf'
FRAMES = [
    ('whiteboard-caveat-v4', '01 — Meet the world’s tiniest pencil.'),
    ('02-cathode', '02 — Heater and cathode'),
    ('03-control-grid', '03 — Control grid and brightness'),
    ('04-acceleration', '04 — Accelerating the electrons'),
    ('05-focusing', '05 — Focusing the beam'),
    ('06-steering', '06 — Electrostatic steering'),
    ('07-sweep', '07 — Timebase and phosphor'),
    ('08-trigger', '08 — Triggering a steady trace'),
]


def font(size):
    face = ImageFont.truetype(str(FONT), size)
    face.set_variation_by_axes([500])
    return face


def render(frames, output, heading):
    width, tile_width, tile_height = 1800, 832, 468
    rows = (len(frames) + 1) // 2
    sheet = Image.new('RGB', (width, 140 + rows * 536 + 28), '#fdfcf8')
    draw = ImageDraw.Draw(sheet)
    draw.text((48, 23), heading, font=font(64), fill='#252d36')
    draw.text((50, 92), 'Selected direction: B’s whiteboard doodle + Caveat handwriting', font=font(31), fill='#757b82')
    for index, (basename, caption) in enumerate(frames):
        x, y = 48 + (index % 2) * 872, 148 + (index // 2) * 536
        draw.text((x + 4, y), caption, font=font(33), fill='#252d36')
        image = Image.open(ROOT / f'{basename}.png').convert('RGB')
        image = image.resize((tile_width, tile_height), Image.Resampling.LANCZOS)
        sheet.paste(image, (x, y + 43))
        draw.rectangle((x, y + 43, x + tile_width, y + 43 + tile_height), outline='#d9ded8', width=1)
    sheet.save(ROOT / output)


if __name__ == '__main__':
    render(FRAMES, 'storyboard-all-eight.png', 'Voltage, made visible — the Caveat storyboard')
    render(FRAMES[1:5], 'electron-gun-frames.png', 'Inside the electron gun')
