import sharp from 'sharp'
import { writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outPath = join(__dirname, '../public/og-image.png')

mkdirSync(join(__dirname, '../public'), { recursive: true })

const svg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="1200" height="630" fill="#050505"/>

  <!-- Corner brackets -->
  <polyline points="80,170 80,100 150,100" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="2.5" stroke-linejoin="round"/>
  <polyline points="1120,170 1120,100 1050,100" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="2.5" stroke-linejoin="round"/>
  <polyline points="80,460 80,530 150,530" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="2.5" stroke-linejoin="round"/>
  <polyline points="1120,460 1120,530 1050,530" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="2.5" stroke-linejoin="round"/>

  <!-- Top UI: REC -->
  <circle cx="470" cy="118" r="7" fill="#ef4444"/>
  <text x="488" y="124" fill="#ef4444" font-size="15" font-weight="bold" letter-spacing="4" font-family="monospace">REC</text>
  <text x="568" y="124" fill="rgba(255,255,255,0.4)" font-size="14" letter-spacing="3" font-family="monospace">00:00:03:14</text>

  <!-- Bottom bar -->
  <rect x="340" y="558" width="520" height="44" rx="22" fill="rgba(5,5,5,0.85)" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
  <text x="370" y="586" fill="rgba(255,255,255,0.4)" font-size="12" letter-spacing="3" font-family="monospace">RAW</text>
  <text x="425" y="586" fill="rgba(255,255,255,0.4)" font-size="12" letter-spacing="3" font-family="monospace">AWB</text>
  <text x="480" y="586" fill="rgba(255,255,255,0.75)" font-size="13" letter-spacing="1" font-family="monospace">ISO 100</text>
  <text x="570" y="586" fill="rgba(255,255,255,0.75)" font-size="13" letter-spacing="1" font-family="monospace">F/1.4</text>
  <text x="635" y="586" fill="rgba(255,255,255,0.75)" font-size="13" letter-spacing="1" font-family="monospace">1/2000</text>
  <text x="730" y="587" fill="white" font-size="15" font-weight="bold" font-family="monospace">100%</text>

  <!-- Crosshairs -->
  <line x1="160" y1="315" x2="1040" y2="315" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
  <line x1="600" y1="140" x2="600" y2="490" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>

  <!-- Outer calibration ring -->
  <circle cx="600" cy="315" r="230" fill="none" stroke="white" stroke-width="0.6" stroke-dasharray="2 5" opacity="0.45"/>
  <!-- Middle measurement ring -->
  <circle cx="600" cy="315" r="193" fill="none" stroke="white" stroke-width="1.5" stroke-dasharray="28 9 2 9" opacity="0.55"/>
  <!-- Inner fine ring -->
  <circle cx="600" cy="315" r="156" fill="none" stroke="white" stroke-width="0.6" stroke-dasharray="1 4" opacity="0.45"/>

  <!-- Focus matrix dots horizontal -->
  <rect x="508" y="312" width="6" height="6" fill="none" stroke="rgba(255,255,255,0.45)" stroke-width="1"/>
  <rect x="597" y="312" width="6" height="6" fill="none" stroke="rgba(255,255,255,0.45)" stroke-width="1"/>
  <rect x="686" y="312" width="6" height="6" fill="none" stroke="rgba(255,255,255,0.45)" stroke-width="1"/>
  <!-- Focus matrix dots vertical -->
  <rect x="597" y="228" width="6" height="6" fill="none" stroke="rgba(255,255,255,0.45)" stroke-width="1"/>
  <rect x="597" y="396" width="6" height="6" fill="none" stroke="rgba(255,255,255,0.45)" stroke-width="1"/>

  <!-- Focus square - green (locked) -->
  <rect x="555" y="272" width="90" height="86" fill="none" stroke="#10B981" stroke-width="1.5"/>
  <!-- Focus square corner marks -->
  <polyline points="545,282 545,272 555,272" fill="none" stroke="rgba(255,255,255,0.9)" stroke-width="2"/>
  <polyline points="645,282 645,272 635,272" fill="none" stroke="rgba(255,255,255,0.9)" stroke-width="2"/>
  <polyline points="545,348 545,358 555,358" fill="none" stroke="rgba(255,255,255,0.9)" stroke-width="2"/>
  <polyline points="645,348 645,358 635,358" fill="none" stroke="rgba(255,255,255,0.9)" stroke-width="2"/>

  <!-- Name -->
  <text x="600" y="455" fill="rgba(255,255,255,0.12)" font-size="12" letter-spacing="10" text-anchor="middle" font-family="sans-serif">ALEKSANDER KOWALSKI</text>
</svg>`

await sharp(Buffer.from(svg))
  .png()
  .toFile(outPath)

console.log('✓ OG image generated → public/og-image.png')
