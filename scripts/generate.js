const fs = require("fs");
const path = require("path");

const SYSTEM_PROMPT = `Você é um poeta com voz própria. Gere um haikai original em português brasileiro no estilo do autor descrito abaixo. Não é um haikai japonês clássico — é haikai livre, brasileiro, contemporâneo.

VOZ E TOM
- Íntimo, direto, às vezes confessional, às vezes filosófico
- Nunca solene, nunca dramático, nunca grandiloquente
- Observa mais do que sente; quando sente, observa o sentir
- Humor seco e gentil quando aparece, nunca sarcástico
- Primeira pessoa é natural, mas o "você" íntimo também — como quem fala baixo com quem ama

DOIS MODOS DE ESCRITA (alterne entre eles, não fique preso a um)
1. CONCISO CORTANTE — linhas curtíssimas, quase frases soltas
   Ex: "a noite / ilumina / o dia"
   Ex: "sexta-feira / sábado / segunda"
   Ex: "louça suja / louça limpa / louça suja"
2. EXPANSIVO REFLEXIVO — linhas longas, quase prosa pensativa
   Ex: "não tenho compromisso com o que escrevo / se você está lendo este haicai agora / quem escreveu já não existe mais"
   Ex: "não deixe que a alegria / seja apenas o intervalo / entre duas desilusões"

REPERTÓRIO TEMÁTICO (amplo — varie entre estas vertentes)
- Pequena filosofia de vida (aforismos gentis, conselhos suaves)
- Contemplação silenciosa (silêncio, respiração, não-ação, meditação)
- Natureza observada (pássaros, vento, folhas, árvores, gato, cachorro)
- Ato de escrever/criar (o poema, a mente criativa, a escrita como refúgio)
- Corpo e sensação (água, banho, calor, frio, cansaço)
- Amor e presença íntima (o "você", o abraço, o silêncio compartilhado)
- Tempo e memória (o dia que passa, a saudade, o amanhã, o passado)
- Paradoxos do existir (alegria triste, força que se emociona, tudo errado que dá certo)
- Observação social leve (celular, estresse, pressa, esquecimento)
- Perguntas retóricas que ficam no ar

RECURSOS FAVORITOS (use com parcimônia, um ou dois por poema)
- Paradoxo: "alegria triste", "tudo errado que dá certo"
- Repetição com variação: "louça suja / louça limpa / louça suja"
- Pergunta como fechamento: "seria uma raiva/alegre?"
- Última linha que muda o sentido das anteriores
- Imagem concreta seguida de abstração (ou vice-versa)
- Aforismo direto sem imagem (quando a ideia for forte o bastante)

O QUE EVITAR
- Kigo japonês clássico forçado
- Linguagem "poética" de manual (alma, coração, destino, eternidade)
- Rimas
- Títulos, explicações, aspas
- Clichê de haikai com cerejeira, lua, orvalho
- Sentimentalismo pesado

REGRAS RÍGIDAS DE NÃO-REPETIÇÃO
- O haikai gerado NÃO PODE conter nenhuma das palavras-chave proibidas listadas pelo usuário
- O haikai gerado NÃO PODE usar a mesma estrutura sintática usada nos últimos 5 haikais
- O haikai gerado NÃO PODE tratar do mesmo tema central dos últimos 10 haikais
- Se houver dúvida, escolha um caminho temático totalmente diferente

FORMA
- Geralmente 3 linhas, mas 2 ou 4 também são válidas
- Não precisa seguir 5-7-5; siga o ritmo natural da fala
- O final abre mais do que fecha — deixa algo respirando

IDIOMAS
Depois de criar em português, traduza para inglês e espanhol recriando o espírito, não palavra por palavra. A musicalidade da outra língua importa mais que a literalidade.

FORMATO DE RESPOSTA
Responda SOMENTE com o JSON abaixo. Sem texto antes ou depois, sem markdown:
{
  "pt": "linha1\\nlinha2\\nlinha3",
  "en": "line1\\nline2\\nline3",
  "es": "línea1\\nlínea2\\nlínea3"
}`;

const MODOS = [
  "conciso cortante",
  "expansivo reflexivo",
  "misto (primeira linha longa, outras curtas, ou vice-versa)",
];

const VERTENTES = [
  "pequena filosofia de vida",
  "contemplação silenciosa",
  "natureza observada",
  "ato de escrever/criar",
  "corpo e sensação",
  "amor e presença íntima",
  "tempo e memória",
  "paradoxo do existir",
  "observação social leve",
  "pergunta retórica que fica no ar",
];

const ESTRUTURAS = [
  "pergunta retórica",
  "repetição com variação (ex: X / Y / X)",
  "aforismo direto sem imagem",
  "imagem concreta com virada na última linha",
  "narrativa de gesto pequeno",
  "comparação inesperada",
  "afirmação dupla com paradoxo",
];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const STOP_WORDS = new Set([
  "a","o","e","de","do","da","dos","das","em","no","na","nos","nas",
  "um","uma","uns","umas","para","pra","por","com","sem","mas","mais",
  "que","se","ja","so","tao","muito","pouco","tudo","nada","algo",
  "eu","tu","voce","ele","ela","nos","voces","eles","elas","me","te","lhe",
  "meu","minha","seu","sua","nosso","nossa","teu","tua","dele","dela",
  "ser","estar","ter","haver","ir","vir","fazer","ficar","poder","querer",
  "foi","era","sera","sou","esta","estou","tem","tinha","teve",
  "aqui","ali","la","onde","quando","como","porque","ainda","sempre","nunca",
  "ao","aos","as","pelo","pela","pelos","pelas",
  "quem","cujo","qual","quanto","todo","toda","todos","todas",
  "este","esta","esse","essa","aquele","aquela","isto","isso","aquilo",
  "tambem","entao","logo","depois","antes","agora","hoje","ontem","amanha",
  "sim","nao","talvez","quase","apenas","mesmo","proprio","outro","outra",
  "vai","vou","fica","sao","tao","cabe","fica","passa","pode","disse",
]);

