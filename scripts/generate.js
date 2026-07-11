const fs = require("fs");
const path = require("path");

const SYSTEM_PROMPT = `Você é um poeta brasileiro contemporâneo que escreve haikais livres. Não haikai japonês clássico — haikai brasileiro, íntimo, do cotidiano e do pensamento.

Sua tarefa NÃO é imitar poemas prontos. É dominar um MÉTODO de composição e aplicá-lo de forma sempre nova, extrapolando, surpreendendo, indo a lugares inesperados — mas sempre reconhecível como a mesma voz.

═══ A VOZ (o que nunca muda) ═══
- Íntima e direta, como quem fala baixo. Nunca solene, nunca grandiloquente.
- Observa mais do que declara. Quando sente, observa o próprio sentir.
- Humor seco e gentil, quando aparece.
- Prefere a palavra simples à palavra bonita.
- O final abre, não fecha — deixa algo vibrando.

═══ OS MÉTODOS (as técnicas que geram o poema) ═══
Use UM método por haikai. Varie a cada vez.

1. INVERSÃO DE RELAÇÃO — troque quem faz e quem sofre a ação entre dois elementos.
   (princípio: se A normalmente afeta B, mostre B afetando A)

2. PARADOXO VIVIDO — uma contradição que, dita assim, revela uma verdade.
   (princípio: junte dois opostos que a experiência sabe serem verdadeiros juntos)

3. REPETIÇÃO QUE DESLOCA — repita uma palavra ou estrutura, mudando o sentido na volta.
   (princípio: o mesmo termo aparece duas vezes e significa coisas diferentes)

4. GESTO CONCRETO QUE VIRA ABSTRAÇÃO — um ato pequeno e físico que, na última linha, revela algo interior.
   (princípio: comece no corpo/objeto, termine no invisível)

5. AFORISMO SECO — uma pequena filosofia dita sem imagem nenhuma, direta.
   (princípio: uma frase de sabedoria que caberia numa parede)

6. PERGUNTA QUE FICA — termine com uma pergunta que não quer resposta.
   (princípio: use com MODERAÇÃO — no máximo raramente, pois vira vício)

7. OBSERVAÇÃO DO MUNDO — flagre uma cena social ou natural sem comentar, deixando ela falar.
   (princípio: mostre, não interprete)

═══ EXTRAPOLE ═══
Vá além do seu território habitual. O cotidiano não é só a cozinha e a cama — é o ônibus, o banco, a fila, a infância, o trabalho, o corpo que envelhece, a tecnologia, o estranho na rua, a comida, o dinheiro, a cidade, a política miúda do dia. Busque o assunto que você ainda não tocou.

═══ FORMA ═══
- 3 linhas normalmente; 2 ou 4 são permitidas.
- Alterne entre CURTÍSSIMO (2-4 palavras por linha) e EXPANDIDO (linhas longas, quase prosa). Não fique preso no médio.
- Sem rima, sem título, sem aspas, sem explicação.

═══ PROIBIÇÕES ABSOLUTAS ═══
- NÃO use nenhuma palavra ou tema da lista de proibições que o usuário enviar.
- NÃO repita a estrutura dos haikais recentes mostrados.
- Se sentir que está indo para um lugar já visitado, MUDE de assunto radicalmente.
- Evite clichês de poesia: alma, coração, destino, eternidade, lua, estrela, flor murcha.

═══ TRADUÇÃO ═══
Depois do português, recrie em inglês e espanhol — não traduza literal, recrie o poema mantendo o espírito e a musicalidade.

Responda SOMENTE com este JSON, nada antes ou depois:
{"pt": "linha1\\nlinha2\\nlinha3", "en": "line1\\nline2\\nline3", "es": "línea1\\nlínea2\\nlínea3"}`;

const METODOS = [
  "INVERSÃO DE RELAÇÃO — troque quem age e quem sofre a ação",
  "PARADOXO VIVIDO — uma contradição que revela verdade",
  "REPETIÇÃO QUE DESLOCA — repita mudando o sentido",
  "GESTO CONCRETO QUE VIRA ABSTRAÇÃO — do físico ao invisível",
  "AFORISMO SECO — filosofia direta sem imagem",
  "OBSERVAÇÃO DO MUNDO — flagre uma cena sem comentar",
];

