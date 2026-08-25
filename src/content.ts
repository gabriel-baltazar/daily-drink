import type { CoffeeEntry, WineEntry } from "./types";

export const IMG = {
  espresso:
    "https://image.qwenlm.ai/generated-images/e60f1f21-199a-40c1-89ba-fdd6db74f4cf/_result.png",
  coffeeBag:
    "https://image.qwenlm.ai/generated-images/c8a569ad-a9d9-4f8f-8620-4f36a4a7d7bc/_result.png",
  malbec:
    "https://image.qwenlm.ai/generated-images/d25bb82d-b769-443f-a879-1dc026d55f6e/_result.png",
  auth:
    "https://image.qwenlm.ai/generated-images/62b50a60-b0f8-4ac0-ae8e-0565701c76de/_result.png",
};

/* ---------------- frases do diário ---------------- */

export const QUOTES: Record<"coffee" | "wine", string[]> = {
  coffee: [
    "Cada extração conta uma história diferente.",
    "Hoje pode ser a melhor xícara que você já fez.",
    "Pequenos ajustes mudam tudo na xícara.",
    "O melhor café é o que faz sentido para você.",
    "Provar devagar é a melhor receita que existe.",
  ],
  wine: [
    "Você não precisa saber tudo sobre vinho para começar a perceber mais.",
    "Cada taça ensina um pouco sobre o seu gosto.",
    "Devagar se percebe mais.",
    "O melhor vinho é o que acompanha bem o seu momento.",
    "Anotar hoje é lembrar melhor amanhã.",
  ],
};

/* ---------------- ajustador de extração ---------------- */

export interface TroubleOption {
  id: string;
  label: string;
  title: string;
  body: string;
  steps: { title: string; detail: string }[];
  tip: string;
}