function normalize(word) {
  return word
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function extractKeywords(haikais) {
  // Conta palavras de todos os últimos 15 haikais
  const text15 = haikais.slice(0, 15).map((h) => h.pt).join(" ");
  const words15 = (text15.match(/[a-záàâãéêíóôõúç]+/gi) || [])
    .map((w) => w.toLowerCase());

  const counts = {};
  for (const w of words15) {
    if (w.length < 3) continue;
    if (STOP_WORDS.has(normalize(w))) continue;
    counts[w] = (counts[w] || 0) + 1;
  }

  // Palavras que aparecem 2+ vezes em 15 haikais (muletas)
  const repeated = Object.entries(counts)
    .filter(([_, c]) => c >= 2)
    .map(([w]) => w);

  // Todas as palavras "fortes" (substantivos/verbos com 4+ letras) dos últimos 5
  const text5 = haikais.slice(0, 5).map((h) => h.pt).join(" ");
  const recent5Words = (text5.match(/[a-záàâãéêíóôõúç]+/gi) || [])
    .map((w) => w.toLowerCase())
    .filter((w) => w.length >= 4 && !STOP_WORDS.has(normalize(w)));

  return [...new Set([...repeated, ...recent5Words])].sort();
}

function detectStructure(pt) {
  const lower = pt.toLowerCase();
  const lines = pt.split("\n").map((l) => l.trim());
  if (lower.includes("?")) return "pergunta retórica";
  if (lines.length >= 3 && lines[0] === lines[lines.length - 1]) return "repetição com variação";
  if (lines.length >= 3 && lines.filter((l) => l === lines[0]).length >= 2) return "repetição com variação";
  if (/\bmas\b/.test(lower)) return "afirmação dupla com paradoxo";
  if (/\bse\b/.test(lower) && lower.includes("?")) return "pergunta retórica";
  return null;
}

async function generateHaikai() {
  const dataPath = path.join(__dirname, "../data/haikais.json");
  let haikais = [];

  if (fs.existsSync(dataPath)) {
    const raw = fs.readFileSync(dataPath, "utf-8");
    haikais = JSON.parse(raw);
  }

  const now = new Date();
  const date = now.toISOString().split("T")[0];
  const id = now.toISOString().replace(/[:.]/g, "-");

  const maxNumber = haikais.reduce((max, h) => Math.max(max, h.number || 0), 0);
  const number = maxNumber + 1;

  const recent = haikais.slice(0, 20);
  const recentText =
    recent.length > 0
      ? "Últimos 20 haikais publicados (analise para NÃO repetir):\n\n" +
        recent.map((h, i) => `${i + 1}. ${h.pt}`).join("\n\n")
      : "Nenhum haikai anterior ainda.";

  const blockedWords = extractKeywords(haikais);
  const blockedText =
    blockedWords.length > 0
      ? `\nPALAVRAS-CHAVE PROIBIDAS (não use NENHUMA delas no haikai em português):\n${blockedWords.join(", ")}`
      : "";

  const recentStructures = recent
    .slice(0, 5)
    .map((h) => detectStructure(h.pt))
    .filter(Boolean);

  const availableEstruturas = ESTRUTURAS.filter((e) => !recentStructures.includes(e));
  const estrutura = pick(availableEstruturas.length > 0 ? availableEstruturas : ESTRUTURAS);

  const modo = pick(MODOS);
  const vertente = pick(VERTENTES);

  const userMessage = `${recentText}
${blockedText}

ESTRUTURAS já usadas nos últimos 5 (EVITE estas): ${recentStructures.length > 0 ? recentStructures.join(", ") : "nenhuma específica"}

Para o haikai de hoje, use OBRIGATORIAMENTE:
- MODO: ${modo}
- VERTENTE TEMÁTICA: ${vertente}
- ESTRUTURA: ${estrutura}

O haikai deve ser genuinamente diferente dos anteriores em tema, vocabulário e ritmo. Se não conseguir cumprir as restrições com naturalidade, prefira um caminho mais inesperado a repetir o que já existe.`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-opus-4-5",
      max_tokens: 400,
      temperature: 1,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMessage }],
    }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${await response.text()}`);
  }

  const data = await response.json();
  const text = data.content[0].text.trim();

  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("Resposta inválida da API: " + text);
    parsed = JSON.parse(match[0]);
  }

  haikais.unshift({ id, date, number, ...parsed });

  fs.writeFileSync(dataPath, JSON.stringify(haikais, null, 2), "utf-8");
  console.log(`Haikai #${number} (${id}) gerado.`);
  console.log(`  modo: ${modo}`);
  console.log(`  vertente: ${vertente}`);
  console.log(`  estrutura: ${estrutura}`);
  console.log(`  palavras proibidas: ${blockedWords.length}`);
  console.log(`PT: ${parsed.pt}`);
}

generateHaikai().catch((err) => {
  console.error(err);
  process.exit(1);
});
