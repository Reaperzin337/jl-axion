const STORAGE_KEYS = {
  cart: "jlaxion-cart",
  favorites: "jlaxion-favorites",
  profile: "jlaxion-profile",
  auth: "jlaxion-auth",
  orders: "jlaxion-orders",
  pendingCategory: "jlaxion-pending-category"
};

let PRODUCTS = [
  {
    id: "pulse-lamp",
    name: "PulseBeam Lamp",
    category: "Lampadas",
    badge: "Luz premium",
    price: 249.9,
    oldPrice: 299.9,
    rating: 4.9,
    reviews: 124,
    shipping: "Envio expresso",
    description: "Luminaria de mesa com luz ambiente regulavel, leitura elegante e acabamento para setups premium.",
    image: "assets/pulse-lamp.svg"
  },
  {
    id: "orbit-hub",
    name: "Orbit Power Hub",
    category: "Escritorio",
    badge: "Mais vendido",
    price: 179.9,
    oldPrice: 229.9,
    rating: 4.8,
    reviews: 211,
    shipping: "Pronta entrega",
    description: "Hub compacto com energia, USB-C e organizacao para mesas que pedem praticidade sem bagunca visual.",
    image: "assets/orbit-hub.svg"
  },
  {
    id: "neo-kettle",
    name: "NeoKettle Heat",
    category: "Utilidades",
    badge: "Casa premium",
    price: 219.9,
    oldPrice: 259.9,
    rating: 4.7,
    reviews: 89,
    shipping: "Postagem em 24h",
    description: "Chaleira com controle de temperatura, visor iluminado e presenca discreta para cozinhas modernas.",
    image: "assets/neo-kettle.svg"
  },
  {
    id: "wave-mini",
    name: "WaveSound Mini",
    category: "Som",
    badge: "Som ambiente",
    price: 329.9,
    oldPrice: 399.9,
    rating: 4.8,
    reviews: 173,
    shipping: "Entrega prioritaria",
    description: "Caixa de som compacta para mesa, quarto ou studio, com presenca premium e graves bem definidos.",
    image: "assets/wave-mini.svg"
  },
  {
    id: "vertex-clean",
    name: "Vertex CleanBot",
    category: "Casa inteligente",
    badge: "Automacao",
    price: 899.9,
    oldPrice: 999.9,
    rating: 4.9,
    reviews: 58,
    shipping: "Frete premium",
    description: "Robo de limpeza com mapeamento inteligente e rotina automatizada para casas conectadas.",
    image: "assets/vertex-clean.svg"
  },
  {
    id: "prism-air",
    name: "Prism Air Crisp",
    category: "Utilidades",
    badge: "Oferta da semana",
    price: 469.9,
    oldPrice: 569.9,
    rating: 4.8,
    reviews: 145,
    shipping: "Envio rapido",
    description: "Air fryer com visual premium, painel limpo e capacidade ideal para uma rotina mais pratica.",
    image: "assets/prism-air.svg"
  },
  {
    id: "nova-desk",
    name: "NovaDesk Station",
    category: "Escritorio",
    badge: "Desk setup",
    price: 289.9,
    oldPrice: 349.9,
    rating: 4.7,
    reviews: 96,
    shipping: "Entrega agil",
    description: "Base modular para monitor, headset e acessorios com visual limpo para home office premium.",
    image: "assets/nova-desk.svg"
  },
  {
    id: "arc-mug",
    name: "ArcMug Thermal",
    category: "Utilidades",
    badge: "Dia a dia",
    price: 129.9,
    oldPrice: 159.9,
    rating: 4.6,
    reviews: 132,
    shipping: "Postagem rapida",
    description: "Caneca termica com tampa magnetica e acabamento sofisticado para rotina, escritorio ou viagem.",
    image: "assets/arc-mug.svg"
  },
  {
    id: "halo-charge",
    name: "HaloCharge Pad",
    category: "Carregadores",
    badge: "Carregador",
    price: 189.9,
    oldPrice: 239.9,
    rating: 4.8,
    reviews: 207,
    shipping: "Entrega expressa",
    description: "Base 3 em 1 para celular, relogio e fones com leitura premium e organizacao imediata.",
    image: "assets/halo-charge.svg"
  },
  {
    id: "volt-cable",
    name: "VoltCable Max 100W",
    category: "Cabos",
    badge: "Cabo",
    price: 79.9,
    oldPrice: 99.9,
    rating: 4.7,
    reviews: 318,
    shipping: "Pronta expedicao",
    description: "Cabo USB-C reforcado para carga rapida, uso intenso e composicao mais premium no setup.",
    image: "assets/volt-cable.svg"
  },
  {
    id: "aura-bulb",
    name: "AuraBulb Wi-Fi",
    category: "Lampadas",
    badge: "Lampada",
    price: 99.9,
    oldPrice: 129.9,
    rating: 4.8,
    reviews: 261,
    shipping: "Sai hoje",
    description: "Lampada inteligente com cenas, app e controle por voz para criar atmosferas mais elegantes em casa.",
    image: "assets/aura-bulb.svg"
  },
  {
    id: "grid-strip",
    name: "GridStrip Power",
    category: "Carregadores",
    badge: "Energia smart",
    price: 149.9,
    oldPrice: 189.9,
    rating: 4.7,
    reviews: 184,
    shipping: "Entrega amanha",
    description: "Regua premium com tomadas e USB para manter energia, carga e organizacao no mesmo ponto.",
    image: "assets/grid-strip.svg"
  }
];

const DEFAULT_CART = [
  { id: "orbit-hub", quantity: 1 },
  { id: "prism-air", quantity: 1 }
];

const DEFAULT_FAVORITES = ["pulse-lamp", "wave-mini", "arc-mug"];

const DEFAULT_PROFILE = {
  name: "Cliente JL AXION",
  email: "cliente@jlaxion.com.br",
  phone: "(11) 99999-0000",
  city: "Sao Paulo, SP",
  address: "Rua Axion Prime, 120",
  zip: "01000-000"
};

const GUEST_PROFILE = {
  name: "",
  email: "",
  phone: "",
  city: "",
  address: "",
  zip: ""
};

const DEFAULT_ORDERS = [
  {
    id: "AX-240318",
    placedAt: "26/03/2026",
    status: "Em separacao",
    statusTone: "warning",
    total: 529.8,
    itemCount: 2,
    summary: "Entrega expressa para Sao Paulo, SP",
    payment: "Cartao final 4087"
  },
  {
    id: "AX-240287",
    placedAt: "18/03/2026",
    status: "Entregue",
    statusTone: "success",
    total: 249.9,
    itemCount: 1,
    summary: "Compra smart para home office",
    payment: "Pix aprovado"
  }
];

const CATEGORY_META = {
  "Casa inteligente": {
    code: "CI",
    title: "Automacao e rotina inteligente para a casa",
    description: "Produtos para casa conectada, limpeza automatizada e mais praticidade no dia a dia, com visual premium e leitura simples.",
    badge: "SMART HOME",
    shipping: "Envio agil para automacao, rotina e conforto",
    subtitle: "Tecnologia pensada para deixar a casa mais leve, organizada e funcional",
    editorialTitle: "Casa inteligente com apelo real de uso",
    editorialText: "Aqui entram os itens que trazem conveniencia para o ambiente, sem cara de produto tecnico demais. A ideia e vender conforto, rotina e praticidade.",
    highlightTitle: "Por que esta categoria importa",
    highlightText: "Ela posiciona a JL AXION como uma loja que mistura tecnologia util com produtos que fazem sentido no cotidiano.",
    bullets: [
      "Automacao com linguagem visual mais leve e comercial.",
      "Boa entrada para kits com lampadas e carregadores.",
      "Categoria com forte sensacao de conveniencia e presente."
    ]
  },
  "Lampadas": {
    code: "LP",
    title: "Lampadas e luz ambiente para setups e ambientes",
    description: "Selecao de luminarias e lampadas com foco em atmosfera, leitura visual forte e ambientacao premium para casa ou escritorio.",
    badge: "LIGHTING",
    shipping: "Entrega rapida para itens de iluminacao",
    subtitle: "Luz decorativa, funcional e facil de combinar com a identidade da casa",
    editorialTitle: "Iluminacao que vende sensacao, nao apenas produto",
    editorialText: "Esta categoria ajuda a loja a parecer mais desejada e menos tecnica. A proposta e mostrar luz como elemento de atmosfera, conforto e estilo.",
    highlightTitle: "O que o cliente encontra aqui",
    highlightText: "Itens que funcionam bem em fotos, em vitrines e no uso diario, com linguagem premium e facil compreensao de valor.",
    bullets: [
      "Luminarias de mesa, lampadas Wi-Fi e luz ambiente.",
      "Produtos com alto apelo visual para home page e banners.",
      "Boa combinacao com casa inteligente e escritorio."
    ]
  },
  "Carregadores": {
    code: "CG",
    title: "Carregadores, bases e energia para todos os dias",
    description: "Bases sem fio, reguas com USB e acessorios para quem quer carregar melhor, organizar a mesa e manter tudo pronto para uso.",
    badge: "POWER PICK",
    shipping: "Entrega expressa em itens selecionados de energia",
    subtitle: "Energia organizada para mesa, cabeceira, home office e rotina mobile",
    editorialTitle: "Uma categoria com leitura comercial imediata",
    editorialText: "Carregadores costumam ser compra rapida. Por isso a pagina precisa ser direta, forte e bem explicada, com foco em conveniencia e valor percebido.",
    highlightTitle: "Como trabalhamos esta selecao",
    highlightText: "Produtos que resolvem energia, organizacao e recarga em um unico gesto, com boa vitrine para impulso e recompra.",
    bullets: [
      "Bases 3 em 1, reguas USB e pontos de carga centralizados.",
      "Categoria excelente para kits com cabos e escritorio.",
      "Boa conversao em promocoes, combos e carrinho."
    ]
  },
  "Cabos": {
    code: "CB",
    title: "Cabos resistentes para carga rapida e rotina intensa",
    description: "Cabos reforcados para celular, notebook e setup, com foco em durabilidade, velocidade e uma apresentacao mais premium.",
    badge: "FAST CABLES",
    shipping: "Pronta expedicao para itens de alto giro",
    subtitle: "Cabos com boa leitura de valor para venda recorrente e reposicao",
    editorialTitle: "Categoria pensada para giro rapido e recompra",
    editorialText: "Aqui a loja ganha profundidade comercial. Cabos funcionam bem como compra de entrada, complemento e upsell no checkout.",
    highlightTitle: "O diferencial desta pagina",
    highlightText: "Produtos simples, mas com argumento claro: resistencia, velocidade e melhor acabamento para acompanhar o resto da loja.",
    bullets: [
      "Carga rapida, reforco estrutural e uso intenso.",
      "Excelente para cross-sell com carregadores e som.",
      "Categoria pequena, objetiva e facil de decidir."
    ]
  },
  "Utilidades": {
    code: "UT",
    title: "Utilidades para cozinha, rotina e pequenos rituais",
    description: "Itens para casa e dia a dia com linguagem premium, praticidade real e leitura comercial mais clara para compra sem duvida.",
    badge: "HOME ESSENTIALS",
    shipping: "Postagem agil em itens de rotina e cozinha",
    subtitle: "Objetos uteis que deixam a rotina mais bonita, simples e organizada",
    editorialTitle: "Utilidade com mais apelo de loja premium",
    editorialText: "Aqui entram os produtos de rotina que fazem a JL AXION parecer uma marca de estilo de vida, e nao apenas tecnologia.",
    highlightTitle: "Como esta categoria foi pensada",
    highlightText: "Produtos para casa, cozinha e uso diario com boa apresentacao visual e excelente potencial para presente e recompra.",
    bullets: [
      "Categoria forte para presente, casa e rotina pessoal.",
      "Boa combinacao com lampadas, escritorio e casa inteligente.",
      "Apelo visual e funcional no mesmo nivel."
    ]
  },
  "Escritorio": {
    code: "DK",
    title: "Escritorio, setup e organizacao para mesa premium",
    description: "Hubs, bases e acessorios que deixam a mesa mais limpa, produtiva e visualmente bem resolvida para trabalho ou estudo.",
    badge: "DESK SETUP",
    shipping: "Frete rapido para mesa, hub e organizacao",
    subtitle: "Produtos para produtividade com cara de setup premium e leitura comercial forte",
    editorialTitle: "Escritorio como experiencia de uso e composicao",
    editorialText: "Mais do que vender acessorios, esta categoria mostra como a mesa pode ficar melhor organizada, mais funcional e mais bonita.",
    highlightTitle: "O foco da curadoria",
    highlightText: "Produtos que ajudam no trabalho diario e ao mesmo tempo valorizam a foto, o banner e a percepcao de marca.",
    bullets: [
      "Hubs, bases e acessorios de produtividade com boa presenca.",
      "Categoria ideal para kits com cabos, som e carregadores.",
      "Leitura limpa para home office e setups modernos."
    ]
  },
  "Som": {
    code: "SM",
    title: "Som compacto para ambiente, setup e rotina",
    description: "Caixas e acessorios de audio com leitura premium, design limpo e boa presenca em mesas, quartos e ambientes criativos.",
    badge: "AUDIO EDIT",
    shipping: "Entrega prioritaria para itens de som",
    subtitle: "Audio com visual forte para compor estilo, mesa e atmosfera",
    editorialTitle: "Som como categoria de desejo dentro da loja",
    editorialText: "Ela ajuda a JL AXION a parecer mais completa e aspiracional. E uma categoria que vende experiencia, presente e lifestyle.",
    highlightTitle: "O que faz esta pagina funcionar",
    highlightText: "Poucos itens, boa leitura de valor e presenca visual suficiente para diferenciar a loja sem poluir o catalogo.",
    bullets: [
      "Categoria de desejo para presente e decoracao de setup.",
      "Boa combinacao com escritorio, lampadas e carregadores.",
      "Poucos produtos, decisao mais simples e mais premium."
    ]
  }
};

