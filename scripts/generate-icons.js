const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function generate() {
  const logoPath = path.join(__dirname, '..', 'public', 'images', 'logo-cbta.png');
  const pubDir = path.join(__dirname, '..', 'public');
  const appDir = path.join(__dirname, '..', 'app');

  // 1. Icono 512x512
  const size = 512;
  const padding = 24;
  const innerSize = size - padding * 2;

  const circularMask = Buffer.from(
    `<svg width="${innerSize}" height="${innerSize}">
      <circle cx="${innerSize / 2}" cy="${innerSize / 2}" r="${innerSize / 2}" fill="#fff"/>
    </svg>`
  );

  const croppedLogo = await sharp(logoPath)
    .resize(innerSize, innerSize, { fit: 'cover' })
    .composite([{ input: circularMask, blend: 'dest-in' }])
    .toBuffer();

  const bgSvg = Buffer.from(
    `<svg width="${size}" height="${size}">
      <defs>
        <radialGradient id="goldGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#F97316" stop-opacity="0.35"/>
          <stop offset="85%" stop-color="#080208" stop-opacity="0.95"/>
          <stop offset="100%" stop-color="#080208" stop-opacity="1"/>
        </radialGradient>
      </defs>
      <rect width="${size}" height="${size}" rx="115" fill="#080208"/>
      <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - 8}" fill="url(#goldGlow)"/>
      <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - 12}" fill="none" stroke="#EAB308" stroke-width="8"/>
      <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - 20}" fill="none" stroke="#F97316" stroke-width="3" stroke-opacity="0.6"/>
    </svg>`
  );

  const icon512 = await sharp(bgSvg)
    .composite([{ input: croppedLogo, top: padding, left: padding }])
    .png()
    .toBuffer();

  // Guardar en public/icon.png
  fs.writeFileSync(path.join(pubDir, 'icon.png'), icon512);
  fs.writeFileSync(path.join(pubDir, 'icon-512.png'), icon512);

  // Copiar también a app/icon.png para Next.js App Router metadata
  fs.writeFileSync(path.join(appDir, 'icon.png'), icon512);

  // 2. Icono 192x192 para Google PWA y Android
  const icon192 = await sharp(icon512).resize(192, 192).png().toBuffer();
  fs.writeFileSync(path.join(pubDir, 'icon-192.png'), icon192);

  // 3. Apple Touch Icon 180x180 para iOS y Safari
  const icon180 = await sharp(icon512).resize(180, 180).png().toBuffer();
  fs.writeFileSync(path.join(pubDir, 'apple-touch-icon.png'), icon180);
  fs.writeFileSync(path.join(appDir, 'apple-icon.png'), icon180);

  // 4. Favicon 48x48 y 32x32 para Googlebot Favicon Crawler
  const icon48 = await sharp(icon512).resize(48, 48).png().toBuffer();
  fs.writeFileSync(path.join(pubDir, 'favicon-48x48.png'), icon48);
  fs.writeFileSync(path.join(pubDir, 'favicon.ico'), icon48); // PNG-based favicon.ico is standard modern web

  // 5. OpenGraph y Google Search Preview Card (1200x630)
  const ogCatrinaPath = path.join(pubDir, 'images', 'tradicion', 'catrina-ofrenda.png');
  const catrinaResized = await sharp(ogCatrinaPath)
    .resize(1200, 630, { fit: 'cover', position: 'center' })
    .toBuffer();

  const ogOverlaySvg = Buffer.from(
    `<svg width="1200" height="630">
      <defs>
        <linearGradient id="blackGrad" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stop-color="#080208" stop-opacity="0.95"/>
          <stop offset="45%" stop-color="#080208" stop-opacity="0.75"/>
          <stop offset="100%" stop-color="#080208" stop-opacity="0.2"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#blackGrad)"/>
      <rect x="24" y="24" width="1152" height="582" rx="20" fill="none" stroke="#EAB308" stroke-width="2" stroke-opacity="0.4"/>
      <text x="60" y="470" font-family="serif" font-size="52" font-weight="900" fill="#FFFFFF">ENTRE LA VIDA Y LA MUERTE</text>
      <text x="60" y="525" font-family="sans-serif" font-size="28" font-weight="700" fill="#F97316">FESTIVAL CULTURAL · CBTA #134</text>
      <text x="60" y="565" font-family="monospace" font-size="18" fill="#EAB308">San Francisco Tetlanohcan, Tlaxcala · Día de Muertos 2026</text>
    </svg>`
  );

  await sharp(catrinaResized)
    .composite([{ input: ogOverlaySvg, top: 0, left: 0 }])
    .jpeg({ quality: 90 })
    .toFile(path.join(pubDir, 'images', 'og-preview.jpg'));

  console.log('✅ Todos los iconos y la tarjeta OpenGraph/Google han sido generados exitosamente.');
}

generate().catch(err => {
  console.error('Error generando iconos:', err);
  process.exit(1);
});