const TERRITORIOS = [
  "o transporte público, a rua, a cidade",
  "o trabalho, a rotina profissional, o dinheiro",
  "a infância, a memória antiga, a família",
  "o corpo que muda, envelhece, cansa",
  "a comida, a cozinha, o alimento",
  "um estranho, alguém visto de longe",
  "a natureza fora de casa — o mato, o bicho, o tempo",
  "a tecnologia, as telas, o digital",
  "o amor e a presença do outro",
  "a mente, o pensamento, a dúvida",
  "a espera, o tempo passando",
  "um objeto comum visto de perto",
];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const STOP_WORDS = new Set([
  "a","o","e","de","do","da","dos","das","em","no","na","nos","nas","um","uma","uns","umas",
  "para","pra","por","com","sem","mas","mais","que","se","ja","so","tao","muito","pouco",
  "tudo","nada","algo","eu","tu","voce","ele","ela","nos","voces","eles","elas","me","te","lhe",
  "meu","minha","seu","sua","teu","tua","dele","dela","ser","estar","ter","ir","vir","fazer",
  "foi","era","sera","sou","esta","estou","tem","aqui","ali","la","onde","quando","como","porque",
  "ainda","sempre","nunca","ao","aos","as","pelo","pela","quem","qual","todo","toda","todos","todas",
  "este","esta","esse","essa","aquele","isto","isso","tambem","entao","depois","antes","agora","hoje",
  "ontem","amanha","sim","nao","talvez","quase","apenas","mesmo","outro","outra","vai","vou","fica",
  "sao","cabe","passa","pode","é","às","e",
]);

function normalize(w) {
  return w.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function extractBlocked(haikais) {
  // Analisa TODO o histórico para achar as muletas
  const allText = haikais.map((h) => h.pt).join(" ");
  const words = (allText.match(/[a-záàâãéêíóôõúç]+/gi) || []).map((w) => w.toLowerCase());
  const counts = {};
  for (const w of words) {
    if (w.length < 4) continue;
    if (STOP_WORDS.has(normalize(w))) continue;
    counts[w] = (counts[w] || 0) + 1;
  }
  // Palavras usadas 4+ vezes no total = muletas do projeto
  const muletas = Object.entries(counts)
    .filter(([_, c]) => c >= 4)
    .sort((a, b) => b[1] - a[1])
    .map(([w]) => w);

  // + todas as palavras fortes dos últimos 15
  const recent15 = haikais.slice(0, 15).map((h) => h.pt).join(" ");
  const recentWords = (recent15.match(/[a-záàâãéêíóôõúç]+/gi) || [])
    .map((w) => w.toLowerCase())
    .filter((w) => w.length >= 4 && !STOP_WORDS.has(normalize(w)));

  return [...new Set([...muletas, ...recentWords])].sort();
}

async function generateHaikai() {
  const dataPath = path.join(__dirname, "../data/haikais.json");
  let haikais = [];
  if (fs.existsSync(dataPath)) {
    haikais = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
  }

  const now = new Date();
  const date = now.toISOString().split("T")[0];
  const id = now.toISOString().replace(/[:.]/g, "-");
  const maxNumber = haikais.reduce((max, h) => Math.max(max, h.number || 0), 0);
  const number = maxNumber + 1;

  // Contexto amplo: últimos 40
  const recent = haikais.slice(0, 40);
  const recentText =
    recent.length > 0
      ? "HAIKAIS RECENTES (não repita nada destes — nem tema, nem imagem, nem estrutura):\n\n" +
        recent.map((h) => h.pt).join("\n·\n")
      : "Nenhum ainda.";

  const blocked = extractBlocked(haikais);
  const blockedText =
    blocked.length > 0
      ? `\n\nPALAVRAS PROIBIDAS (já muito usadas — não use NENHUMA):\n${blocked.join(", ")}`
      : "";

  const metodo = pick(METODOS);
  const territorio = pick(TERRITORIOS);

  const userMessage = `${recentText}${blockedText}

Para o haikai de HOJE (#${number}):
- MÉTODO obrigatório: ${metodo}
- TERRITÓRIO a explorar: ${territorio}

Extrapole. Vá para um lugar que os haikais recentes não foram. Se o método ou território te levar a algo inesperado e bom, siga. O pior resultado possível é soar como algo que já está na lista acima.`;

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
    if (!match) throw new Error("Resposta inválida: " + text);
    parsed = JSON.parse(match[0]);
  }

  haikais.unshift({ id, date, number, ...parsed });
  fs.writeFileSync(dataPath, JSON.stringify(haikais, null, 2), "utf-8");
  console.log(`Haikai #${number} gerado.`);
  console.log(`  método: ${metodo.split(" —")[0]}`);
  console.log(`  território: ${territorio}`);
  console.log(`  palavras proibidas: ${blocked.length}`);
  console.log(`PT: ${parsed.pt}`);
}

generateHaikai().catch((err) => {
  console.error(err);
  process.exit(1);
});
