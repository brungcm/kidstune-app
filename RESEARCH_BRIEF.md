# [E1] Brief de Research — Search Intent + Gap Analysis para KidsTune

> **Alinhamento OKRs:** A1 (parent encontra a página) · B2 (content guardrails — copy não pode prometer demais)
> **Tom:** Friendly, warm, parent-to-parent. Conciso.

---

## 1. Search Intent — O que parents estão perguntando (e onde ninguém responde bem)

### 🇧🇷 Queries em português brasileiro

- **"música infantil personalizada com nome do meu filho"** — *(parcial)* Existem geradores genéricos de texto, mas nenhum entrega áudio kid-safe com o nome da criança cantado. O parent acha lista de "músicas com nome" no YouTube, mas é conteúdo estático, não personalizável.
- **"criar música para meu filho dormir"** — *(não temos)* Lullabies genéricas existem aos montes. Uma lullaby *com o nome da criança* na letra? Quase zero. Gap enorme para o JTBD de hora de ninar.
- **"música de aniversário com nome do meu filho"** — *(parcial)* Vídeos no YouTube com "Parabéns pra Você versão [nome]" existem, mas são covers avulsos, sem IA, sem personalização de tema, e sem download limpo. O parent quer algo único para o momento do bolo.
- **"aplicativo de música infantil personalizada"** — *(não temos)* Nenhum app no topo da Play/App Store oferece música gerada por IA com nome da criança. O parent pesquisa, encontra Spotify Kids, desiste.
- **"presente criativo para criança de 3 anos"** — *(mal posicionado)* Milhares de listas de presentes. Nenhuma menciona música personalizada como opção. O conteúdo existe (blog posts de presentes), mas o conceito "música como presente" não aparece.
- **"música para acalmar bebê com nome"** — *(não temos)* Parents de bebês recém-nascidos buscam por músicas calmantes. Adicionar o nome do bebê como âncora emocional é um território completamente inexplorado.
- **"como fazer meu filho se sentir especial no aniversário"** — *(mal posicionado)* Artigos de parenting dão dicas genéricas (festa, bolo, decoração). A ideia de uma música *só dele* como ritual de celebração não aparece em lugar nenhum.

### 🇺🇸 Queries em inglês

- **"songs for kids with my child's name"** — *(parcial)* YouTube tem canais que compilam "Songs that say [name]" mas são playlists estáticas. Nada sob demanda, nada com o tema que a criança ama naquele mês.
- **"lullaby with my baby's name"** — *(não temos)* Custom lullabies existem como serviço artesanal (Fiverr, Etsy — caros, demorados). Nenhuma ferramenta self-service em tempo real. Gap enorme para o mercado global.
- **"custom birthday song for child"** — *(mal posicionado)* Suno/Udio podem gerar, mas a experiência não é kid-safe (letras imprevisíveis, sem curadoria infantil) e o UX não foi feito para um parent com pressa fazendo o bolo de chocolate.
- **"AI song generator for kids safe"** — *(não temos)* O parent quer segurança, mas os geradores de música com IA (Suno, Udio, MusicFX) não têm modo criança, nem filtro de conteúdo, nem curadoria de temas infantis. Zero concorrência direta.
- **"unique gift for toddler birthday"** — *(mal posicionado)* Pinterest, Etsy, blogs de presente. Mil ideias. Nenhuma menciona "a song about your child." O gap não é de produto — é de posicionamento nas listas de gift guides.

---

## 2. 3 Angles de Copy para a Landing Page

Cada angle conecta diretamente a uma pergunta de search intent acima.

### Angle 1 — A música que chama seu filho pelo nome
> **Título:** A música que só existe pro seu filho
> **Subtítulo:** Gere uma canção personalizada com o nome dele em menos de 2 minutos. Sem aplicativo, sem complicação.
> **Conecta com:** *"música infantil personalizada com nome do meu filho"* — gap (parcial): ninguém entrega isso rápido e kid-safe.

### Angle 2 — O presente que não vira brinquedo esquecido
> **Título:** O melhor presente não tem pilha
> **Subtítulo:** Uma música feita especialmente para a criança que você ama — em 90 segundos, por menos que um cafezinho.
> **Conecta com:** *"presente criativo para criança de 3 anos"* — gap (mal posicionado): música personalizada não aparece em gift guides.

### Angle 3 — Ninar com o nome dela
> **Título:** Acalmar virou música. Com o nome dela.
> **Subtítulo:** Uma lullaby personalizada que só você pode dar — porque só você sabe o nome que ela ama ouvir.
> **Conecta com:** *"lullaby with my baby's name"* — gap (não temos): zero concorrência self-service para lullabies personalizadas.

---

## 3. 3 SEO Recommendations para o MVP (Quick Wins)

1. **Schema.org SoftwareApplication** — Inserir no `<head>` da landing page o JSON-LD de `SoftwareApplication` com `applicationCategory: "Multimedia"`, `operatingSystem: "Web"`, e `offers` com os 3 packs de pricing. Isso já educa o Google a indexar o app como ferramenta, não como blog post.

2. **Alt text descritivo em todas as imagens** — Em vez de `hero-bg.jpg`, usar `alt="Mãe sorrindo enquanto filho ouve música personalizada com o nome dele no fone de ouvido"`. O Google Images é uma fonte de tráfego subestimada para parents buscando "música infantil personalizada".

3. **Meta title + description por página de ocasião** — Criar páginas individuais (ou sub-rotas) para `/aniversario`, `/lullaby`, `/presente` com meta tags específicas. Exemplo: `/lullaby` → title: "Música para Bebê Dormir com Nome | Lullaby Personalizada | KidsTune" — cada ocasião vira uma porta de entrada SEO diferente.

---

## 4. 1 Risco de Discoverability

**Risco:** Nas primeiras 4 semanas pós-MVP, o maior risco não é a qualidade do produto — é que ninguém encontra a página. Parents não sabem que "música infantil personalizada com IA" existe como categoria, então não pesquisam por ela. As queries que eles *realmente* fazem ("música de aniversário infantil", "lullaby for baby", "presente criativo para criança") estão dominadas por gigantes como Spotify, YouTube e blogs de parenting consolidados. O Google ainda não associou o conceito "KidsTune" a essas queries porque o domínio é novo, tem zero backlinks, e o conteúdo é thin (MVP tem poucas páginas). **Mitigação:** Em vez de competir de frente por termos genéricos (impossível em 4 semanas), atacar caudas longas hiper-específicas com baixíssima concorrência — como "música de aniversário com nome João 3 anos" ou "lullaby for Sophia bear theme" — criando landing pages ultra-focadas por nome/tema/ocasião. Paralelamente, ativar um canal de distribuição fora do Google: parents compartilhando o resultado no WhatsApp é o melhor backlink orgânico que existe. Cada música gerada deve sair com um link de compartilhamento rastreável e um *social proof embed* que funciona como link building passivo.