const money = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL"
});

const state = {
  category: "Todos",
  search: "",
  searchLabel: "",
  categorySearch: ""
};

const runtimeData = {
  useBackend: false,
  isAuthenticated: false,
  isNativeApp: false,
  userId: null,
  cart: [...DEFAULT_CART],
  favorites: [...DEFAULT_FAVORITES],
  profile: { ...DEFAULT_PROFILE },
  orders: [...DEFAULT_ORDERS]
};

document.addEventListener("DOMContentLoaded", async () => {
  applyEnvironmentClasses();
  seedData();
  restorePendingCategory();
  restoreSearchState();
  await hydrateFromBackend();
  renderShell();
  ensureToastHost();
  bindSearch();
  bindForms();
  bindMenu();
  bindActions();
  renderAll();
});

function seedData() {
  removeStorage(STORAGE_KEYS.auth);

  if (!readStorage(STORAGE_KEYS.cart)) {
    writeStorage(STORAGE_KEYS.cart, DEFAULT_CART);
  }

  if (!readStorage(STORAGE_KEYS.favorites)) {
    writeStorage(STORAGE_KEYS.favorites, DEFAULT_FAVORITES);
  }

  if (!readStorage(STORAGE_KEYS.profile)) {
    writeStorage(STORAGE_KEYS.profile, DEFAULT_PROFILE);
  }

  if (!readStorage(STORAGE_KEYS.orders)) {
    writeStorage(STORAGE_KEYS.orders, DEFAULT_ORDERS);
  }

  if (!readStorage(STORAGE_KEYS.auth)) {
    writeStorage(STORAGE_KEYS.auth, { isAuthenticated: false });
  }

  runtimeData.isAuthenticated = getIsAuthenticated();
}

function isNativeAppRuntime() {
  const userAgent = window.navigator.userAgent || "";
  const hostname = window.location.hostname || "";
  return /Android|iPhone|iPad|iPod/i.test(userAgent) && hostname === "localhost";
}

function applyEnvironmentClasses() {
  runtimeData.isNativeApp = isNativeAppRuntime();
  document.body.classList.toggle("native-app", runtimeData.isNativeApp);
}

function readStorage(key) {
  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    return null;
  }
}

function writeStorage(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    return null;
  }

  return value;
}

function removeStorage(key) {
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    return null;
  }

  return true;
}

function readTransientState(key) {
  try {
    const value = window.sessionStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    return null;
  }
}

function writeTransientState(key, value) {
  try {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    return null;
  }

  return value;
}

async function hydrateFromBackend() {
  if (!window.location.protocol.startsWith("http")) {
    return;
  }

  try {
    const bootstrap = await apiRequest("/api/bootstrap");

    if (!bootstrap) {
      return;
    }

    PRODUCTS = Array.isArray(bootstrap.products) && bootstrap.products.length
      ? bootstrap.products
      : PRODUCTS;

    runtimeData.useBackend = true;
    runtimeData.isAuthenticated = Boolean(bootstrap.session?.isAuthenticated);
    runtimeData.userId = bootstrap.session?.userId || null;
    runtimeData.cart = Array.isArray(bootstrap.cart) ? bootstrap.cart : [...DEFAULT_CART];
    runtimeData.favorites = Array.isArray(bootstrap.favorites) ? bootstrap.favorites : [...DEFAULT_FAVORITES];
    runtimeData.profile = bootstrap.profile ? { ...DEFAULT_PROFILE, ...bootstrap.profile } : { ...DEFAULT_PROFILE };
    runtimeData.orders = Array.isArray(bootstrap.orders) ? bootstrap.orders : [...DEFAULT_ORDERS];
  } catch (error) {
    runtimeData.useBackend = false;
  }
}

async function apiRequest(url, options = {}) {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 8000);
  const nextOptions = {
    method: options.method || "GET",
    credentials: "same-origin",
    signal: controller.signal,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(options.headers || {})
    }
  };

  if (options.body) {
    nextOptions.body = JSON.stringify(options.body);
  }

  try {
    const response = await window.fetch(url, nextOptions);
    const isJson = response.headers.get("content-type")?.includes("application/json");
    const payload = isJson ? await response.json() : null;

    if (!response.ok) {
      const message = payload?.message || "Nao foi possivel concluir a operacao.";
      throw new Error(message);
    }

    return payload;
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("A API demorou demais para responder.");
    }
    throw error;
  } finally {
    window.clearTimeout(timeoutId);
  }
}

function applyRuntimePatch(payload) {
  if (!payload) {
    return;
  }

  if (Array.isArray(payload.products) && payload.products.length) {
    PRODUCTS = payload.products;
  }

  if (payload.session) {
    runtimeData.isAuthenticated = Boolean(payload.session.isAuthenticated);
    runtimeData.userId = runtimeData.isAuthenticated ? (payload.session.userId || runtimeData.userId) : null;
  }

  if (Array.isArray(payload.cart) && runtimeData.isAuthenticated) {
    runtimeData.cart = payload.cart;
  }

  if (Array.isArray(payload.favorites) && runtimeData.isAuthenticated) {
    runtimeData.favorites = payload.favorites;
  }

  if (payload.profile) {
    runtimeData.profile = runtimeData.isAuthenticated
      ? { ...DEFAULT_PROFILE, ...payload.profile }
      : { ...GUEST_PROFILE };
  }

  if (payload.user) {
    runtimeData.profile = { ...DEFAULT_PROFILE, ...payload.user };
  }

  if (Array.isArray(payload.orders) && runtimeData.isAuthenticated) {
    runtimeData.orders = payload.orders;
  }

  if (!runtimeData.isAuthenticated) {
    runtimeData.cart = [];
    runtimeData.favorites = [];
    runtimeData.orders = [];
  }
}

async function refreshRuntimeData() {
  if (!runtimeData.useBackend) {
    return;
  }

  const payload = await apiRequest("/api/bootstrap");
  applyRuntimePatch(payload);
}

async function signOut() {
  try {
    if (runtimeData.useBackend) {
      const payload = await apiRequest("/api/auth/logout", {
        method: "POST"
      });
      applyRuntimePatch(payload);
      await refreshRuntimeData();
    } else {
      setLocalAuthState(false);
      setProfile({ ...GUEST_PROFILE });
      setOrders([]);
    }

    runtimeData.isAuthenticated = false;
    runtimeData.userId = null;
    refreshShellUi();
    showToast("Sessao encerrada.");
    window.setTimeout(() => {
      window.location.href = "login.html";
    }, 350);
  } catch (error) {
    showToast(error.message);
  }
}

function getCart() {
  if (runtimeData.useBackend) {
    return runtimeData.cart;
  }

  return readStorage(STORAGE_KEYS.cart) || [];
}

function setCart(cart) {
  runtimeData.cart = [...cart];

  if (runtimeData.useBackend) {
    return runtimeData.cart;
  }

  return writeStorage(STORAGE_KEYS.cart, cart);
}