export const EXTRACTION_TROUBLE: TroubleOption[] = [
  {
    id: "muito-azedo",
    label: "Muito azedo",
    title: "Seu café pode estar subextraído.",
    body: "Isso significa que a água talvez não tenha conseguido extrair o suficiente do café. A acidez é o que sai primeiro — os açúcares e os compostos mais pesados demoram mais para aparecer.",
    steps: [
      { title: "Moer um pouco mais fino", detail: "Uma moagem mais fina aumenta o tempo de contato da água com o café. Normalmente é o ajuste que equilibra a xícara mais rápido." },
      { title: "Aumentar um pouco o tempo de extração", detail: "Deixe a água agir alguns segundos a mais. Pequenos aumentos já mudam o resultado." },
      { title: "Usar água um pouco mais quente", detail: "Quando o método permitir, água mais quente extrai mais. Deixe essa opção por último." },
    ],
    tip: "Experimente mudar apenas uma variável por vez — assim você descobre o que funciona para o seu setup.",
  },
  {
    id: "pouco-azedo",
    label: "Um pouco azedo",
    title: "Você está perto do equilíbrio.",
    body: "Um leve azedo geralmente indica uma extração um pouco curta. Ajustes pequenos costumam resolver sem mudar tudo.",
    steps: [
      { title: "Moer só um toque mais fino", detail: "Um passo pequeno no moedor já aumenta o contato da água com o café." },
      { title: "Ou prolongar alguns segundos", detail: "Se preferir manter a moagem, estenda um pouco o tempo de contato." },
    ],
    tip: "Mude uma coisa de cada vez e compare com a xícara anterior.",
  },
  {
    id: "muito-amargo",
    label: "Muito amargo",
    title: "Seu café pode estar superextraído.",
    body: "Quando a água extrai demais, os compostos amargos dominam a xícara. As causas mais comuns são moagem muito fina ou tempo de contato longo.",
    steps: [
      { title: "Moer um pouco mais grosso", detail: "Isso diminui o tempo de contato e costuma reduzir o amargor com rapidez." },
      { title: "Reduzir o tempo de extração", detail: "Encerre um pouco antes do que de costume e prove a diferença." },
      { title: "Diminuir o contato com a água", detail: "No espresso, reduza um pouco o rendimento na xícara; no filtro, retire antes." },
    ],
    tip: "Um leve amargor pode ser agradável — o objetivo é equilíbrio, não ausência total.",
  },
  {
    id: "pouco-amargo",
    label: "Um pouco amargo",
    title: "Quase lá — só um toque a menos.",
    body: "Um amargor leve no final indica que a extração passou um pouco do ponto. Ajustes sutis resolvem.",
    steps: [
      { title: "Moer um toque mais grosso", detail: "Um passo pequeno já diminui a extração o suficiente." },
      { title: "Ou encurtar alguns segundos", detail: "Finalize a extração um pouco mais cedo e compare." },
    ],
    tip: "Ajuste fino é isso: mover pouco e provar de novo.",
  },
  {
    id: "fraco",
    label: "Fraco",
    title: "Pode ser questão de proporção.",
    body: "Um café fraco normalmente tem pouco café para a quantidade de água — ou uma extração curta demais para o método.",
    steps: [
      { title: "Aumentar um pouco a dose", detail: "Alguns gramas a mais de café mudam a presença da bebida na xícara." },
      { title: "Reduzir a água ou o rendimento", detail: "Menos água com a mesma dose deixa a bebida mais concentrada." },
      { title: "Moer um pouco mais fino", detail: "Mais contato com a água também aumenta a intensidade percebida." },
    ],
    tip: "Anote a proporção que funcionar — ela vira a sua receita.",
  },
  {
    id: "intenso",
    label: "Muito intenso",
    title: "Vamos suavizar um pouco.",
    body: "Intensidade demais geralmente vem de dose alta ou pouca água. Nada errado com o café — é só ajustar a receita ao seu gosto.",
    steps: [
      { title: "Reduzir um pouco a dose", detail: "Alguns gramas a menos deixam a xícara mais leve." },
      { title: "Aumentar a água ou o rendimento", detail: "Mais água dilui sem perder o caráter do café." },
      { title: "Moer um toque mais grosso", detail: "Menos extração também reduz a intensidade." },
    ],
    tip: "Seu paladar manda: não existe proporção universalmente certa.",
  },
  {
    id: "adstringente",
    label: "Seco / adstringente",
    title: "Essa secura costuma vir de extração a mais.",
    body: "A sensação de boca seca ou áspera pode aparecer quando a moagem está muito fina, o contato com a água passou do ponto ou a temperatura estava alta demais para o método.",
    steps: [
      { title: "Moer um pouco mais grosso", detail: "É o primeiro ajuste a tentar na maioria dos métodos." },
      { title: "Reduzir o tempo de contato", detail: "Encerre a extração um pouco antes." },
      { title: "Baixar levemente a temperatura", detail: "Água menos quente extrai menos compostos adstringentes." },
    ],
    tip: "Em cafés muito claros, uma leve adstringência pode ser normal — observe se ela incomoda.",
  },
  {
    id: "sem-graca",
    label: "Sem graça",
    title: "Pode faltar extração — ou frescor.",
    body: "Um café apagado geralmente subextraiu, ou o grão já passou do auge. Moagem mais fina e água mais quente costumam trazer doçura e complexidade de volta.",
    steps: [
      { title: "Moer mais fino e aumentar o tempo", detail: "Mais extração revela açúcares e notas que estavam 'presas'." },
      { title: "Usar água mais quente", detail: "Ajudar a dissolver mais compostos aromáticos." },
      { title: "Conferir a data de torra", detail: "Café rende mais nas primeiras semanas após a torra. Grão velho perde perfume." },
    ],
    tip: "Se mesmo ajustando o café seguir sem graça, o grão pode simplesmente não ser o seu favorito — e tudo bem.",
  },
];

/* ---------------- guias de aprendizado ---------------- */

export interface Guide {
  id: string;
  tag: string;
  title: string;
  body: string[];
}

