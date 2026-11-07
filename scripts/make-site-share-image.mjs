// Code-native sharing card, using the site's approved portrait and colour tokens.
import sharp from 'sharp';
import { readFileSync } from 'node:fs';
const portrait = readFileSync(new URL('../public/images/hero-portrait.jpg', import.meta.url)).toString('base64');
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<rect width="1200" height="630" fill="#F6F8FA"/>
<image href="data:image/jpeg;base64,${portrait}" x="0" y="0" width="440" height="704" preserveAspectRatio="xMidYMin slice"/>
<rect x="440" width="8" height="630" fill="#214FE6"/>
<g font-family="Arial, Helvetica, sans-serif">
<text x="494" y="114" font-size="44" font-weight="700" fill="#111C2B">Adrian Watkins<tspan fill="#214FE6">.</tspan></text>
<text x="494" y="238" font-size="48" fill="#111C2B">Operator. Builder.</text>
<text x="494" y="298" font-size="48" fill="#214FE6">Governor.</text>
<text x="494" y="390" font-size="25" fill="#384555">Commercial and operating leadership.</text>
<text x="494" y="429" font-size="25" fill="#384555">Business and AI transformation.</text>
<text x="494" y="566" font-size="24" font-weight="700" fill="#214FE6">adrianwatkins.com</text>
</g></svg>`;
await sharp(Buffer.from(svg)).jpeg({quality:88,mozjpeg:true}).toFile(new URL('../public/og/site-blue-20261107.jpg', import.meta.url).pathname);
