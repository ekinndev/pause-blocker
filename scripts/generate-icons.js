import sharp from 'sharp';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sizes = [16, 32, 48, 128];
const inputSvg = join(__dirname, '../src/assets/icon.png');
const outputDir = join(__dirname, '../src/assets');

async function generateIcons() {
  try {
    // Read the SVG file
    const svgBuffer = await fs.readFile(inputSvg);

    // Generate each size
    for (const size of sizes) {
      await sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toFile(join(outputDir, `icon${size}.png`));

      console.log(`Generated ${size}x${size} icon`);
    }

    console.log('All icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
  }
}

generateIcons();