export const GUIDES_COFFEE: Guide[] = [
  {
    id: "azedo",
    tag: "Extração",
    title: "Meu café ficou azedo",
    body: [
      "Acidez alta demais quase sempre aponta para subextração: a água passou rápido ou não conseguiu dissolver o suficiente do grão.",
      "Comece moendo um pouco mais fino — é o ajuste com efeito mais perceptível. Se não resolver, aumente alguns segundos de tempo de contato.",
      "Lembre: acidez não é defeito. Cafés com acidez brilhante são adorados por muita gente. O problema é só quando ela domina tudo.",
      "Mude uma variável por vez e anote o resultado. Em duas ou três tentativas você chega perto do equilíbrio.",
    ],
  },
  {
    id: "amargo",
    tag: "Extração",
    title: "Meu café ficou amargo",
    body: [
      "Amargor dominante costuma ser superextração: a água tirou demais do grão, incluindo compostos que a gente prefere deixar para lá.",
      "Tente moer mais grosso ou reduzir o tempo de extração. No espresso, um rendimento um pouco menor também ajuda.",
      "Temperatura muito alta pode contribuir — se o método permitir, desça alguns graus.",
      "Um leve amargor no final, como o de chocolate amargo, pode ser bem-vindo. O excesso é que incomoda.",
    ],
  },
  {
    id: "moagem",
    tag: "Fundamentos",
    title: "Entendendo a moagem",
    body: [
      "A moagem define a velocidade com que a água atravessa o café. Fina = mais contato, extração mais rápida e intensa. Grossa = menos contato, extração mais lenta.",
      "Cada método pede uma faixa: espresso usa moagem bem fina; V60 e filtro, média; french press, grossa.",
      "Cada moedor tem a própria escala — por isso vale mais registrar 'mais fino que ontem' do que o número em si.",
      "Na dúvida, ajuste a moagem antes de qualquer outra coisa: é a variável que mais muda a xícara.",
    ],
  },
  {
    id: "tempo",
    tag: "Fundamentos",
    title: "O que muda no tempo de extração?",
    body: [
      "Quanto mais tempo a água fica em contato com o café, mais ela extrai. Primeiro saem os ácidos, depois os açúcares, por último os amargos.",
      "Tempo curto demais tende a deixar a xícara azeda; longo demais, amarga. O meio do caminho é o equilíbrio doce.",
      "No espresso, 25–32 segundos é uma faixa comum para começar — mas é só um ponto de partida, não regra.",
      "Anote seus tempos no diário: com o histórico, você enxerga qual faixa funciona para cada café.",
    ],
  },
  {
    id: "proporcao",
    tag: "Fundamentos",
    title: "Como funciona a proporção?",
    body: [
      "Proporção é a relação entre café e água (ou bebida na xícara). No espresso, 1:2 significa que 18 g de dose viraram 36 g na xícara.",
      "No coado, uma faixa comum fica entre 1:15 e 1:17 — por exemplo, 15 g de café para 240 g de água.",
      "Menos água com a mesma dose = bebida mais intensa. Mais água = mais leve e, às vezes, mais transparente nas notas.",
      "Use a proporção para afinar intensidade e a moagem para afinar o equilíbrio entre azedo e amargo.",
    ],
  },
  {
    id: "sabores",
    tag: "Paladar",
    title: "Como perceber mais sabores no café?",
    body: [
      "Comece comparando: prove dois cafés lado a lado. As diferenças ficam óbvias quando há contraste.",
      "Deixe o café esfriar um pouco — com o calor excessivo, a gente sente menos os aromas. Morno revela muito mais.",
      "Use referências do dia a dia: 'lembra chocolate?', 'tem algo de limão?'. Não precisa acertar o nome, só notar a direção.",
      "Cheirar antes de beber conta muito. Boa parte do 'sabor' é, na verdade, aroma.",
    ],
  },
  {
    id: "conservar",
    tag: "Dia a dia",
    title: "Como conservar café",
    body: [
      "Os inimigos do café são ar, luz, calor e umidade. Guarde os grãos em pote fechado, opaco, longe do fogão.",
      "Compre em grão quando possível e moa na hora — o aroma desaparece rápido depois de moído.",
      "Evite a geladeira: a condensação prejudica o grão. Freezer só vale para porções bem vedadas e por períodos curtos.",
      "Café rende mais nas primeiras semanas após a torra. Anote a data de torra no diário para acompanhar.",
    ],
  },
  {
    id: "natural-lavado",
    tag: "Origem",
    title: "Diferença entre Natural e Lavado",
    body: [
      "São formas de processar o café depois da colheita — e mudam bastante o perfil da xícara.",
      "No natural, o grão seca com a polpa: costuma render cafés mais doces, encorpados e frutados.",
      "No lavado, a polpa sai antes da secagem: a xícara tende a ser mais limpa, brilhante e com acidez destacada.",
      "Nenhum é melhor que o outro — são caminhos diferentes. Registrar o processo no diário ajuda a descobrir do que você gosta.",
    ],
  },
];

