const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "data/haikais.json");
const haikais = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

const sorted = [...haikais].reverse();
sorted.forEach((h, i) => {
  h.number = i + 1;
});
sorted.reverse();

fs.writeFileSync(dataPath, JSON.stringify(sorted, null, 2), "utf-8");
console.log(`${sorted.length} haikais numerados (1 a ${sorted.length}).`);
