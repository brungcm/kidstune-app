# 🎵 KidsTune

**Música infantil personalizada com IA — para os pequenos dançarem do jeitinho deles.**

🌐 **Live**: https://kidstune-dev.firebaseapp.com/

KidsTune é um web app B2C que gera músicas infantis personalizadas usando IA. Bilíngue (EN + pt-BR), construído com Vite + React 19 + TypeScript + TailwindCSS no frontend e Firebase Functions (Node 20) no backend.

---

## 🚀 Quickstart

Você precisa ter **Node.js 20** e **Java 17+** (para os Firebase Emulators) instalados.

```bash
# 1. Clone e entre no diretório
git clone https://github.com/brungcm/kidstune-app.git
cd kidstune-app

# 2. Instale todas as dependências (workspaces: frontend + functions)
npm install

# 3. Copie o arquivo de ambiente e ajuste as variáveis
cp .env.example .env

# 4. Suba o ambiente completo (emulators + frontend)
make dev

# 5. Abra no navegador
open http://localhost:5000
```

> ⚡ O `make dev` sobe o Firebase Emulators Suite (auth, functions, firestore, storage, hosting) junto com o Vite dev server. Tudo local, sem custos.

---

## 📁 Estrutura do projeto

```text
kidstune-app/
├── frontend/          # Vite + React 19 + TailwindCSS
│   └── src/
│       ├── auth.ts         # Firebase Auth + Google provider + useAuth hook
│       ├── firebase.ts     # Firebase config + emulator connection
│       ├── useCredits.ts   # Real-time Firestore credits listener
│       ├── pages/
│       │   ├── LandingPage.tsx
│       │   ├── CreatePage.tsx
│       │   ├── MinhasMusicasPage.tsx   # User's songs (protected)
│       │   ├── ComprarPage.tsx         # Buy credits (mock Stripe)
│       │   └── MockStripeCheckoutPage.tsx  # Mock checkout UI
│       └── ...
├── functions/         # Firebase Functions (Node 20)
│   └── src/
│       ├── index.ts           # Entrypoint — exports all endpoints
│       ├── health.ts          # GET /health → { ok, version }
│       ├── generate.ts        # POST /api/generate → Gemini + letra
│       ├── free-quota.ts      # POST /api/free-quota → Firestore quota
│       ├── checkout.ts        # POST /api/checkout → mock checkout URL
│       ├── webhook.ts         # POST /api/webhook/stripe → mock webhook
│       ├── pricing.ts         # Pricing config (single source of truth)
│       ├── firestore-init.ts  # User doc creation + credit helpers
│       └── __tests__/         # Testes unitários (jest)
├── firebase.json      # Config dos emulators + hosting + functions rewrites
├── Makefile           # Comandos: install, dev, smoke, clean, deploy
└── package.json       # Monorepo root (npm workspaces)
```

---

## 🛠️ Comandos úteis

| Comando       | Descrição                                      |
|---------------|------------------------------------------------|
| `make install` | Instala dependências de todos os workspaces   |
| `make dev`     | Sobe emulators + frontend em paralelo          |
| `make smoke`   | Valida se build e config estão ok              |
| `make deploy`  | Build + deploy para Firebase (hosting + functions) |
| `make clean`   | Remove `dist/`, `lib/` e `node_modules`        |

---

## 🌐 Deploy

O deploy automatizado usa Firebase Hosting + Functions.

### Manual

```bash
make deploy
```

Isso executa o pipeline completo: `npm install` nos workspaces → build do frontend → build das functions → `firebase deploy --only hosting,functions`.

> ⚠️ **Nota sobre Functions**: O deploy de Functions requer o plano **Blaze (pay-as-you-go)** do Firebase. Se o projeto estiver no plano Spark (gratuito), o deploy de functions falhará. Nesse caso, o `make deploy` faz fallback automaticamente para **hosting-only**. O frontend em `/api/*` ficará vazio até que o plano seja atualizado.

### CI/CD (GitHub Actions)

O workflow em `.github/workflows/deploy.yml` executa deploy automático em todo `push` para `main`.

**⚠️ Para ativar, configure estes secrets no GitHub:**

1. `FIREBASE_SERVICE_ACCOUNT` — conteúdo do JSON da service account do Firebase
2. `GEMINI_API_KEY` — chave da API Gemini

Vá em **Settings → Secrets and variables → Actions** e adicione os secrets acima.

---

## 🌐 Variáveis de ambiente

Veja `.env.example` para a lista completa. Nenhuma chave real está versionada.

---

## 💳 Stripe (Mock Mode)

Por padrão, o KidsTune roda em **mock mode** (`STRIPE_MODE=mock`). Nenhuma chamada real ao Stripe é feita.

### Fluxo mock:

1. Usuário clica "Comprar" em `/comprar`
2. Frontend chama `POST /api/checkout` → retorna `{ checkoutUrl: "/mock-stripe-checkout?session=...&credits=N&pack=..." }`
3. Usuário é redirecionado para `/mock-stripe-checkout` (UI estilo Stripe)
4. Após 2s, chama `POST /api/webhook/stripe` com payload simulado
5. Webhook incrementa créditos no Firestore e redireciona para `/minhas-musicas`

### Como ligar Stripe real depois

Quando quiser migrar para Stripe real, siga estes 5 passos:

1. **Set `STRIPE_MODE=real`** no `.env` e no Firebase config
2. **Set `STRIPE_SECRET_KEY`** como Firebase secret ou env var
3. **Remova o `throw`** em `functions/src/webhook.ts` no path real (substitua pela lógica real de verificação de assinatura)
4. **Deploy** as functions atualizadas
5. **Atualize `.env.example`** com as novas variáveis (STRIPE_SECRET_KEY, STRIPE_PUBLISHABLE_KEY)

> O arquivo `functions/src/pricing.ts` é o ÚNICO ponto de configuração de preços e créditos — ele não precisa ser alterado na migração.

---

## 🤖 Configurando o Gemini

Para habilitar a geração de músicas com IA:

```bash
# 1. Configure a chave da API Gemini via Firebase Functions secrets
firebase functions:secrets:set GEMINI_API_KEY

# 2. Inicie os emuladores localmente
firebase emulators:start
```

A chave é lida **exclusivamente no servidor** através de `process.env.GEMINI_API_KEY` (configurada via Firebase Secrets). Nenhuma chave de API é exposta ao frontend.

### ⚠️ Content Guardrails

O sistema de geração de conteúdo aplica as seguintes proteções:

- **Palavras bloqueadas**: violência, violência, arma, morte, morrer, matar, violence, weapon, gun, death, die, kill, drogas, drugs, sexo, sex, terror, terrorism
- **Sanitização de nome**: `kidName` é truncado em 30 caracteres, remoção de HTML tags, apenas alfanumérico + espaços + acentos
- **Validação de tema**: tema é verificado contra a lista de palavras bloqueadas antes de chamar o Gemini
- **Retry automático**: 1 tentativa extra em caso de timeout ou erro 5xx do Gemini
- **Fallback de áudio**: retorna `audioUrl: null` indicando ao frontend que use Web Speech API do browser

---

Feito com ❤️ para pais e crianças que amam música.