export const GUIDES_WINE: Guide[] = [
  {
    id: "comecar",
    tag: "Degustação",
    title: "Como começar a degustar vinho",
    body: [
      "Sirva, olhe a cor, gire a taça, cheire e prove. Parece ritual, mas é só dar tempo aos sentidos.",
      "Não tente 'achar' aromas difíceis. Pergunte-se: é frutado? Doce? Seco? Leve ou pesado? Isso já é degustar.",
      "Deixe o vinho alguns minutos na taça — ele muda com o ar, e essa mudança também conta a história dele.",
      "Anote logo depois de provar, mesmo que uma linha. Memória de vinho evapora rápido.",
    ],
  },
  {
    id: "taninos",
    tag: "Sensações",
    title: "O que são taninos?",
    body: [
      "Taninos são compostos presentes na casca, semente e engaço da uva — e também na madeira onde o vinho estagia.",
      "Na boca, aparecem como aquela sensação de secura ou aspereza, parecida com chá preto forte ou banana verde.",
      "São mais presentes em tintos. Com comida (especialmente proteínas), os taninos 'amaciam'.",
      "Tanino não é defeito: dá estrutura e faz o vinho envelhecer bem. É só uma questão de quanto você gosta.",
    ],
  },
  {
    id: "acidez",
    tag: "Sensações",
    title: "O que é acidez?",
    body: [
      "É o frescor do vinho — aquilo que faz salivar, como morder uma fruta verde.",
      "Vinhos de clima frio tendem a ser mais ácidos; de clima quente, mais macios e alcoólicos.",
      "Acidez é amiga da comida: 'limpa' o paladar entre uma garfada e outra.",
      "Se um vinho parece 'chato' ou pesado, talvez falte acidez; se parece agressivo, talvez sobre.",
    ],
  },
  {
    id: "corpo",
    tag: "Sensações",
    title: "O que significa corpo?",
    body: [
      "Corpo é o 'peso' do vinho na boca — a diferença entre leite desnatado, integral e creme.",
      "Vem da combinação de álcool, taninos, açúcares e extrato. Não é medida de qualidade.",
      "Um Pinot Noir costuma ser leve; um Malbec de Mendoza, encorpado. Nenhum é melhor — são estilos.",
      "Registrar o corpo no diário ajuda a descobrir seu padrão: muita gente prefere um meio-termo.",
    ],
  },
  {
    id: "conservar",
    tag: "Dia a dia",
    title: "Como conservar vinho depois de aberto",
    body: [
      "O ar é o grande inimigo: ele oxida o vinho e apaga os aromas. Feche bem e reduza o contato com o ar.",
      "Geladeira serve para quase tudo depois de aberto — inclusive tintos. Sirva o tinto alguns minutos antes para subir a temperatura.",
      "Espumantes perdem as bolhas rápido; uma tampa própria ajuda a segurá-las por um ou dois dias.",
      "Na dúvida, confie no nariz e no gosto: se cheirar a vinagre ou maçã passada, já passou.",
    ],
  },
  {
    id: "temperatura",
    tag: "Serviço",
    title: "Qual a temperatura ideal para servir?",
    body: [
      "Gelado demais esconde aromas; quente demais ressalta o álcool. O meio-termo muda tudo.",
      "Espumantes e brancos leves: bem gelados (6–10 °C). Brancos encorpados e rosés: frios (10–12 °C).",
      "Tintos leves: ligeiramente frescos (14–16 °C). Tintos encorpados: 'frescos de adega' (16–18 °C).",
      "Regra prática: tire o tinto da garrafa uns 15 minutos antes; o branco sai da geladeira uns 10 minutos antes.",
    ],
  },
  {
    id: "rotulo",
    tag: "Rótulos",
    title: "Como entender um rótulo",
    body: [
      "Procure primeiro: produtor, uva (ou região) e safra. Com esses três você já sabe quase tudo que importa.",
      "Rótulos do 'Novo Mundo' (Argentina, Chile, Austrália) costumam nomear a uva. Os europeus, a região — Bordeaux raramente escreve 'Cabernet'.",
      "Safra é o ano da colheita. Para a maioria dos vinhos do dia a dia, mais recente = mais fresco e frutado.",
      "Teor alcoólico dá pistas de corpo: acima de 13,5% tende a ser mais encorpado.",
    ],
  },
  {
    id: "escolher",
    tag: "Dia a dia",
    title: "Como escolher vinho",
    body: [
      "Comece pelo contexto: é para acompanhar comida? Para beber sozinho? Faz calor ou frio? A resposta já elimina metade da prateleira.",
      "Comida pesada pede vinhos com estrutura; comida leve, vinhos leves. O equilíbrio entre os dois é o segredo.",
      "Varie a uva e a região de propósito — seu diário vira um mapa do seu gosto em poucos meses.",
      "Preço alto não garante gosto pessoal. Seu melhor vinho é o que você anotaria 'adorei'.",
    ],
  },
  {
    id: "aberto-dura",
    tag: "Dia a dia",
    title: "Quanto tempo um vinho aberto dura?",
    body: [
      "Em geral: tintos e brancos aguentam bem 3 a 5 dias na geladeira, fechados. Espumantes, 1 a 3 dias. Fortificados, semanas.",
      "São estimativas, não regras — vinho é vivo e cada garrafa se comporta de um jeito.",
      "Quanto menos vinho restar na garrafa, mais ar dentro, mais rápida a oxidação. Transfira para uma garrafa menor se sobrar pouco.",
      "Vinho 'passado' raramente faz mal; só perde o encanto. Observe aroma e sabor antes de servir.",
    ],
  },
  {
    id: "syrah-shiraz",
    tag: "Uvas",
    title: "Diferença entre Syrah e Shiraz",
    body: [
      "É a mesma uva — o que muda é o nome e, geralmente, o estilo.",
      "'Syrah' costuma aparecer nos rótulos franceses (Rhône): vinhos mais contidos, com pimenta, azeitona e fruta escura.",
      "'Shiraz' é o nome australiano: costuma indicar vinhos mais maduros, encorpados e generosos em fruta.",
      "Mas produtores usam os nomes também como pista de estilo — um 'Syrah' chileno pode imitar o Rhône de propósito.",
    ],
  },
  {
    id: "safra",
    tag: "Rótulos",
    title: "O que significa safra?",
    body: [
      "Safra é o ano em que as uvas foram colhidas. Clima daquele ano influencia o vinho — por isso safras 'famosas'.",
      "Para vinhos jovens e frutados, safra recente costuma ser melhor: frescor em primeiro lugar.",
      "Vinhos de guarda melhoram com anos de garrafa — mas são minoria. A maioria foi feita para ser bebida logo.",
      "Anote a safra no diário: se você provar o mesmo vinho de outro ano, a comparação fica registrada.",
    ],
  },
  {
    id: "muda-aberto",
    tag: "Degustação",
    title: "O vinho muda depois de aberto?",
    body: [
      "Sim — e bastante. O contato com o ar 'abre' o vinho: aromas se soltam, taninos amaciam.",
      "Por isso giramos a taça: aceleramos esse arejamento em miniatura.",
      "Nos primeiros dias, essa mudança é positiva. Depois, a oxidação começa a apagar o vinho.",
      "Experimente provar a mesma garrafa no dia 1 e no dia 3 — é um pequeno experimento que ensina muito.",
    ],
  },
  {
    id: "uvas-principais",
    tag: "Uvas",
    title: "Principais tipos de uva",
    body: [
      "Algumas uvas viajam o mundo: Cabernet Sauvignon, Merlot e Chardonnay aparecem em quase todo país produtor.",
      "Outras têm 'casa': Malbec na Argentina, Pinot Noir na Borgonha, Sangiovese na Toscana, Tempranillo na Espanha.",
      "Mesma uva, lugares diferentes = vinhos diferentes. Clima, solo e mão do produtor pesam tanto quanto a casta.",
      "Provar uma uva de dois países é o atalho mais divertido para entender isso.",
    ],
  },
];

