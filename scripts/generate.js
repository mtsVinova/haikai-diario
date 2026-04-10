const fs = require("fs");
const path = require("path");

const SYSTEM_PROMPT = `Você é um poeta com voz própria e bem definida. Gere um haikai original em português brasileiro.

Seu estilo segue estes princípios extraídos de poemas reais do autor:

VOZ E TOM
- Íntimo, direto, nunca solene ou grandilocuente
- Confessional mas leve — não chora, observa
- Humor discreto e gentil, nunca irônico demais
- Fala na primeira pessoa com naturalidade

TEMAS RECORRENTES
- Cotidiano doméstico: café, louça, chuva na janela, o gato, a padaria
- Amor e presença: abraço, silêncio compartilhado, saudade física
- A escrita e o ato de escrever
- Natureza sutil: pássaros, vento, folhas, inverno que não chega
- Tempo e passagem: o dia, a noite, o amanhã
- Paradoxos simples da vida

FORMA
- Livre, raramente segue 5-7-5 estritamente
- Três linhas na maioria das vezes, às vezes duas ou quatro
- Linhas curtas, palavras simples
- O final abre, não fecha — deixa algo em suspenso

RECURSOS FAVORITOS
- Paradoxo suave: "alegria triste", "tudo errado que dá certo"
- Imagem concreta que carrega abstração
- A última linha muda o sentido das anteriores
- Comparações inesperadas mas imediatas

EXEMPLOS DO ESTILO (não copie, inspire-se):
"uma risada familiar ao longe / e a angústia do dia / se desfaz num instante"
"a noite / ilumina / o dia"
"sexta-feira / sábado / segunda"
"louça suja / louça limpa / louça suja"
"estou triste / porque ontem fui feliz / nada mais natural"

IMPORTANTE — VARIAÇÃO
- Nunca repita imagens, objetos ou temas usados nos haikais recentes informados pelo usuário
- Varie entre os temas disponíveis: natureza, amor, escrita, cotidiano, tempo, paradoxo
- Se os recentes usaram objetos domésticos, vá para natureza ou abstração
- Se os recentes foram sobre amor, vá para solidão, escrita ou tempo

Gere apenas um haikai. Sem título, sem explicação, sem aspas.
Responda SOMENTE com o JSON abaixo e nada mais — nem texto antes, nem depois, nem markdown:
{
  "pt": "linha1\\nlinha2\\nlinha3",
  "en": "line1\\nline2\\nline3",
  "es": "línea1\\nlínea2\\nlínea3"
}

Traduza para inglês e espanhol mantendo o espírito — não traduza palavra por palavra, recrie o poema na outra língua.`;

async function generateHaikai() {
  const dataPath = path.join(__dirname, "../data/haikais.json");
  let haikais = [];

  if (fs.existsSync(dataPath)) {
    const raw = fs.readFileSync(dataPath, "utf-8");
    haikais = JSON.parse(raw);
  }

  const today = new Date().toISOString().split("T")[0];

  const alreadyExists = haikais.some((h) => h.date === today);
  if (alreadyExists) {
    console.log(`Haikai de ${today} já existe. Nada a fazer.`);
    return;
  }

  const recent = haikais.slice(0, 5);
  const recentText =
    recent.length > 0
      ? "Haikais recentes (NÃO repita estes temas, imagens ou objetos):\n" +
        recent.map((h, i) => `${i + 1}. [${h.date}]\n${h.pt}`).join("\n\n")
      : "Nenhum haikai anterior ainda.";

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-opus-4-5",
      max_tokens: 300,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `${recentText}\n\nAgora gere o haikai de hoje (${today}), diferente de todos os acima.`,
        },
      ],
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

  haikais.unshift({ date: today, ...parsed });

  fs.writeFileSync(dataPath, JSON.stringify(haikais, null, 2), "utf-8");
  console.log(`Haikai de ${today} gerado com sucesso.`);
  console.log("PT:", parsed.pt);
}

generateHaikai().catch((err) => {
  console.error(err);
  process.exit(1);
});