function getFavorites() {
  if (runtimeData.useBackend) {
    return runtimeData.favorites;
  }

  return readStorage(STORAGE_KEYS.favorites) || [];
}

function setFavorites(favorites) {
  runtimeData.favorites = [...favorites];

  if (runtimeData.useBackend) {
    return runtimeData.favorites;
  }

  return writeStorage(STORAGE_KEYS.favorites, favorites);
}

function getProfile() {
  if (runtimeData.useBackend) {
    return runtimeData.profile;
  }

  return readStorage(STORAGE_KEYS.profile) || DEFAULT_PROFILE;
}

function setProfile(profile) {
  runtimeData.profile = { ...profile };

  if (runtimeData.useBackend) {
    return runtimeData.profile;
  }

  return writeStorage(STORAGE_KEYS.profile, profile);
}

function getOrders() {
  if (runtimeData.useBackend) {
    return runtimeData.orders;
  }

  return readStorage(STORAGE_KEYS.orders) || DEFAULT_ORDERS;
}

function setOrders(orders) {
  runtimeData.orders = [...orders];

  if (runtimeData.useBackend) {
    return runtimeData.orders;
  }

  return writeStorage(STORAGE_KEYS.orders, orders);
}

function getIsAuthenticated() {
  if (runtimeData.useBackend) {
    return runtimeData.isAuthenticated;
  }

  return Boolean(readTransientState(STORAGE_KEYS.auth)?.isAuthenticated);
}

function setLocalAuthState(isAuthenticated) {
  runtimeData.isAuthenticated = Boolean(isAuthenticated);

  if (runtimeData.useBackend) {
    return runtimeData.isAuthenticated;
  }

  return writeTransientState(STORAGE_KEYS.auth, {
    isAuthenticated: Boolean(isAuthenticated)
  });
}

function getViewerProfile() {
  return getIsAuthenticated() ? getProfile() : { ...GUEST_PROFILE };
}

function readSession(key) {
  try {
    return window.sessionStorage.getItem(key);
  } catch (error) {
    return null;
  }
}

function writeSession(key, value) {
  try {
    window.sessionStorage.setItem(key, value);
  } catch (error) {
    return null;
  }

  return value;
}

function removeSession(key) {
  try {
    window.sessionStorage.removeItem(key);
  } catch (error) {
    return null;
  }
}

function renderShell() {
  const shell = document.querySelector("[data-site-shell]");

  if (!shell) {
    return;
  }

  const isAuthenticated = getIsAuthenticated();
  const greetingName = getGreetingName();
  const accountHref = isAuthenticated ? "account.html" : "login.html";
  const accountLabel = isAuthenticated ? `Ola, ${greetingName}` : "Login";
  const accountNavPage = isAuthenticated ? "account" : "login";
  const useCompactSearchCopy = runtimeData.isNativeApp || window.matchMedia("(max-width: 780px)").matches;
  const searchPlaceholder = useCompactSearchCopy
    ? "Buscar produtos"
    : "Buscar carregadores, lampadas, cabos, som...";
  const drawerAccountEntry = isAuthenticated
    ? drawerLink("account", "account.html", "Minha conta", "Perfil e pedidos")
    : drawerLink("login", "login.html", "Minha conta", "Entre para acessar seus dados");
  const authDrawerEntry = isAuthenticated
    ? drawerLink("account", "account.html", `Ola, ${greetingName}`, "Perfil, pedidos e dados salvos")
    : "";

  shell.innerHTML = `
    <div class="top-strip">
      <div class="top-strip__inner">
        <span>Frete gratis acima de R$ 600 | Ate 10x sem juros | Casa, setup, energia e utilidades em uma so curadoria</span>
      </div>
    </div>

    <header class="site-header">
      <div class="site-header__inner">
        <div class="site-header__top">
          <div class="brand-cluster">
            <button type="button" class="menu-toggle" data-menu-button aria-label="Abrir menu">
              <span class="menu-icon">
                <span></span>
                <span></span>
                <span></span>
              </span>
            </button>

            <a class="brand" href="index.html" aria-label="Ir para a home da JL AXION">
              <img class="brand__logo" src="assets/jl-axion-lockup.svg" alt="JL AXION">
            </a>
          </div>

          <form class="site-header__search" data-site-search-form role="search" aria-label="Buscar produtos na JL AXION">
            <label class="site-search" for="site-search-input">
              <span class="site-search__icon" aria-hidden="true">${icon("search")}</span>
              <input
                id="site-search-input"
                type="search"
                class="site-search__input"
                placeholder="${searchPlaceholder}"
                autocomplete="off"
                enterkeyhint="search"
                value="${escapeAttribute(state.searchLabel)}"
                data-search-input
              >
            </label>
            <button type="submit" class="site-search__submit" aria-label="Buscar">
              <span class="site-search__submit-icon" aria-hidden="true">${icon("search")}</span>
              <span class="site-search__submit-label">Buscar</span>
            </button>
          </form>

          <div class="header-actions">
            <a class="action-link" href="favorites.html">
              ${icon("heart")}
              <span>Favoritos</span>
              <span class="count-badge" data-favorites-count>0</span>
            </a>
            <a class="action-link" href="cart.html">
              ${icon("cart")}
              <span>Carrinho</span>
              <span class="count-badge" data-cart-count>0</span>
            </a>
            <a class="action-link action-link--account" href="${accountHref}" data-account-entry>
              ${icon("user")}
              <span data-account-entry-label>${accountLabel}</span>
            </a>
          </div>
        </div>

        <div class="site-header__navrow">
          <nav class="nav-links" aria-label="Navegacao principal">
            ${navLink("home", "index.html", "Inicio")}
            ${navLink("promotions", "promotions.html", "Promocoes")}
            ${navLink("favorites", "favorites.html", "Favoritos")}
            ${navLink("cart", "cart.html", "Carrinho")}
            ${navLink(accountNavPage, accountHref, "Minha conta")}
          </nav>
        </div>
      </div>
    </header>

    <div class="drawer-overlay" data-menu-overlay></div>

    <aside class="drawer" data-menu-drawer aria-hidden="true">
      <div class="drawer__header">
        <a class="brand" href="index.html">
          <img class="brand__logo" src="assets/jl-axion-lockup.svg" alt="JL AXION">
        </a>
        <button type="button" class="icon-button drawer__close" data-menu-close aria-label="Fechar menu">
          ${icon("close")}
        </button>
      </div>

      <div class="drawer__section">
        <h2>Paginas</h2>
        <div class="drawer__group">
          ${drawerLink("home", "index.html", "Inicio", "Vitrine e categorias")}
          ${drawerLink("promotions", "promotions.html", "Promocoes", "Cupons, frete e combos")}
          ${drawerLink("favorites", "favorites.html", "Favoritos", "Lista de desejos")}
          ${drawerLink("cart", "cart.html", "Carrinho", "Resumo da compra")}
          ${drawerAccountEntry}
          ${authDrawerEntry}
          ${drawerLink("admin", "admin.html", "Admin", "Painel da loja")}
        </div>
      </div>

      <div class="drawer__section">
        <h2>Categorias</h2>
        <div class="drawer-category-grid">
          ${getCategoryNames().map((category) => drawerCategoryCard(category)).join("")}
        </div>
      </div>

      <div class="drawer-promo">
        <span class="eyebrow">Oferta em destaque</span>
        <h2>AXION15</h2>
        <p>Use o cupom em utilidades e iluminacao selecionadas para compor pedidos mais completos com melhor custo.</p>
      </div>
    </aside>

    <footer class="site-footer">
      <div class="site-footer__inner">
        <div>
          <strong>JL AXION</strong>
          <span>Utilidades e tecnologia com foco em casa, setup, energia, iluminacao e rotina premium.</span>
        </div>
        <div>
          <strong>Compra simples</strong>
          <span>Escolha a categoria, explore os produtos, salve favoritos e finalize com clareza.</span>
        </div>
        <div>
          <strong>Entrega e ofertas</strong>
          <span>Promocoes, frete vantajoso e textos pensados para guiar sem poluir a experiencia.</span>
        </div>
      </div>
    </footer>
  `;

  updateCounts();
  updateProfileText();
}

function navLink(page, href, label) {
  const active = document.body.dataset.page === page;
  return `<a class="nav-link${active ? " is-active" : ""}" href="${href}"${active ? ' aria-current="page"' : ""}>${label}</a>`;
}

function drawerLink(page, href, label, subtitle) {
  const active = document.body.dataset.page === page;
  return `
    <a class="drawer-link${active ? " is-active" : ""}" href="${href}"${active ? ' aria-current="page"' : ""}>
      <span>${label}</span>
      <small>${subtitle}</small>
    </a>
  `;
}

function drawerCategoryCard(category) {
  const meta = getCategoryMeta(category);
  const productCount = getCategoryProducts(category).length;

  return `
    <button type="button" class="drawer-category-card" data-action="open-category" data-category="${category}">
      <span class="drawer-category-card__code">${meta.code}</span>
      <div class="drawer-category-card__meta">
        <strong>${category}</strong>
        <small>${productCount} ${productCount === 1 ? "item" : "itens"}</small>
      </div>
    </button>
  `;
}

function bindMenu() {
  const body = document.body;
  const openButton = document.querySelector("[data-menu-button]");
  const closeButton = document.querySelector("[data-menu-close]");
  const overlay = document.querySelector("[data-menu-overlay]");
  const drawer = document.querySelector("[data-menu-drawer]");

  if (!openButton || !closeButton || !overlay || !drawer) {
    return;
  }

  const closeMenu = () => {
    body.classList.remove("menu-open");
    drawer.setAttribute("aria-hidden", "true");
  };

  const openMenu = () => {
    body.classList.add("menu-open");
    drawer.setAttribute("aria-hidden", "false");
  };

  openButton.addEventListener("click", openMenu);
  closeButton.addEventListener("click", closeMenu);
  overlay.addEventListener("click", closeMenu);

  drawer.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });
}

function bindSearch() {
  const searchForms = document.querySelectorAll("[data-site-search-form]");
  const searchInputs = document.querySelectorAll("[data-search-input]");

  if (!searchForms.length && !searchInputs.length) {
    return;
  }

  syncSearchInputs(state.searchLabel);

  searchInputs.forEach((searchInput) => {
    searchInput.addEventListener("input", (event) => {
      const rawValue = event.target.value;
      state.searchLabel = rawValue.trim();
      state.search = state.searchLabel.toLowerCase();
      syncSearchInputs(rawValue, event.target);

      if (document.body.dataset.page === "home") {
        updateHomeSearchUrl();
        renderHomeProducts();
      }
    });
  });

  searchForms.forEach((searchForm) => {
    searchForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const formInput = searchForm.querySelector("[data-search-input]");
      const rawValue = formInput ? formInput.value : "";

      state.searchLabel = String(rawValue || "").trim();
      state.search = state.searchLabel.toLowerCase();

      if (document.body.dataset.page === "home") {
        updateHomeSearchUrl();
        renderHomeProducts();
        scrollToCatalog();
        return;
      }

      window.location.href = buildHomeSearchHref(state.searchLabel);
    });
  });
}