/* ---------------- guias de uvas ---------------- */

export interface GrapeGuide {
  name: string;
  line: string;
  notes: string[];
  places: string[];
}

export const GRAPE_GUIDES: GrapeGuide[] = [
  {
    name: "Cabernet Sauvignon",
    line: "Estrutura e fruta escura — provavelmente a uva mais plantada do mundo.",
    notes: ["Frutas escuras", "Cassis", "Estrutura", "Taninos mais presentes"],
    places: ["França", "Chile", "Austrália", "Estados Unidos"],
  },
  {
    name: "Malbec",
    line: "Macia e generosa, encontrou na Argentina a sua segunda casa.",
    notes: ["Ameixa", "Amora", "Corpo médio a alto", "Taninos redondos"],
    places: ["Argentina", "França (Cahors)"],
  },
  {
    name: "Syrah / Shiraz",
    line: "Do contido e especiado (Rhône) ao exuberante e maduro (Austrália).",
    notes: ["Fruta preta", "Pimenta", "Especiarias", "Toque defumado"],
    places: ["França", "Austrália", "Chile"],
  },
  {
    name: "Pinot Noir",
    line: "Leve, perfumada e um pouco teimosa de cultivar — por isso tão admirada.",
    notes: ["Frutas vermelhas", "Maior leveza", "Menos taninos", "Boa acidez"],
    places: ["França (Borgonha)", "Nova Zelândia", "Chile"],
  },
  {
    name: "Merlot",
    line: "Redonda e acessível, costuma ser porta de entrada para muita gente.",
    notes: ["Ameixa", "Textura macia", "Taninos suaves"],
    places: ["França", "Chile", "Itália"],
  },
  {
    name: "Tempranillo",
    line: "A uva espanhola por excelência — fruta, couro e especiaria.",
    notes: ["Fruta vermelha", "Couro", "Especiarias", "Corpo médio"],
    places: ["Espanha", "Portugal"],
  },
  {
    name: "Sangiovese",
    line: "Coração da Toscana — acidez viva que pede comida.",
    notes: ["Cereja", "Ervas", "Acidez viva", "Taninos presentes"],
    places: ["Itália"],
  },
  {
    name: "Chardonnay",
    line: "Camaleão: fresca e cítrica sem madeira, cremosa e amanteigada com ela.",
    notes: ["Maçã", "Pera", "Frutas tropicais", "Baunilha (com carvalho)"],
    places: ["França", "Austrália", "Chile", "Brasil"],
  },
  {
    name: "Sauvignon Blanc",
    line: "Frescor direto e aromático — impossível passar despercebida.",
    notes: ["Cítrico", "Maracujá", "Ervas", "Acidez refrescante"],
    places: ["Nova Zelândia", "França (Loire)", "Chile"],
  },
  {
    name: "Riesling",
    line: "Acidez elétrica e perfume floral, do seco ao doce.",
    notes: ["Limão", "Flores brancas", "Mineralidade", "Alta acidez"],
    places: ["Alemanha", "França (Alsácia)", "Austrália"],
  },
];

