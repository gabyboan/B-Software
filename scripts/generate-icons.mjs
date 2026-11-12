import { readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const asset = name => new URL(`../public/${name}`, import.meta.url);
const artwork = (await readFile(asset('brand/logo-b.png'))).toString('base64');
// Export the original artwork inside a white disc with transparent corners.
// Inset the mark so its diagonal and upper-right corner stay inside the circle.
const source = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
  <circle cx="128" cy="128" r="128" fill="#fff"/>
  <svg x="18" y="18" width="220" height="220" viewBox="256 256 608 608">
    <image width="1120" height="1120" href="data:image/png;base64,${artwork}"/>
  </svg>
</svg>`);

const sizes = [16, 32, 48];
const images = await Promise.all(sizes.map(size => sharp(source).resize(size, size).png().toBuffer()));
await writeFile(asset('favicon.png'), images[2]);

// ICO directory plus embedded PNGs: no renamed PNG masquerading as an ICO.
const directory = Buffer.alloc(6 + sizes.length * 16);
directory.writeUInt16LE(1, 2);
directory.writeUInt16LE(sizes.length, 4);
let offset = directory.length;
images.forEach((png, index) => {
  const entry = 6 + index * 16;
  directory[entry] = sizes[index];
  directory[entry + 1] = sizes[index];
  directory.writeUInt16LE(1, entry + 4);
  directory.writeUInt16LE(32, entry + 6);
  directory.writeUInt32LE(png.length, entry + 8);
  directory.writeUInt32LE(offset, entry + 12);
  offset += png.length;
});
await writeFile(asset('favicon.ico'), Buffer.concat([directory, ...images]));
console.log('Circular brand icons exported: PNG 48px; ICO 16px, 32px and 48px.');