function bindForms() {
  const loginForm = document.querySelector("[data-login-form]");
  const accountForm = document.querySelector("[data-account-form]");

  if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(loginForm);
      const name = String(formData.get("name") || "").trim();
      const email = String(formData.get("email") || "").trim();
      const password = String(formData.get("password") || "").trim();

      if (!email || !password) {
        showToast("Preencha e-mail e senha para continuar.");
        return;
      }

      if (password.length < 6) {
        showToast("Sua senha precisa ter pelo menos 6 caracteres.");
        return;
      }

      try {
        if (runtimeData.useBackend) {
          const payload = await apiRequest("/api/auth/login", {
            method: "POST",
            body: {
              name,
              email,
              password
            }
          });

          applyRuntimePatch(payload);
          await refreshRuntimeData();
          refreshShellUi();
          showToast(payload.message || "Login concluido. Redirecionando para Minha Conta.");
        } else {
          const current = getViewerProfile();
          const nextProfile = {
            ...current,
            name: name || current.name,
            email: email || current.email
          };

          setProfile(nextProfile);
          setLocalAuthState(true);
          refreshShellUi();
          showToast("Conta criada com sucesso. Redirecionando para Minha Conta.");
        }

        window.setTimeout(() => {
          window.location.href = "account.html";
        }, 700);
      } catch (error) {
        showToast(error.message);
      }
    });
  }

  if (accountForm) {
    if (!getIsAuthenticated()) {
      return;
    }

    const profile = getProfile();
    accountForm.elements.name.value = profile.name || "";
    accountForm.elements.email.value = profile.email || "";
    accountForm.elements.phone.value = profile.phone || "";
    accountForm.elements.city.value = profile.city || "";

    accountForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(accountForm);
      const nextProfile = {
        name: String(formData.get("name") || "").trim() || DEFAULT_PROFILE.name,
        email: String(formData.get("email") || "").trim() || DEFAULT_PROFILE.email,
        phone: String(formData.get("phone") || "").trim() || DEFAULT_PROFILE.phone,
        city: String(formData.get("city") || "").trim() || DEFAULT_PROFILE.city
      };

      try {
        if (runtimeData.useBackend) {
          const payload = await apiRequest("/api/profile", {
            method: "PUT",
            body: {
              ...getProfile(),
              ...nextProfile
            }
          });
          applyRuntimePatch(payload);
        } else {
          setProfile(nextProfile);
        }

        refreshShellUi();
        showToast(runtimeData.useBackend ? "Perfil atualizado no backend." : "Perfil atualizado nesta demonstracao.");
      } catch (error) {
        showToast(error.message);
      }
    });
  }
}