export const GRAPE_DISCLAIMER =
  "Vinho varia conforme região, clima, produtor, safra e processo. Nada aqui é regra absoluta — são apenas tendências para orientar a curiosidade.";

/* ---------------- conservação depois de aberto ---------------- */

export interface KeepGuide {
  type: string;
  title: string;
  body: string[];
  window: string;
}

export const KEEP_GUIDES: KeepGuide[] = [
  {
    type: "Tinto",
    title: "Guarde na geladeira — sim, até os tintos.",
    body: [
      "Depois de aberto, o frio desacelera a oxidação. Mesmo vinhos tintos podem (e devem) ir para a geladeira.",
      "Use a própria rolha ou uma tampa adequada, tentando reduzir o contato com o ar.",
      "Na hora de servir, deixe alguns minutos fora para voltar à temperatura de consumo.",
    ],
    window: "Em geral, 3 a 5 dias. Vinhos mais leves duram um pouco menos; encorpados, um pouco mais.",
  },
  {
    type: "Branco",
    title: "Geladeira, bem fechado.",
    body: [
      "Brancos já vivem gelados, então é só fechar bem e devolver para a porta da geladeira.",
      "Os mais aromáticos (como Sauvignon Blanc) perdem perfume primeiro — aproveite cedo.",
    ],
    window: "Em geral, 3 a 5 dias. Observe aroma e sabor antes de servir.",
  },
  {
    type: "Rosé",
    title: "Trate como um branco.",
    body: [
      "Geladeira e tampa. Rosé vive do frescor — quanto antes terminar, melhor.",
    ],
    window: "Em geral, 2 a 4 dias. Se parecer 'sem vida', já passou do melhor momento.",
  },
  {
    type: "Espumante",
    title: "Geladeira + tampa própria.",
    body: [
      "Uma tampa de espumante (aquela com presilhas) segura as bolhas por mais tempo.",
      "Ainda assim, o gás diminui a cada dia — melhor consumir em breve.",
    ],
    window: "Em geral, 1 a 3 dias. Pode variar bastante conforme a tampa.",
  },
  {
    type: "Fortificado",
    title: "Você tem mais tempo.",
    body: [
      "Porto, Jerez e companhia aguentam bem mais tempo abertos, graças ao álcool e ao açúcar.",
      "Guarde fechado, em lugar fresco e escuro — ou na geladeira, sem drama.",
    ],
    window: "Em geral, algumas semanas (estilos Vintage duram menos). Pode variar — confie no nariz.",
  },
];

