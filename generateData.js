import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const webpDir = path.join(__dirname, 'public', 'Tarot_webp');
const outputFilePath = path.join(__dirname, 'src', 'data', 'tarotData.js');
const meaningsPath = path.join(__dirname, 'src', 'data', 'tarotMeanings.json');

try {
  if (!fs.existsSync(path.join(__dirname, 'src', 'data'))) {
    fs.mkdirSync(path.join(__dirname, 'src', 'data'), { recursive: true });
  }

  // Load the newly generated JSON data
  let meaningsMap = {};
  if (fs.existsSync(meaningsPath)) {
    const rawMeanings = JSON.parse(fs.readFileSync(meaningsPath, 'utf8'));
    rawMeanings.forEach(m => {
      meaningsMap[m.id] = m;
    });
  }

  const files = fs.readdirSync(webpDir);
  const cardData = [];

  files.forEach(file => {
    if (!file.endsWith('.webp') || file.startsWith('back')) return;

    // file examples: "00 - Der Narr.webp", "89 - Zehn der Stäbe.webp"
    const match = file.match(/^(\d{2}) - (.+)\.webp$/);
    if (match) {
      const id = parseInt(match[1], 10);
      const name = match[2];
      let arcana = "Minor Arcana";
      let suit = "";

      // 00 to 21 are Major Arcana
      if (id >= 0 && id <= 21) {
        arcana = "Major Arcana";
      } else {
        if (name.includes("Münzen") || name.includes("Scheiben")) suit = "Pentacles";
        else if (name.includes("Kelche")) suit = "Cups";
        else if (name.includes("Schwerter")) suit = "Swords";
        else if (name.includes("Stäbe")) suit = "Wands";
      }

      // Default values
      let upd = "Aufrechte Bedeutung generieren/Platzhalter.";
      let rev = "Umgekehrte Bedeutung generieren/Platzhalter.";
      let sym = "Symbolik der Karte...";

      if (meaningsMap[id]) {
        upd = meaningsMap[id].upright || upd;
        rev = meaningsMap[id].reversed || rev;
        sym = meaningsMap[id].symbolism || sym;
      }

      cardData.push({
        id: file, // string based ID
        numericId: id,
        name: name,
        arcana: arcana,
        suit: suit,
        imagePath: `/Tarot_webp/${file}`,
        keywords: [],
        uprightMeaning: upd,
        reversedMeaning: rev,
        symbolism: sym,
      });
    }
  });

  // Sort by numeric ID
  cardData.sort((a, b) => a.numericId - b.numericId);

  const fileContent = `// Automatically generated from webp files and tarotMeanings.json
export const tarotDeck = ${JSON.stringify(cardData, null, 2)};
`;

  fs.writeFileSync(outputFilePath, fileContent);
  console.log('Successfully generated src/data/tarotData.js with loaded meanings.');
} catch (err) {
  console.error("Error generating data:", err);
}
