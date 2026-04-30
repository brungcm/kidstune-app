# [E1] Brief Estratégico — KidsTune MVP

## 1. Tamanho aproximado de mercado BR de "música infantil personalizada"

O Brasil tem cerca de 20 milhões de crianças entre 2 e 8 anos (IBGE, PNAD 2022), o que representa algo como 15 milhões de famílias com ao menos um filho nessa faixa. Todo ano, nascem ~2,6 milhões de bebês no país — cada um deles vai fazer aniversário todo ano, gerando um piso de ~20 milhões de celebrações infantis anuais. Some festas na escola, Dia das Crianças, Natal, e você passa fácil de 50 milhões de "momentos de música personalizada" por ano. O **TAM** (Total Addressable Market) aqui é o mercado de presentes e experiências infantis no Brasil — estimado em R$ 30-40 bilhões/ano (associações de brinquedos + eventos infantis). O **SAM** (Serviceable Addressable Market) é a fatia digital/sob demanda: pais que já pagam por Spotify Premium, Netflix, ou apps infantis — algo entre 10-15% desse total, ou R$ 3-6 bilhões. O **SOM** (Serviceable Obtainable Market) para um MVP em Firebase com zero marketing pago é humilde: dezenas de milhares de famílias early-adopter nos primeiros 12 meses, capturando o nicho de "presente único" em aniversários. O mercado **existe e é grande** — o risco não é demanda, é execução e educação do usuário.

## 2. 3 Personas com 1 quote cada

**Persona 1 — Ricardo, 34, São Paulo, 2 filhos (3 e 6 anos)**  
*Engaged Parent BR* — Ricardo trabalha como designer remoto e passa o dia com os filhos. Já assina Spotify Premium, usa Google Home pra colocar música pra eles, e sente que o repertório infantil do streaming é um loop sem graça. Ele quer algo que faça os meninos se sentirem especiais — e não se importa de pagar R$ 5-15 por mês por isso.  
> *"Meu filho mais velho ainda acha que a música 'Parabéns pra Você' foi escrita pra ele no dia do aniversário. Imagina se eu chegar com uma música que chama ele pelo nome e fala do dinossauro favorito dele? Ele ia pirar — e eu ia filmar e mandar pra todo grupo de família."*

**Persona 2 — Ana, 52, Belo Horizonte, tia de 3 sobrinhos**  
*Gift-giver* — Ana não tem filhos, mas é a tia presente que adora dar presentes criativos. Já cansou de dar brinquedo que perde a graça em 3 dias. Ela descobre o KidsTune por uma amiga no WhatsApp e vê na hora o potencial: um presente que é único, emocional, e cabe no bolso.  
> *"Esse ano dei um unicórnio de pelúcia que custou R$ 120 e a Sofia brincou duas vezes. Prefiro dar três músicas personalizadas por R$ 25 — uma pro aniversário, uma pro Natal, e uma 'só porque sim'. O presente sou eu, não o plástico."*

**Persona 3 — Carla, 41, diretora de escola infantil em Florianópolis**  
*Daycare Operator (pós-MVP)* — Carla administra uma creche particular com 60 crianças de 1 a 5 anos. Ela organiza festinhas mensais de aniversário coletivo e eventos de Dia das Famílias. Uma ferramenta que gerasse músicas personalizadas em lote para a turma inteira seria um diferencial competitivo.  
> *"A gente já faz apresentação de fim de ano com musiquinha adaptada. Se eu pudesse, num clique, gerar uma versão personalizada pra cada criança com o nome dela e a foto no telão, os pais iam filmar, postar, e trazer mais três amigos pra matricular. Isso é marketing orgânico que não se compra."*

## 3. Tabela de Pricing — 3 Packs Stripe (USD test mode)

| Pack | Price USD | Credits | $/credit | Targeted at | Rationale curto |
|---|---|---|---|---|---|
| **Starter** | $4.99 | 5 | $1.00 | Pais testando / presente único | Preço âncora baixo para reduzir atrito de primeira compra. Custa menos que um café especial + bolo. O usuário não precisa "pensar muito" pra decidir. |
| **Popular** | $12.99 | 15 | $0.87 | Uso recorrente (aniversários + ocasiões) | Decoy de valor: 3x os créditos por 2.6x o preço. O $/credito cai 13%, empurrando o usuário racional para este pack. É o sweet spot entre ticket e percepção de economia. |
| **Family** | $34.99 | 50 | $0.70 | Famílias multi-filhos / escola | Pack de alto valor para heavy users. Preço por crédito 30% menor que o Starter. Funciona como anchor reverso — faz o Popular parecer "sensato" e o Family parecer "inteligente para quem usa muito". |

**Estratégia de preço:** O Starter existe para ser a porta de entrada (low-commitment). O Popular existe para ser comprado. O Family existe para fazer o Popular parecer um ótimo negócio — clássica estrutura *decoy pricing* com pack superior de alto valor agregado.

## 4. 3 Hipóteses de Pricing Falseáveis

**Hipótese 1 — O Starter é porta de entrada, não o carro-chefe.**  
*Acreditamos que* a maioria dos usuários vai comprar o pack Starter na primeira vez (teste), mas a receita total virá do Popular.  
*Saberemos se for verdade quando* ≥ 60% das primeiras compras forem Starter, porém ≥ 50% da receita recorrente (usuários com >1 compra) vier do pack Popular.

**Hipótese 2 — O Family pack não canibaliza o Popular.**  
*Acreditamos que* o Family será comprado apenas por um nicho de heavy users (famílias com 3+ filhos ou daycare operators), sem reduzir significativamente as compras do Popular.  
*Saberemos se for verdade quando* o Family representar ≤ 15% do volume de transações, mas ≥ 25% da receita total, indicando que quem compra é um perfil distinto.

**Hipótese 3 — O preço do Starter ($4.99) está abaixo do limiar de dor.**  
*Acreditamos que* $4.99 é baixo o suficiente para que a decisão de compra seja emocional, não racional — o usuário não compara preço com concorrentes, só decide "quero ou não quero".  
*Saberemos se for verdade quando* a taxa de conversão de checkout (add-to-cart → pagamento confirmado) for ≥ 40% no Starter, sem correlação com tentativas de desconto ou cupom.

## 5. Decisão Estratégica Recomendada

**O pack Popular ($12.99 / 15 créditos) será o mais comprado** porque ele ocupa o ponto ideal da curva de valor percebido: o preço é baixo o suficiente para um presente espontâneo (menos que um livro infantil), mas o desconto por crédito já é visível o bastante para o pai que faz a conta de cabeça — e a estrutura de 3 packs com anchor no Family empurra naturalmente o usuário para o meio como a escolha "inteligente e sem culpa".

---

*Alinhamento OKRs: A1 (definição de mercado/personas), A3 (estratégia de pricing), B3 (hipóteses falseáveis para validação), D1 (documentação estratégica).*