/* ---------------- dados de exemplo ---------------- */

const daysAgo = (n: number) => new Date(Date.now() - n * 86400000).toISOString();

export function sampleCoffees(): CoffeeEntry[] {
  return [
    {
      id: "c-sample-1",
      coffee_name: "Colômbia Huila",
      roaster: "Torrefação Origem",
      country: "Colômbia",
      region: "Huila",
      process: "Lavado",
      brew_method: "Espresso",
      dose_grams: 18,
      yield_grams: 36,
      shot_type: "double",
      grinder_setting: "12",
      grind_note: "Moagem média",
      extraction_time_seconds: 28,
      body: "Médio",
      sweetness: "Média",
      acidity: "Média",
      overall_result: "equilibrado",
      flavor_notes: ["Chocolate", "Caramelo", "Laranja"],
      personal_notes: "Ficou mais doce do que ontem. Acho que a moagem média encontrou o ponto certo.",
      photo_url: IMG.espresso,
      is_favorite: true,
      created_at: daysAgo(1),
      updated_at: daysAgo(1),
    },
    {
      id: "c-sample-2",
      coffee_name: "Brasil Cerrado",
      roaster: "Torrefação Origem",
      country: "Brasil",
      region: "Cerrado Mineiro",
      process: "Natural",
      brew_method: "V60",
      dose_grams: 15,
      brew_parameters: { water_grams: 240, temperature: 92, brew_time: 150 },
      body: "Médio",
      sweetness: "Alta",
      acidity: "Baixa",
      overall_result: "equilibrado",
      flavor_notes: ["Chocolate", "Caramelo", "Nozes"],
      personal_notes: "Doce e confortável, do jeito que eu gosto de tarde.",
      photo_url: IMG.coffeeBag,
      is_favorite: true,
      created_at: daysAgo(6),
      updated_at: daysAgo(6),
    },
    {
      id: "c-sample-3",
      coffee_name: "Etiópia Yirgacheffe",
      roaster: "Café Aurora",
      country: "Etiópia",
      region: "Yirgacheffe",
      process: "Lavado",
      brew_method: "V60",
      dose_grams: 15,
      brew_parameters: { water_grams: 250, temperature: 94, brew_time: 165 },
      body: "Leve",
      sweetness: "Média",
      acidity: "Alta",
      overall_result: "pouco-azedo",
      flavor_notes: ["Floral", "Limão", "Chá"],
      personal_notes: "Muito floral, mas senti a acidez alta demais. Da próxima vez, água um pouco mais quente.",
      is_favorite: false,
      created_at: daysAgo(20),
      updated_at: daysAgo(20),
    },
  ];
}

