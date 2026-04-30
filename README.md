# 🎵 KidsTune

**Música infantil personalizada com IA — para os pequenos dançarem do jeitinho deles.**

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

```
kidstune-app/
├── frontend/          # Vite + React 19 + TailwindCSS
│   └── src/
│       ├── locales/   # Traduções EN + pt-BR
│       └── ...
├── functions/         # Firebase Functions (Node 20)
│   └── src/
│       ├── index.ts       # Entrypoint — exporta `api`, `generate`, `freeQuota`
│       ├── health.ts      # GET /health → { ok, version }
│       ├── generate.ts    # POST /api/generate → Gemini + letra
│       ├── free-quota.ts  # POST /api/free-quota → Firestore quota
│       └── __tests__/     # Testes unitários (jest)
├── firebase.json      # Config dos emulators
├── Makefile           # Comandos: install, dev, smoke, clean
└── package.json       # Monorepo root (npm workspaces)
```

---

## 🛠️ Comandos úteis

| Comando       | Descrição                                      |
|---------------|------------------------------------------------|
| `make install` | Instala dependências de todos os workspaces   |
| `make dev`     | Sobe emulators + frontend em paralelo          |
| `make smoke`   | Valida se build e config estão ok              |
| `make clean`   | Remove `dist/`, `lib/` e `node_modules`        |

---

## 🌐 Variáveis de ambiente

Veja `.env.example` para a lista completa. Nenhuma chave real está versionada.

---

## 🤖 Configurando o Gemini

Para habilitar a geração de músicas com IA:

```bash
# 1. Configure a chave da API Gemini via Firebase Functions secrets
firebase functions:config:set gemini.apikey="<sua-chave-aqui>"

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
