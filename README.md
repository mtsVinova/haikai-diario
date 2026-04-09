# haikai diário

Um haikai novo todo dia, gerado por IA no seu estilo, publicado automaticamente.

---

## setup em 5 passos

### 1. repositório

```bash
git clone https://github.com/SEU_USUARIO/haikai-diario
cd haikai-diario
npm install
```

### 2. chave da API

No GitHub, vá em **Settings → Secrets and variables → Actions** e crie:

```
ANTHROPIC_API_KEY = sua_chave_aqui
```

### 3. testar localmente

```bash
ANTHROPIC_API_KEY=sua_chave node scripts/generate.js
npm run dev
```

Abra http://localhost:3000

### 4. Vercel

- Acesse vercel.com e importe o repositório
- Deploy automático configurado — sem ajustes necessários

### 5. ativar o cron

O arquivo `.github/workflows/daily.yml` já está configurado para rodar todo dia à meia-noite (horário de Brasília).

Para testar manualmente: GitHub → Actions → "Gerar haikai diário" → Run workflow

---

## estrutura

```
haikai-diario/
├── .github/workflows/daily.yml   cron job diário
├── scripts/generate.js           chama a Claude API
├── data/haikais.json             todos os haikais acumulados
└── src/app/
    ├── page.tsx                  haikai do dia
    ├── arquivo/page.tsx          arquivo completo
    └── components/HaikaiCard.tsx seletor de idioma
```

## como funciona

1. GitHub Actions roda o script todo dia à meia-noite
2. O script chama a API do Claude com um system prompt no seu estilo
3. O haikai é gerado em PT, traduzido para EN e ES
4. O resultado é salvo em `data/haikais.json`
5. O commit dispara um rebuild automático no Vercel
6. Em ~1 minuto o site está atualizado