function bindActions() {
  document.addEventListener("click", async (event) => {
    const target = event.target.closest("[data-action]");

    if (!target) {
      return;
    }

    const action = target.dataset.action;
    const productId = target.dataset.id;

    if (action === "toggle-password") {
      const input = target.parentElement.querySelector("input");
      const isPassword = input.type === "password";
      input.type = isPassword ? "text" : "password";
      target.textContent = isPassword ? "Ocultar" : "Mostrar";
      return;
    }

    if (action === "logout") {
      await signOut();
      return;
    }

    if (action === "toggle-favorite" && productId) {
      await toggleFavorite(productId);
      renderAll();
      return;
    }

    if (action === "add-to-cart" && productId) {
      await addToCart(productId);
      renderAll();
      return;
    }

    if (action === "remove-cart-item" && productId) {
      await removeCartItem(productId);
      renderAll();
      return;
    }

    if ((action === "decrease-quantity" || action === "increase-quantity") && productId) {
      const change = action === "increase-quantity" ? 1 : -1;
      await changeQuantity(productId, change);
      renderAll();
      return;
    }

    if (action === "open-category") {
      const category = target.dataset.category || getCategoryNames()[0];
      state.categorySearch = "";
      closeDrawer();
      window.location.href = buildCategoryHref(category);
      return;
    }

    if (action === "set-category") {
      const category = target.dataset.category || "Todos";
      state.category = category;
      renderHomeProducts();
      closeDrawer();

      if (document.body.dataset.page !== "home") {
        writeSession(STORAGE_KEYS.pendingCategory, category);
        window.location.href = `index.html#catalogo`;
      } else if (target.classList.contains("quick-link") || target.classList.contains("department-card")) {
        const catalog = document.getElementById("catalogo");
        if (catalog) {
          catalog.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }

      return;
    }

    if (action === "move-all-favorites") {
      await moveAllFavoritesToCart();
      renderAll();
      return;
    }

    if (action === "checkout") {
      window.location.href = "checkout.html";
      return;
    }

    if (action === "clear-search") {
      state.search = "";
      state.searchLabel = "";
      state.category = "Todos";
      syncSearchInputs("");
      updateHomeSearchUrl();
      renderHomeProducts();
    }
  });
}

function renderAll() {
  updateCounts();
  updateProfileText();
  renderHomeCollections();
  renderHomeProducts();
  renderPromotionProducts();
  renderCartPage();
  renderFavoritePage();
  renderAccountPage();
  renderCategoryPage();
  renderCheckoutPage();
  renderProductPage();
}

function refreshShellUi() {
  renderShell();
  bindSearch();
  bindMenu();
  renderAll();
}

function updateCounts() {
  const cartCount = getCart().reduce((total, item) => total + item.quantity, 0);
  const favoritesCount = getFavorites().length;
  const ordersCount = getOrders().length;

  document.querySelectorAll("[data-cart-count]").forEach((element) => {
    element.textContent = String(cartCount);
  });

  document.querySelectorAll("[data-favorites-count]").forEach((element) => {
    element.textContent = String(favoritesCount);
  });

  const cartMetric = document.querySelector("[data-cart-total-items]");
  const favoritesMetric = document.querySelector("[data-saved-count]");
  const favoritesHeroMetric = document.querySelector("[data-favorites-total]");

  if (cartMetric) {
    cartMetric.textContent = String(cartCount);
  }

  if (favoritesMetric) {
    favoritesMetric.textContent = String(favoritesCount);
  }

  if (favoritesHeroMetric) {
    favoritesHeroMetric.textContent = `${favoritesCount} produtos`;
  }

  document.querySelectorAll("[data-order-count]").forEach((element) => {
    element.textContent = String(ordersCount);
  });
}

function updateProfileText() {
  const profile = getViewerProfile();
  const firstName = getGreetingName();
  const isAuthenticated = getIsAuthenticated();

  document.querySelectorAll("[data-profile-name]").forEach((element) => {
    element.textContent = firstName;
  });

  document.querySelectorAll("[data-profile-email]").forEach((element) => {
    element.textContent = isAuthenticated ? (profile.email || DEFAULT_PROFILE.email) : "Entre para acompanhar seus pedidos";
  });

  document.querySelectorAll("[data-account-entry-label]").forEach((element) => {
    element.textContent = isAuthenticated ? `Ola, ${firstName}` : "Login";
  });

  document.querySelectorAll("[data-account-entry]").forEach((element) => {
    element.setAttribute("href", isAuthenticated ? "account.html" : "login.html");
  });
}

function getGreetingName() {
  if (!getIsAuthenticated()) {
    return "Cliente";
  }

  const profile = getProfile();
  const baseName = (profile.name || DEFAULT_PROFILE.name).trim();
  return baseName.split(" ")[0] || "Cliente";
}

function restorePendingCategory() {
  const pendingCategory = readSession(STORAGE_KEYS.pendingCategory);

  if (pendingCategory) {
    state.category = pendingCategory;
    removeSession(STORAGE_KEYS.pendingCategory);
  }
}

function restoreSearchState() {
  if (document.body.dataset.page !== "home") {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const currentQuery = String(params.get("q") || "").trim();
  state.searchLabel = currentQuery;
  state.search = currentQuery.toLowerCase();
}

function buildHomeSearchHref(searchValue = "") {
  const normalized = String(searchValue || "").trim();
  return normalized
    ? `index.html?q=${encodeURIComponent(normalized)}#catalogo`
    : "index.html#catalogo";
}

function syncSearchInputs(value, sourceInput = null) {
  document.querySelectorAll("[data-search-input]").forEach((input) => {
    if (input !== sourceInput) {
      input.value = value;
    }
  });
}

function updateHomeSearchUrl() {
  if (document.body.dataset.page !== "home" || typeof window.history.replaceState !== "function") {
    return;
  }

  const nextUrl = new URL(window.location.href);

  if (state.searchLabel) {
    nextUrl.searchParams.set("q", state.searchLabel);
  } else {
    nextUrl.searchParams.delete("q");
  }

  if (window.location.hash === "#catalogo" || state.searchLabel) {
    nextUrl.hash = "catalogo";
  }

  window.history.replaceState({}, "", nextUrl);
}

function scrollToCatalog() {
  const catalog = document.getElementById("catalogo");

  if (catalog) {
    catalog.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function renderHomeProducts() {
  const container = document.querySelector("[data-featured-products]");
  const meta = document.querySelector("[data-catalog-meta]");

  if (!container) {
    return;
  }

  const results = PRODUCTS.filter((product) => {
    const matchesCategory = state.category === "Todos" || product.category === state.category;
    const needle = `${product.name} ${product.category} ${product.description}`.toLowerCase();
    const matchesSearch = !state.search || needle.includes(state.search);
    return matchesCategory && matchesSearch;
  });

  updateCategoryButtons();

  if (!results.length) {
    if (meta) {
      meta.textContent = "Nenhum item combinou com os filtros atuais. Ajuste a busca para voltar a explorar a vitrine.";
    }

    container.innerHTML = emptyState(
      "Nenhum produto encontrado",
      "Ajuste a pesquisa ou volte para todos os itens da vitrine.",
      '<button type="button" class="secondary-btn" data-action="clear-search">Limpar filtros</button>'
    );
    return;
  }

  const visibleResults = !state.search && state.category === "Todos"
    ? results.slice(0, 8)
    : results;

  if (meta) {
    meta.textContent = buildCatalogMeta(results.length, visibleResults.length);
  }

  container.innerHTML = visibleResults.map((product) => productCard(product)).join("");
}

function renderPromotionProducts() {
  const container = document.querySelector("[data-promo-products]");

  if (!container) {
    return;
  }

  container.innerHTML = PRODUCTS.slice(0, 8).map((product) => productCard(product, { promo: true })).join("");
}

function renderCartPage() {
  const itemsContainer = document.querySelector("[data-cart-items]");
  const summaryContainer = document.querySelector("[data-cart-summary]");
  const recommendations = document.querySelector("[data-cart-recommendations]");

  if (!itemsContainer || !summaryContainer) {
    return;
  }

  const cartProducts = getCartProducts();

  if (!cartProducts.length) {
    itemsContainer.innerHTML = emptyState(
      "Seu carrinho esta vazio",
      "Adicione alguns itens da vitrine para testar a experiencia de compra.",
      '<a class="primary-btn" href="index.html">Voltar para a loja</a>'
    );
    summaryContainer.innerHTML = `
      <span class="eyebrow">Resumo</span>
      <h2>Nada por aqui ainda</h2>
      <p>Assim que voce adicionar produtos, o total aparecera neste painel.</p>
      <div class="summary-note">Seu carrinho premium vai exibir subtotal, frete, desconto e beneficios assim que houver itens selecionados.</div>
    `;

    if (recommendations) {
      recommendations.innerHTML = PRODUCTS.slice(0, 3).map((product) => productCard(product, { compact: true })).join("");
    }

    return;
  }

  const { subtotal, shipping, discount, total } = getCartTotals(cartProducts);

  itemsContainer.innerHTML = cartProducts.map((item) => {
    const lineTotal = item.product.price * item.quantity;
    return `
      <article class="cart-item">
        <div class="cart-item__media">
          <img src="${item.product.image}" alt="${item.product.name}">
        </div>

        <div class="cart-item__meta">
          <div>
            <h3>${item.product.name}</h3>
            <p>${item.product.description}</p>
          </div>

          <div class="cart-item__actions">
            <div class="quantity-control" aria-label="Controle de quantidade">
              <button type="button" data-action="decrease-quantity" data-id="${item.product.id}" aria-label="Diminuir quantidade">-</button>
              <strong>${item.quantity}</strong>
              <button type="button" data-action="increase-quantity" data-id="${item.product.id}" aria-label="Aumentar quantidade">+</button>
            </div>

            <button type="button" class="secondary-btn" data-action="remove-cart-item" data-id="${item.product.id}">Remover</button>
          </div>
        </div>

        <div class="cart-item__total">
          <strong>${money.format(lineTotal)}</strong>
          <span>${money.format(item.product.price)} cada</span>
        </div>
      </article>
    `;
  }).join("");

  summaryContainer.innerHTML = `
    <span class="eyebrow">Resumo</span>
    <h2>Fechamento do pedido</h2>
    <div class="summary-line"><span>Subtotal</span><strong>${money.format(subtotal)}</strong></div>
    <div class="summary-line"><span>Frete</span><strong>${shipping === 0 ? "Gratis" : money.format(shipping)}</strong></div>
    <div class="summary-line"><span>Cupom simulado</span><strong>- ${money.format(discount)}</strong></div>
    <hr>
    <div class="summary-line"><span>Total estimado</span><strong>${money.format(total)}</strong></div>
    <div class="summary-note">Pagamento protegido, embalagem reforcada e acompanhamento do pedido em uma unica experiencia.</div>
    <button type="button" class="primary-btn primary-btn--full" data-action="checkout">Finalizar compra</button>
    <a class="secondary-btn primary-btn--full" href="promotions.html">Aplicar mais ofertas</a>
  `;

  if (recommendations) {
    const excludedIds = cartProducts.map((item) => item.product.id);
    recommendations.innerHTML = PRODUCTS.filter((product) => !excludedIds.includes(product.id)).slice(0, 3).map((product) => productCard(product, { compact: true })).join("");
  }
}

function renderFavoritePage() {
  const container = document.querySelector("[data-favorite-items]");
  const recommendations = document.querySelector("[data-favorite-recommendations]");

  if (!container) {
    return;
  }

  const favorites = getFavorites();
  const favoriteProducts = PRODUCTS.filter((product) => favorites.includes(product.id));

  if (!favoriteProducts.length) {
    container.innerHTML = emptyState(
      "Nenhum favorito salvo",
      "Clique no coracao dos produtos para montar sua lista de desejos.",
      '<a class="primary-btn" href="index.html">Explorar vitrine</a>'
    );
  } else {
    container.innerHTML = favoriteProducts.map((product) => productCard(product)).join("");
  }

  if (recommendations) {
    recommendations.innerHTML = PRODUCTS.filter((product) => !favorites.includes(product.id)).slice(0, 3).map((product) => productCard(product, { compact: true })).join("");
  }
}

function renderAccountPage() {
  const orderList = document.querySelector("[data-order-list]");
  const accountForm = document.querySelector("[data-account-form]");
  const authActions = document.querySelector("[data-account-auth-actions]");

  if (!orderList) {
    return;
  }

  if (!getIsAuthenticated()) {
    if (authActions) {
      authActions.innerHTML = "";
    }

    if (accountForm) {
      accountForm.querySelectorAll("input, button").forEach((element) => {
        element.disabled = true;
      });
    }

    orderList.innerHTML = emptyState(
      "Sua conta ainda nao foi acessada",
      "Entre com seu e-mail e senha para acompanhar pedidos, editar seus dados e ver sua area pessoal.",
      '<a class="primary-btn" href="login.html">Entrar agora</a>'
    );
    return;
  }

  if (authActions) {
    authActions.innerHTML = '<button type="button" class="ghost-btn primary-btn--full" data-action="logout">Sair da conta</button>';
  }

  const orders = getOrders();

  if (!orders.length) {
    orderList.innerHTML = emptyState(
      "Nenhum pedido por enquanto",
      "Quando voce finalizar a compra no checkout, o pedido vai aparecer aqui automaticamente.",
      '<a class="secondary-btn" href="index.html">Voltar para a vitrine</a>'
    );
    return;
  }

  orderList.innerHTML = orders.slice(0, 4).map((order) => `
    <article class="order-item">
      <div>
        <strong>${order.id}</strong>
        <p>${order.placedAt} • ${order.itemCount} ${order.itemCount === 1 ? "item" : "itens"}</p>
        <p>${order.summary}</p>
      </div>
      <div class="order-item__side">
        <strong>${money.format(order.total)}</strong>
        <span class="status-chip${order.statusTone === "success" ? " status-chip--success" : ""}${order.statusTone === "warning" ? " status-chip--warning" : ""}">${order.status}</span>
      </div>
    </article>
  `).join("");
}

function renderCategoryPage() {
  const productsContainer = document.querySelector("[data-category-products]");

  if (!productsContainer) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const requestedCategory = params.get("name");
  const categoryNames = getCategoryNames();
  const currentCategory = categoryNames.includes(requestedCategory) ? requestedCategory : categoryNames[0];
  const meta = getCategoryMeta(currentCategory);
  const categoryProducts = getCategoryProducts(currentCategory);
  const results = categoryProducts.filter((product) => {
    const needle = `${product.name} ${product.description} ${product.badge}`.toLowerCase();
    return !state.categorySearch || needle.includes(state.categorySearch);
  });
  const countLabel = state.categorySearch
    ? `${results.length} de ${categoryProducts.length} itens`
    : `${categoryProducts.length} itens`;
  const editorialContainer = document.querySelector("[data-category-editorial]");
  const highlightContainer = document.querySelector("[data-category-highlight]");
  const linksContainer = document.querySelector("[data-category-links]");
  const searchInput = document.querySelector("[data-category-search-input]");

  document.title = `JL AXION | ${currentCategory}`;
  document.querySelectorAll("[data-category-name]").forEach((element) => {
    element.textContent = currentCategory;
  });
  document.querySelectorAll("[data-category-title]").forEach((element) => {
    element.textContent = meta.title;
  });
  document.querySelectorAll("[data-category-description]").forEach((element) => {
    element.textContent = meta.description;
  });
  document.querySelectorAll("[data-category-badge]").forEach((element) => {
    element.textContent = meta.badge;
  });
  document.querySelectorAll("[data-category-count]").forEach((element) => {
    element.textContent = countLabel;
  });
  document.querySelectorAll("[data-category-shipping]").forEach((element) => {
    element.textContent = meta.shipping;
  });
  document.querySelectorAll("[data-category-subtitle]").forEach((element) => {
    element.textContent = meta.subtitle;
  });

  if (editorialContainer) {
    editorialContainer.innerHTML = `
      <span class="eyebrow">Selecao da categoria</span>
      <h2>${meta.editorialTitle}</h2>
      <p>${meta.editorialText}</p>
      <div class="mini-metric-grid">
        <article class="mini-metric">
          <strong>${categoryProducts.length} itens</strong>
          <span>Catalogo organizado para leitura rapida e navegacao mais comercial.</span>
        </article>
        <article class="mini-metric">
          <strong>${categoryProducts[0] ? money.format(categoryProducts[0].price) : money.format(0)}</strong>
          <span>Faixa inicial da categoria para facilitar comparacao e entrada no mix.</span>
        </article>
        <article class="mini-metric">
          <strong>${meta.badge}</strong>
          <span>${meta.shipping}</span>
        </article>
      </div>
    `;
  }

  if (highlightContainer) {
    highlightContainer.innerHTML = `
      <span class="eyebrow">Curadoria JL AXION</span>
      <h2>${meta.highlightTitle}</h2>
      <p>${meta.highlightText}</p>
      <ul class="feature-list compact-list">
        ${meta.bullets.map((item) => `<li>${item}</li>`).join("")}
      </ul>
      <div class="category-spotlight-list">
        ${categoryProducts.slice(0, 3).map((product) => `
          <article class="category-spotlight-item">
            <strong>${product.name}</strong>
            <span>${money.format(product.price)} • ${product.badge}</span>
          </article>
        `).join("")}
      </div>
    `;
  }

  if (!results.length) {
    productsContainer.innerHTML = emptyState(
      "Nenhum item encontrado nesta categoria",
      "Tente outro termo para busca ou volte ao catalogo completo desta colecao.",
      `<a class="secondary-btn" href="${buildCategoryHref(currentCategory)}">Limpar busca</a>`
    );
  } else {
    productsContainer.innerHTML = results.map((product) => productCard(product)).join("");
  }

  if (linksContainer) {
    linksContainer.innerHTML = categoryNames.filter((category) => category !== currentCategory).map((category) => categoryLinkCard(category)).join("");
  }

  if (searchInput) {
    searchInput.value = state.categorySearch;

    if (!searchInput.dataset.bound) {
      searchInput.addEventListener("input", (event) => {
        state.categorySearch = event.target.value.trim().toLowerCase();
        renderCategoryPage();
      });
      searchInput.dataset.bound = "true";
    }
  }
}

function renderCheckoutPage() {
  const form = document.querySelector("[data-checkout-form]");
  const summary = document.querySelector("[data-checkout-summary]");

  if (!form || !summary) {
    return;
  }

  const profile = getViewerProfile();
  const cartProducts = getCartProducts();

  if (!cartProducts.length) {
    form.innerHTML = emptyState(
      "Seu checkout esta vazio",
      "Adicione alguns itens ao carrinho para testar a finalizacao premium da loja.",
      '<a class="primary-btn" href="index.html">Voltar para a vitrine</a>'
    );
    summary.innerHTML = `
      <span class="eyebrow">Resumo</span>
      <h2>Nenhum item para finalizar</h2>
      <p>Assim que houver produtos no carrinho, este painel mostrara a composicao completa do pedido.</p>
      <div class="summary-note">Subtotal, frete, desconto e acompanhamento vao aparecer aqui de forma fixa durante a compra.</div>
    `;
    form.onsubmit = null;
    return;
  }

  const { subtotal, shipping, discount, total } = getCartTotals(cartProducts);

  form.innerHTML = `
    <div class="checkout-step-strip">
      <article class="checkout-step is-active">
        <span>1</span>
        <strong>Contato</strong>
        <small>Identificacao e acesso do comprador.</small>
      </article>
      <article class="checkout-step is-active">
        <span>2</span>
        <strong>Entrega</strong>
        <small>Endereco, prazo e modalidade.</small>
      </article>
      <article class="checkout-step is-active">
        <span>3</span>
        <strong>Pagamento</strong>
        <small>Finalizacao com leitura clara e segura.</small>
      </article>
    </div>

    <section class="checkout-section">
      <div class="section-heading section-heading--stacked">
        <div>
          <span class="eyebrow">Contato</span>
          <h2>Dados do comprador</h2>
        </div>
      </div>

      <div class="checkout-fields">
        <label class="field field--full">
          <span>Nome completo</span>
          <input class="input" type="text" name="name" value="${escapeAttribute(profile.name || "")}" placeholder="Seu nome completo" required>
        </label>

        <label class="field">
          <span>E-mail</span>
          <input class="input" type="email" name="email" value="${escapeAttribute(profile.email || "")}" placeholder="voce@exemplo.com" required>
        </label>

        <label class="field">
          <span>Telefone</span>
          <input class="input" type="tel" name="phone" value="${escapeAttribute(profile.phone || "")}" placeholder="(11) 99999-0000" required>
        </label>
      </div>
    </section>

    <section class="checkout-section">
      <div class="section-heading section-heading--stacked">
        <div>
          <span class="eyebrow">Entrega</span>
          <h2>Endereco e modalidade</h2>
        </div>
      </div>

      <div class="checkout-fields">
        <label class="field field--full">
          <span>Endereco</span>
          <input class="input" type="text" name="address" value="${escapeAttribute(profile.address || "")}" placeholder="Rua Axion Prime, 120" required>
        </label>

        <label class="field">
          <span>Cidade</span>
          <input class="input" type="text" name="city" value="${escapeAttribute(profile.city || "")}" placeholder="Sao Paulo, SP" required>
        </label>

        <label class="field">
          <span>CEP</span>
          <input class="input" type="text" name="zip" value="${escapeAttribute(profile.zip || "")}" placeholder="01000-000" required>
        </label>
      </div>

      <div class="checkout-radio-grid">
        <label class="payment-option">
          <input type="radio" name="delivery" value="express" checked>
          <strong>Entrega expressa</strong>
          <span>Prioridade no despacho e previsao agil.</span>
          <small>${shipping === 0 ? "Frete gratis neste pedido" : `Frete ${money.format(shipping)}`}</small>
        </label>

        <label class="payment-option">
          <input type="radio" name="delivery" value="scheduled">
          <strong>Entrega agendada</strong>
          <span>Janela mais flexivel para receber com conforto.</span>
          <small>Mesmo valor com previsao estendida</small>
        </label>
      </div>
    </section>

    <section class="checkout-section">
      <div class="section-heading section-heading--stacked">
        <div>
          <span class="eyebrow">Pagamento</span>
          <h2>Escolha a forma de pagamento</h2>
        </div>
      </div>

      <div class="checkout-radio-grid">
        <label class="payment-option">
          <input type="radio" name="payment" value="pix" checked>
          <strong>Pix</strong>
          <span>Aprovacao rapida e confirmacao quase imediata.</span>
          <small>Pedido entra como aguardando pagamento</small>
        </label>

        <label class="payment-option">
          <input type="radio" name="payment" value="card">
          <strong>Cartao</strong>
          <span>Parcelamento mantendo leitura premium e simples.</span>
          <small>Em ate 10x sem juros nos itens elegiveis</small>
        </label>

        <label class="payment-option">
          <input type="radio" name="payment" value="wallet">
          <strong>Carteira digital</strong>
          <span>Fluxo rapido para compra recorrente e mobile.</span>
          <small>Confirmacao agil com token salvo</small>
        </label>
      </div>
    </section>

    <div class="mini-metric-grid checkout-assurance-grid">
      <article class="mini-metric">
        <strong>Protecao de dados</strong>
        <span>Dados usados apenas para concluir o pedido com mais clareza e seguranca.</span>
      </article>
      <article class="mini-metric">
        <strong>Entrega acompanhada</strong>
        <span>Resumo, frete e status do pedido continuam visiveis em Minha Conta apos a compra.</span>
      </article>
    </div>

    <div class="summary-note">Ao finalizar, o pedido e confirmado e o resumo segue para a area da conta quando houver login ativo.</div>
    <button type="submit" class="primary-btn primary-btn--full">Finalizar pedido</button>
  `;

  summary.innerHTML = `
    <span class="eyebrow">Resumo do pedido</span>
    <h2>Sua selecao JL AXION</h2>
    <div class="mini-metric-grid checkout-summary-metrics">
      <article class="mini-metric">
        <strong>Entrega a partir de 24h</strong>
        <span>Despacho agil para pedidos com itens em estoque.</span>
      </article>
      <article class="mini-metric">
        <strong>Checkout assistido</strong>
        <span>Resumo com frete, cupom e total sempre visiveis.</span>
      </article>
    </div>
    <div class="checkout-list">
      ${cartProducts.map((item) => `
        <article class="checkout-item">
          <div class="checkout-item__media">
            <img src="${item.product.image}" alt="${item.product.name}">
          </div>
          <div class="checkout-item__meta">
            <strong>${item.product.name}</strong>
            <span>${item.quantity} ${item.quantity === 1 ? "unidade" : "unidades"} • ${item.product.category}</span>
          </div>
          <strong class="checkout-item__price">${money.format(item.product.price * item.quantity)}</strong>
        </article>
      `).join("")}
    </div>
    <hr>
    <div class="summary-line"><span>Subtotal</span><strong>${money.format(subtotal)}</strong></div>
    <div class="summary-line"><span>Frete</span><strong>${shipping === 0 ? "Gratis" : money.format(shipping)}</strong></div>
    <div class="summary-line"><span>Cupom AXION15</span><strong>- ${money.format(discount)}</strong></div>
    <div class="summary-line"><span>Entrega estimada</span><strong>${shipping === 0 ? "24h a 48h" : "1 a 3 dias uteis"}</strong></div>
    <hr>
    <div class="summary-line checkout-total-line"><span>Total final</span><strong>${money.format(total)}</strong></div>
    <div class="summary-note">Checkout pronto para evoluir depois com gateway de pagamento e status reais.</div>
  `;

  form.onsubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const nextProfile = {
      ...getViewerProfile(),
      name: String(formData.get("name") || "").trim() || DEFAULT_PROFILE.name,
      email: String(formData.get("email") || "").trim() || DEFAULT_PROFILE.email,
      phone: String(formData.get("phone") || "").trim() || DEFAULT_PROFILE.phone,
      city: String(formData.get("city") || "").trim() || DEFAULT_PROFILE.city,
      address: String(formData.get("address") || "").trim() || DEFAULT_PROFILE.address,
      zip: String(formData.get("zip") || "").trim() || DEFAULT_PROFILE.zip
    };
    const payment = String(formData.get("payment") || "pix");
    const delivery = String(formData.get("delivery") || "express");

    try {
      if (runtimeData.useBackend) {
        const payload = await apiRequest("/api/orders/checkout", {
          method: "POST",
          body: {
            ...nextProfile,
            payment,
            delivery
          }
        });
        applyRuntimePatch(payload);
        await refreshRuntimeData();
        showToast(payload.message || "Pedido finalizado com sucesso.");
      } else {
        const itemsCount = cartProducts.reduce((totalItems, item) => totalItems + item.quantity, 0);
        const nextOrder = {
          id: createOrderId(),
          placedAt: formatOrderDate(new Date()),
          status: payment === "pix" ? "Aguardando pagamento" : "Pedido confirmado",
          statusTone: payment === "pix" ? "warning" : "success",
          total,
          itemCount: itemsCount,
          summary: `${getDeliveryLabel(delivery)} • ${nextProfile.city}`,
          payment: getPaymentLabel(payment),
          items: cartProducts.map((item) => ({
            id: item.product.id,
            name: item.product.name,
            quantity: item.quantity
          }))
        };

        setProfile(nextProfile);
        setOrders([nextOrder, ...getOrders()]);
        setCart([]);
        showToast("Pedido finalizado nesta demonstracao. Redirecionando para Minha Conta.");
      }

      updateProfileText();
      updateCounts();
      window.setTimeout(() => {
        window.location.href = "account.html";
      }, 800);
    } catch (error) {
      showToast(error.message);
    }
  };
}

function renderProductPage() {
  const detailContainer = document.querySelector("[data-product-detail]");
  const galleryContainer = document.querySelector("[data-product-gallery]");
  const highlightsContainer = document.querySelector("[data-product-highlights]");
  const specsContainer = document.querySelector("[data-product-specs]");
  const relatedContainer = document.querySelector("[data-related-products]");

  if (!detailContainer || !galleryContainer || !highlightsContainer || !specsContainer || !relatedContainer) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");
  const product = findProduct(productId) || PRODUCTS[0];
  const favorites = getFavorites();
  const isFavorite = favorites.includes(product.id);
  const installmentCount = product.price >= 300 ? 10 : 6;
  const installmentValue = money.format(product.price / installmentCount);
  const specs = getProductSpecs(product, installmentCount, installmentValue);
  const highlights = getProductHighlights(product);
  const relatedProducts = PRODUCTS.filter((item) => item.id !== product.id && item.category === product.category).slice(0, 3);
  const categoryLink = document.querySelector("[data-product-category-link]");
  const savings = typeof product.oldPrice === "number" ? product.oldPrice - product.price : 0;
  const savingsLabel = savings > 0 ? money.format(savings) : "";

  document.title = `JL AXION | ${product.name}`;
  document.querySelectorAll("[data-product-name]").forEach((element) => {
    element.textContent = product.name;
  });
  document.querySelectorAll("[data-product-category]").forEach((element) => {
    element.textContent = product.category;
  });
  document.querySelectorAll("[data-product-description]").forEach((element) => {
    element.textContent = product.description;
  });
  document.querySelectorAll("[data-product-rating]").forEach((element) => {
    element.textContent = `${String(product.rating).replace(".", ",")} / 5`;
  });
  document.querySelectorAll("[data-product-shipping]").forEach((element) => {
    element.textContent = product.shipping || "Frete rapido";
  });

  if (categoryLink) {
    categoryLink.textContent = product.category;
    categoryLink.href = buildCategoryHref(product.category);
  }

  galleryContainer.innerHTML = `
    <div class="product-stage-card">
      <div class="product-stage-media">
        <img src="${product.image}" alt="${product.name}">
      </div>
      <div class="product-stage-notes">
        <span class="mini-pill">${product.badge}</span>
        <span class="mini-pill">${product.category}</span>
      </div>
      <div class="mini-metric-grid product-stage-grid">
        <article class="mini-metric">
          <strong>${product.shipping || "Frete rapido"}</strong>
          <span>Previsao pensada para compras mais ageis e sem atrito.</span>
        </article>
        <article class="mini-metric">
          <strong>${product.reviews} avaliacoes</strong>
          <span>Leitura social para reforcar decisao e confianca na vitrine.</span>
        </article>
      </div>
    </div>
  `;

  detailContainer.innerHTML = `
    <span class="eyebrow">Detalhes do produto</span>
    <h2>${product.name}</h2>
    <div class="detail-promo-line">
      <span class="mini-pill">${product.badge}</span>
      ${savings > 0 ? `<span class="mini-pill mini-pill--accent">Economize ${savingsLabel}</span>` : `<span class="mini-pill mini-pill--accent">Curadoria premium</span>`}
    </div>
    <div class="product-meta-row">
      <span class="rating-pill">${String(product.rating || 4.8).replace(".", ",")} &#9733;</span>
      <span class="shipping-pill">${product.shipping || "Frete rapido"}</span>
    </div>
    <p>${product.description}</p>
    <div class="detail-price-block">
      <strong>${money.format(product.price)}</strong>
      ${product.oldPrice ? `<del>${money.format(product.oldPrice)}</del>` : ""}
    </div>
    <p class="product-installment">ou ${installmentCount}x de ${installmentValue} sem juros</p>
    <div class="mini-metric-grid detail-assurance-grid">
      <article class="mini-metric">
        <strong>Compra assistida</strong>
        <span>Resumo claro de preco, entrega e parcelamento antes de finalizar.</span>
      </article>
      <article class="mini-metric">
        <strong>Pos-venda organizado</strong>
        <span>Pedido e historico ficam concentrados em Minha Conta.</span>
      </article>
    </div>
    <div class="detail-actions">
      <button type="button" class="primary-btn" data-action="add-to-cart" data-id="${product.id}">Adicionar ao carrinho</button>
      <button type="button" class="secondary-btn" data-action="toggle-favorite" data-id="${product.id}">${isFavorite ? "Remover dos favoritos" : "Salvar nos favoritos"}</button>
    </div>
    <div class="summary-note">${product.reviews} avaliacoes nesta demonstracao. Produto apresentado em um layout pensado para venda com foco e sofisticacao.</div>
  `;

  highlightsContainer.innerHTML = `
    <div class="section-heading section-heading--stacked">
      <div>
        <span class="eyebrow">Destaques</span>
        <h2>Porque esse item merece atencao</h2>
      </div>
    </div>
    <ul class="feature-list">
      ${highlights.map((item) => `<li>${item}</li>`).join("")}
    </ul>
  `;

  specsContainer.innerHTML = `
    <div class="section-heading section-heading--stacked">
      <div>
        <span class="eyebrow">Especificacoes</span>
        <h2>Resumo tecnico</h2>
      </div>
    </div>
    <div class="spec-grid">
      ${specs.map(([label, value]) => `
        <div class="spec-item">
          <span>${label}</span>
          <strong>${value}</strong>
        </div>
      `).join("")}
    </div>
  `;

  relatedContainer.innerHTML = relatedProducts.map((item) => productCard(item)).join("");
}

function getProductHighlights(product) {
  const byCategory = {
    "Casa inteligente": [
      "Tecnologia util para uma rotina mais organizada e automatizada.",
      "Leitura comercial mais simples para quem busca praticidade real.",
      "Boa combinacao com lampadas e utilidades da casa."
    ],
    "Lampadas": [
      "Categoria forte para atmosfera, setup e decoracao com luz.",
      "Visual premium para home office, quarto e ambiente social.",
      "Funciona muito bem em kits com escritorio e casa inteligente."
    ],
    "Carregadores": [
      "Resolve energia e organizacao em um unico produto.",
      "Boa leitura de valor para compra rapida e reposicao.",
      "Categoria perfeita para combinar com cabos e setup."
    ],
    "Cabos": [
      "Produto de alta recorrencia com decisao simples de compra.",
      "Reforco estrutural e carga rapida como argumento principal.",
      "Excelente item de complemento para carrinho e checkout."
    ],
    "Escritorio": [
      "Ajuda a compor uma mesa mais limpa e funcional.",
      "Boa presenca visual para home office e estudo.",
      "Categoria que conversa bem com som, cabos e carregadores."
    ],
    "Utilidades": [
      "Produtos para rotina com linguagem premium e simples de entender.",
      "Boa categoria para presente, casa e recompra.",
      "Combina praticidade com acabamento mais bem resolvido."
    ],
    "Som": [
      "Produto com apelo de presente, lifestyle e setup.",
      "Acabamento que valoriza fotos, banners e vitrines.",
      "Boa combinacao com escritorio, lampadas e carregadores."
    ]
  };

  return byCategory[product.category] || [
    "Curadoria premium com foco em uso real.",
    "Visual consistente com a identidade da loja.",
    "Pronto para compor um catalogo mais sofisticado."
  ];
}

function getProductSpecs(product, installmentCount, installmentValue) {
  const finishByCategory = {
    "Casa inteligente": "Acabamento clean para rotina conectada",
    "Lampadas": "Textura premium para iluminacao de ambiente",
    "Carregadores": "Construido para uso diario e carga constante",
    "Cabos": "Reforco extra para rotina intensa",
    "Escritorio": "Design clean para mesa e setup",
    "Utilidades": "Superficie facil de limpar",
    "Som": "Estrutura compacta de presenca premium"
  };

  return [
    ["Categoria", product.category],
    ["Entrega", product.shipping || "Frete rapido"],
    ["Avaliacao", `${String(product.rating).replace(".", ",")} / 5`],
    ["Parcelamento", `${installmentCount}x de ${installmentValue}`],
    ["Acabamento", finishByCategory[product.category] || "Acabamento premium"],
    ["Curadoria", "Selecao JL AXION"]
  ];
}

function productCard(product, options = {}) {
  const favorites = getFavorites();
  const isFavorite = favorites.includes(product.id);
  const showDiscount = options.promo && typeof product.oldPrice === "number";
  const discount = showDiscount ? percentage(product.oldPrice, product.price) : null;
  const installmentCount = product.price >= 300 ? 10 : 6;
  const installmentValue = money.format(product.price / installmentCount);
  const detailsHref = `product.html?id=${encodeURIComponent(product.id)}`;

  return `
    <article class="product-card">
      <a class="product-media" href="${detailsHref}" aria-label="Abrir detalhes de ${product.name}">
        <img src="${product.image}" alt="${product.name}">
        <span class="product-badge">${options.promo ? "Oferta" : product.badge}</span>
        ${discount ? `<span class="discount-badge">-${discount}%</span>` : ""}
      </a>

      <div class="product-top">
        <div>
          <h3><a class="product-title-link" href="${detailsHref}">${product.name}</a></h3>
          <span>${product.category}</span>
        </div>

        <button type="button" class="icon-button${isFavorite ? " is-active" : ""}" data-action="toggle-favorite" data-id="${product.id}" aria-label="Favoritar ${product.name}">
          ${icon("heart")}
        </button>
      </div>

      <div class="product-meta-row">
        <span class="rating-pill">${String(product.rating || 4.8).replace(".", ",")} &#9733;</span>
        <span class="shipping-pill">${product.shipping || "Frete rapido"}</span>
      </div>

      <p class="product-description">${product.description}</p>

      <div class="price-row">
        <strong>${money.format(product.price)}</strong>
        ${product.oldPrice ? `<del>${money.format(product.oldPrice)}</del>` : ""}
      </div>

      <p class="product-installment">ou ${installmentCount}x de ${installmentValue} sem juros</p>

      <div class="product-actions">
        <button type="button" class="primary-btn" data-action="add-to-cart" data-id="${product.id}">Comprar</button>
        <a class="secondary-btn" href="${detailsHref}">Detalhes</a>
      </div>

      <div class="product-footer-note">${product.reviews || 0} avaliacoes</div>
    </article>
  `;
}

function getCategoryMeta(category) {
  const fallbackCategory = getCategoryNames()[0] || Object.keys(CATEGORY_META)[0];
  return CATEGORY_META[category] || CATEGORY_META[fallbackCategory];
}

function getCategoryProducts(category) {
  return PRODUCTS.filter((product) => product.category === category);
}

function getCategoryNames() {
  const names = [...Object.keys(CATEGORY_META)];

  PRODUCTS.forEach((product) => {
    if (product.category && !names.includes(product.category)) {
      names.push(product.category);
    }
  });

  return names;
}

function renderHomeCollections() {
  const categoryContainer = document.querySelector("[data-home-categories]");
  const filterContainer = document.querySelector("[data-home-filters]");

  if (categoryContainer) {
    categoryContainer.innerHTML = getCategoryNames().map((category) => homeCategoryCard(category)).join("");
  }

  if (filterContainer) {
    filterContainer.innerHTML = [
      '<button type="button" class="filter-chip" data-action="set-category" data-category="Todos">Todos</button>',
      ...getCategoryNames().map((category) => `<button type="button" class="filter-chip" data-action="set-category" data-category="${category}">${category}</button>`)
    ].join("");
  }
}

function buildCatalogMeta(totalResults, visibleResults) {
  const itemLabel = totalResults === 1 ? "item" : "itens";

  if (state.search && state.category !== "Todos") {
    return `${totalResults} ${itemLabel} em ${state.category} para "${state.searchLabel}".`;
  }

  if (state.search) {
    return `${totalResults} ${itemLabel} encontrados para "${state.searchLabel}".`;
  }

  if (state.category !== "Todos") {
    return `${totalResults} ${itemLabel} disponiveis em ${state.category}.`;
  }

  if (visibleResults < totalResults) {
    return `${visibleResults} itens em destaque de ${totalResults} na curadoria principal da loja.`;
  }

  return `${totalResults} itens com curadoria premium na vitrine principal.`;
}

function buildCategoryHref(category) {
  return `category.html?name=${encodeURIComponent(category)}`;
}

function categoryLinkCard(category) {
  const meta = getCategoryMeta(category);
  const productCount = getCategoryProducts(category).length;

  return `
    <a class="department-card department-card--link" href="${buildCategoryHref(category)}">
      <span class="department-icon">${meta.code}</span>
      <strong>${meta.title}</strong>
      <p>${productCount} itens com curadoria premium para ${category.toLowerCase()}.</p>
      <span class="department-link">Abrir categoria</span>
    </a>
  `;
}

function homeCategoryCard(category) {
  const meta = getCategoryMeta(category);
  const productCount = getCategoryProducts(category).length;

  return `
    <button type="button" class="department-card" data-action="open-category" data-category="${category}">
      <span class="department-icon">${meta.code}</span>
      <strong>${category}</strong>
      <p>${meta.subtitle}</p>
      <span class="department-link">Ver ${productCount} ${productCount === 1 ? "item" : "itens"}</span>
    </button>
  `;
}

function getCartProducts(cart = getCart()) {
  return cart.map((item) => ({
    ...item,
    product: findProduct(item.id)
  })).filter((item) => item.product);
}

function getCartTotals(cartProducts) {
  const subtotal = cartProducts.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  const shipping = !cartProducts.length || subtotal >= 600 ? 0 : 24.9;
  const discount = cartProducts.length ? subtotal * 0.05 : 0;
  const total = subtotal + shipping - discount;

  return {
    subtotal,
    shipping,
    discount,
    total
  };
}

function createOrderId() {
  return `AX-${String(Date.now()).slice(-6)}`;
}

function formatOrderDate(date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function getPaymentLabel(payment) {
  const labels = {
    pix: "Pix",
    card: "Cartao",
    wallet: "Carteira digital"
  };

  return labels[payment] || "Pagamento digital";
}

function getDeliveryLabel(delivery) {
  const labels = {
    express: "Entrega expressa",
    scheduled: "Entrega agendada"
  };

  return labels[delivery] || "Entrega premium";
}

function escapeAttribute(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

async function toggleFavorite(productId) {
  const favorites = getFavorites();
  const exists = favorites.includes(productId);

  if (runtimeData.useBackend) {
    try {
      const payload = await apiRequest(`/api/favorites/${encodeURIComponent(productId)}`, {
        method: exists ? "DELETE" : "POST"
      });
      applyRuntimePatch(payload);
      showToast(payload.message || (exists ? "Produto removido dos favoritos." : "Produto adicionado aos favoritos."));
    } catch (error) {
      showToast(error.message);
    }
    return;
  }

  const next = exists ? favorites.filter((id) => id !== productId) : [...favorites, productId];
  setFavorites(next);
  showToast(exists ? "Produto removido dos favoritos." : "Produto adicionado aos favoritos.");
}

async function addToCart(productId) {
  if (runtimeData.useBackend) {
    try {
      const payload = await apiRequest("/api/cart/items", {
        method: "POST",
        body: {
          productId,
          quantity: 1
        }
      });
      applyRuntimePatch(payload);
      showToast(payload.message || "Item adicionado ao carrinho.");
    } catch (error) {
      showToast(error.message);
    }
    return;
  }

  const cart = getCart();
  const existing = cart.find((item) => item.id === productId);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }

  setCart(cart);
  showToast("Item adicionado ao carrinho.");
}

async function removeCartItem(productId) {
  if (runtimeData.useBackend) {
    try {
      const payload = await apiRequest(`/api/cart/items/${encodeURIComponent(productId)}`, {
        method: "DELETE"
      });
      applyRuntimePatch(payload);
      showToast(payload.message || "Item removido do carrinho.");
    } catch (error) {
      showToast(error.message);
    }
    return;
  }

  const next = getCart().filter((item) => item.id !== productId);
  setCart(next);
  showToast("Item removido do carrinho.");
}

async function changeQuantity(productId, change) {
  if (runtimeData.useBackend) {
    const current = getCart().find((item) => item.id === productId);

    if (!current) {
      return;
    }

    try {
      const payload = await apiRequest(`/api/cart/items/${encodeURIComponent(productId)}`, {
        method: "PATCH",
        body: {
          quantity: current.quantity + change
        }
      });
      applyRuntimePatch(payload);
    } catch (error) {
      showToast(error.message);
    }
    return;
  }

  const next = getCart().map((item) => {
    if (item.id !== productId) {
      return item;
    }

    return {
      ...item,
      quantity: item.quantity + change
    };
  }).filter((item) => item.quantity > 0);

  setCart(next);
}

async function moveAllFavoritesToCart() {
  const favorites = getFavorites();

  if (!favorites.length) {
    showToast("Sua lista de favoritos ja esta vazia.");
    return;
  }

  if (runtimeData.useBackend) {
    try {
      const payload = await apiRequest("/api/cart/move-favorites", {
        method: "POST"
      });
      applyRuntimePatch(payload);
      showToast(payload.message || "Todos os favoritos foram enviados para o carrinho.");
    } catch (error) {
      showToast(error.message);
    }
    return;
  }

  favorites.forEach((id) => addToCartSilently(id));
  showToast("Todos os favoritos foram enviados para o carrinho.");
}

function addToCartSilently(productId) {
  const cart = getCart();
  const existing = cart.find((item) => item.id === productId);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }

  setCart(cart);
}

function findProduct(productId) {
  return PRODUCTS.find((product) => product.id === productId) || null;
}

function updateCategoryButtons() {
  document.querySelectorAll("[data-action='set-category']").forEach((button) => {
    if (button.classList.contains("filter-chip")) {
      button.classList.toggle("is-active", button.dataset.category === state.category);
    }
  });
}

function percentage(oldPrice, newPrice) {
  return Math.round(((oldPrice - newPrice) / oldPrice) * 100);
}

function emptyState(title, description, actionMarkup) {
  return `
    <article class="empty-state">
      <h3>${title}</h3>
      <p>${description}</p>
      ${actionMarkup}
    </article>
  `;
}

function ensureToastHost() {
  if (document.querySelector(".toast-host")) {
    return;
  }

  const host = document.createElement("div");
  host.className = "toast-host";
  document.body.appendChild(host);
}

function showToast(message) {
  const host = document.querySelector(".toast-host");

  if (!host) {
    return;
  }

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  host.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add("is-visible");
  });

  window.setTimeout(() => {
    toast.classList.remove("is-visible");
    window.setTimeout(() => toast.remove(), 200);
  }, 2400);
}

function closeDrawer() {
  const drawer = document.querySelector("[data-menu-drawer]");

  document.body.classList.remove("menu-open");

  if (drawer) {
    drawer.setAttribute("aria-hidden", "true");
  }
}

function icon(name) {
  const icons = {
    search: `
      <svg class="icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="11.2" cy="11.2" r="5.95" stroke="currentColor" stroke-width="1.7"/>
        <path d="M15.45 15.55 19.6 19.7" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>
      </svg>
    `,
    heart: `
      <svg class="icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 20.2c-4.88-2.72-7.68-5.91-7.68-9.87 0-2.76 1.88-4.88 4.55-4.88 1.53 0 2.63.58 3.13 1.56.5-.98 1.6-1.56 3.13-1.56 2.67 0 4.55 2.12 4.55 4.88 0 3.96-2.8 7.15-7.68 9.87Z" fill="currentColor" fill-opacity="0.12"/>
        <path d="M12 20.2c-4.88-2.72-7.68-5.91-7.68-9.87 0-2.76 1.88-4.88 4.55-4.88 1.53 0 2.63.58 3.13 1.56.5-.98 1.6-1.56 3.13-1.56 2.67 0 4.55 2.12 4.55 4.88 0 3.96-2.8 7.15-7.68 9.87Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>
        <path d="M9.15 8.15c.42-.43 1.08-.78 1.94-.78" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" opacity=".78"/>
      </svg>
    `,
    cart: `
      <svg class="icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4.2 6.2h2.1l1.56 8.04c.1.52.56.9 1.1.9h8.72c.53 0 .99-.36 1.1-.87l1.1-4.97H8.2" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M8.85 9.55h10.2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity=".78"/>
        <circle cx="10.1" cy="18.6" r="1.45" fill="currentColor"/>
        <circle cx="17.55" cy="18.6" r="1.45" fill="currentColor"/>
      </svg>
    `,
    user: `
      <svg class="icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 3.95c4.64 0 8.4 3.76 8.4 8.4s-3.76 8.4-8.4 8.4-8.4-3.76-8.4-8.4 3.76-8.4 8.4-8.4Z" stroke="currentColor" stroke-width="1.7"/>
        <circle cx="12" cy="9.25" r="2.55" stroke="currentColor" stroke-width="1.6"/>
        <path d="M7.9 16.25c.95-1.7 2.33-2.55 4.1-2.55 1.78 0 3.15.85 4.1 2.55" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
      </svg>
    `,
    close: `
      <svg class="icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M7.15 7.15 16.85 16.85M16.85 7.15 7.15 16.85" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>
      </svg>
    `
  };

  return icons[name] || "";
}
