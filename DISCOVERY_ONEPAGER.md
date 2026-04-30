# KidsTune Pre-MVP — One-Pager de Discovery

## 1. Problema

You love your kid more than anything, but the soundtrack of parenting is repetitive. Spotify Kids and YouTube Kids give you *other people's* songs — generic nursery rhymes your child has heard a thousand times. Suno lets you generate *a* song, but it's a cold, prompt-driven tool built for adults making memes, not for a parent who wants to sing their daughter's name into a lullaby at 8:47 PM while she's fighting sleep. The real pain isn't "lack of children's music." It's the absence of **your child** in the music — their name, their stuffed giraffe, the thing they said at dinner that made you laugh. No existing tool bridges that gap in under 90 seconds with zero friction.

## 2. Jobs to be Done

**JTBD 1 — Aniversário**  
*"When I'm planning my child's birthday party and want a unique song that celebrates them personally, I want to generate a custom birthday track with their name and age, so I can play it during the cake moment and watch their face light up like it's the first time they feel truly seen."*

**JTBD 2 — Hora de ninar**  
*"When my kid is resisting bedtime and asking for 'one more story,' I want to create a soft, personalized lullaby using their name and a calming theme, so I can transition them from wired to sleepy without a power struggle."*

**JTBD 3 — Momento especial improvisado**  
*"When I'm stuck in the car with a cranky toddler, waiting at the doctor's office, or dealing with a meltdown at the grocery store, I want to pull out my phone and generate a silly song about what's happening right now, so I can turn a tense moment into a laugh in under a minute."*

## 3. Personas

**Persona A — Engaged Parent (primário, 28-42, smartphone-native)**  
*"I take 47 photos of her per day. Of course I want a custom song for her — I just don't have time to learn an AI tool. Make it as easy as sending a voice note."*

**Persona B — Gift-giver (tia/tio/avô comprando presente)**  
*"I already bought her 14 toys this year. She doesn't need more plastic. A song *about her* that only exists because I made it? That's the real gift."*

**Persona C — Parent-creator long tail (repete em aniversários/festas/escola)**  
*"I made one for his birthday and the whole family cried. Now I want one for every class party, every holiday, every 'just because.' Make it fast and I'll use it forever."*

## 4. Top-5 Riscos Priorizados

| Risco | Tipo | Impacto | Probabilidade | Mitigação (1 linha) |
|---|---|---|---|---|
| Geração de áudio com Gemini retorna qualidade infantilizada ou robótica, decepcionando o parent | Produto | Alto | Alta | Validar com 5 parents reais na primeira semana; iterar prompt engineering antes de qualquer feature extra |
| Parent abandona o app no primeiro fluxo se o tempo de geração exceder 90s | Produto | Alto | Alta | Exibir progresso animado + placeholder "sua música está nascendo" com preview parcial; cache de vozes |
| Stripe mockado cria expectativa irreal de monetização e o parent não entende que é grátis | Financeiro | Médio | Média | Banner claro "🧪 Pre-MVP — 100% free durante o teste" no topo de todas as telas |
| Conteúdo gerado pode inadvertidamente incluir temas inadequados (violência, nonsense ofensivo) | Regulatório | Alto | Baixa | Incluir safety prompt no system instruction + filtro de palavras pós-geração antes de exibir |
| Bilingue EN/pt-BR aumenta complexidade de teste e dobra o escopo de validação de qualidade | Técnico | Médio | Média | Priorizar português no MVP (mercado-alvo); EN como fallback secundário sem tradução da UI |

## 5. 3 Hipóteses Falseáveis para Validar no MVP

- **H1:** Acreditamos que parents preferem uma música personalizada (com nome + tema da criança) a uma música genérica de qualidade similar. Saberemos se for verdade quando ≥ 70% dos usuários que completam a primeira geração compartilharem o link com alguém (WhatsApp, link copiado) na mesma sessão.
- **H2:** Acreditamos que o parent consegue gerar uma música completa em ≤ 90 segundos sem tutorial ou onboarding guiado. Saberemos se for verdade quando a taxa de conversão do formulário (abriu → clicou em "gerar") for ≥ 60% e o tempo médio no formulário for < 90s.
- **H3:** Acreditamos que o parent retorna ao app para um segundo momento (não aniversário) dentro de 7 dias. Saberemos se for verdade quando a taxa de retenção D7 for ≥ 25% dos usuários que geraram pelo menos 1 música.

## 6. Definition of Awesome

**Este MVP é incrível se** um parent, em menos de 2 minutos desde o primeiro clique, conseguir gerar uma música que faça seu filho sorrir, reconhecer o próprio nome na letra, e pedir "de novo" — sem que o parent precise ler um manual, criar conta, ou pagar um centavo.
