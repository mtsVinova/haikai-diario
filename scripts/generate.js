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
- Imagens batidas que já foram usadas muito nos haikais recentes (verifique a lista enviada)

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

const MODOS = ["conciso cortante", "expansivo reflexivo", "misto (primeira linha longa, outras curtas, ou vice-versa)"];
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

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
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

  // Calcula o próximo número sequencial
  const maxNumber = haikais.reduce((max, h) => Math.max(max, h.number || 0), 0);
  const number = maxNumber + 1;

  const recent = haikais.slice(0, 8);
  const recentText =
    recent.length > 0
      ? "Haikais RECENTES (evite repetir temas, imagens, objetos, estruturas sintáticas e palavras-chave destes):\n\n" +
        recent.map((h, i) => `${i + 1}. ${h.pt}`).join("\n\n")
      : "Nenhum haikai anterior ainda.";

  const modo = pick(MODOS);
  const vertente = pick(VERTENTES);

  const userMessage = `${recentText}

Para o haikai de hoje, use preferencialmente:
- MODO: ${modo}
- VERTENTE TEMÁTICA: ${vertente}

Mas sinta-se livre para quebrar essa sugestão se surgir algo melhor. O importante é que o haikai seja genuinamente diferente dos recentes acima — em tema, imagem, ritmo e estrutura.`;

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
  console.log(`Haikai #${number} (${id}) gerado (modo: ${modo}, vertente: ${vertente}).`);
  console.log("PT:", parsed.pt);
}

generateHaikai().catch((err) => {
  console.error(err);
  process.exit(1);
});