export function sampleWines(): WineEntry[] {
  return [
    {
      id: "w-sample-1",
      wine_name: "Catena Malbec",
      producer: "Bodega Catena Zapata",
      vintage: 2022,
      country: "Argentina",
      region: "Mendoza",
      wine_type: "Tinto",
      grapes: ["Malbec"],
      flavor_notes: ["Ameixa", "Amora", "Baunilha", "Chocolate"],
      aroma_notes: ["Ameixa", "Baunilha"],
      body: "Encorpado",
      acidity: "Média",
      tannins: "Médios",
      sweetness: "Seco",
      finish: "Longo",
      personal_rating: "adorei",
      location: "Em casa",
      company: "Júlia",
      food_pairing: "Carne",
      occasion: "Sexta-feira à noite",
      personal_notes: "Gostei bastante. No começo achei forte, mas depois de alguns minutos ficou mais frutado.",
      photo_url: IMG.malbec,
      is_favorite: true,
      created_at: daysAgo(2),
      updated_at: daysAgo(2),
    },
    {
      id: "w-sample-2",
      wine_name: "Koonunga Hill Shiraz",
      producer: "Penfolds",
      vintage: 2021,
      country: "Austrália",
      region: "Barossa Valley",
      wine_type: "Tinto",
      grapes: ["Shiraz"],
      flavor_notes: ["Amora", "Pimenta", "Defumado"],
      aroma_notes: ["Amora", "Pimenta"],
      body: "Encorpado",
      acidity: "Média",
      tannins: "Médios",
      sweetness: "Seco",
      finish: "Médio",
      personal_rating: "bastante",
      location: "Casa de amigos",
      food_pairing: "Massa",
      occasion: "Jantar com amigos",
      personal_notes: "Intenso e especiado. Combinou muito com a comida.",
      is_favorite: true,
      created_at: daysAgo(9),
      updated_at: daysAgo(9),
    },
    {
      id: "w-sample-3",
      wine_name: "Cloudy Bay Sauvignon Blanc",
      producer: "Cloudy Bay",
      vintage: 2023,
      country: "Nova Zelândia",
      region: "Marlborough",
      wine_type: "Branco",
      grapes: ["Sauvignon Blanc"],
      flavor_notes: ["Cítrico", "Frutas tropicais", "Ervas"],
      aroma_notes: ["Cítrico", "Ervas"],
      body: "Leve",
      acidity: "Alta",
      tannins: "Baixos",
      sweetness: "Seco",
      finish: "Médio",
      personal_rating: "gostei",
      location: "Restaurante",
      food_pairing: "Petiscos",
      personal_notes: "Bem fresco e aromático. Perfeito para um dia quente.",
      is_favorite: false,
      created_at: daysAgo(15),
      updated_at: daysAgo(15),
    },
  ];
}
