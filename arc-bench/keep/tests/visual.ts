import { inflateSync } from 'node:zlib';
import { expect, type Locator } from '@playwright/test';

// Inspect rendered pixels, so a colored child badge cannot stand in for a note background.
// This accepts a broad family of light greens rather than one reference RGB value.
export async function expectLightGreenSurface(surface: Locator) {
  await expect(async () => {
    const png = await surface.screenshot();
    const chunks: Buffer[] = [];
    let width = 0, height = 0, channels = 0;
    for (let offset = 8; offset < png.length;) {
      const length = png.readUInt32BE(offset);
      const type = png.toString('ascii', offset + 4, offset + 8);
      const data = png.subarray(offset + 8, offset + 8 + length);
      if (type === 'IHDR') {
        width = data.readUInt32BE(0); height = data.readUInt32BE(4);
        expect(data[8], 'screenshot uses 8-bit channels').toBe(8);
        expect([2, 6], 'screenshot is RGB or RGBA').toContain(data[9]);
        channels = data[9] === 6 ? 4 : 3;
      }
      if (type === 'IDAT') chunks.push(data);
      offset += length + 12;
    }
    const raw = inflateSync(Buffer.concat(chunks));
    const stride = width * channels;
    let previous = Buffer.alloc(stride), position = 0, green = 0, sampled = 0;
    const paeth = (a: number, b: number, c: number) => {
      const p = a + b - c, da = Math.abs(p - a), db = Math.abs(p - b), dc = Math.abs(p - c);
      return da <= db && da <= dc ? a : db <= dc ? b : c;
    };
    for (let y = 0; y < height; y++) {
      const filter = raw[position++], row = Buffer.alloc(stride);
      expect(filter).toBeLessThanOrEqual(4);
      for (let x = 0; x < stride; x++) {
        const left = x >= channels ? row[x - channels] : 0;
        const above = previous[x], upperLeft = x >= channels ? previous[x - channels] : 0;
        const prediction = [0, left, above, Math.floor((left + above) / 2), paeth(left, above, upperLeft)][filter];
        row[x] = (raw[position++] + prediction) & 255;
      }
      // Ignore the outer shadow/border and sample the note's interior area.
      if (y >= height * .1 && y < height * .9) {
        for (let x = Math.ceil(width * .1); x < width * .9; x++) {
          const i = x * channels, r = row[i], g = row[i + 1], b = row[i + 2];
          sampled++;
          if (g >= 150 && g - r >= 5 && g - b >= 5 && (r + g + b) / 3 >= 100) green++;
        }
      }
      previous = row;
    }
    expect(sampled).toBeGreaterThan(0);
    expect(green / sampled, 'light green covers the note surface, not just a badge').toBeGreaterThan(.5);
  }).toPass({ timeout: 10_000 });
}
