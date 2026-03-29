const STORAGE_KEYS = {
  cart: "jlaxion-cart",
  favorites: "jlaxion-favorites",
  profile: "jlaxion-profile",
  orders: "jlaxion-orders",
  pendingCategory: "jlaxion-pending-category"
};

let PRODUCTS = [
  {
    id: "pulse-lamp",
    name: "PulseBeam Lamp",
    category: "Casa inteligente",
    badge: "Novo",
    price: 249.9,
    oldPrice: 299.9,
    rating: 4.9,
    reviews: 124,
    shipping: "Entrega amanha",
    description: "Luminaria RGB com sensor de presenca e toque lateral.",
    image: "assets/pulse-lamp.svg"
  },
  {
    id: "orbit-hub",
    name: "Orbit Power Hub",
    category: "Escritorio",
    badge: "Best seller",
    price: 179.9,
    oldPrice: 229.9,
    rating: 4.8,
    reviews: 211,
    shipping: "Frete rapido",
    description: "Dock compacto com energia, USB-C e organizacao de cabos.",
    image: "assets/orbit-hub.svg"
  },
  {
    id: "neo-kettle",
    name: "NeoKettle Heat",
    category: "Utilidades",
    badge: "Pratico",
    price: 219.9,
    oldPrice: 259.9,
    rating: 4.7,
    reviews: 89,
    shipping: "Sai hoje",
    description: "Chaleira premium com controle de temperatura e visor LED.",
    image: "assets/neo-kettle.svg"
  },
  {
    id: "wave-mini",
    name: "WaveSound Mini",
    category: "Audio",
    badge: "Compacto",
    price: 329.9,
    oldPrice: 399.9,
    rating: 4.8,
    reviews: 173,
    shipping: "Entrega amanha",
    description: "Caixa de som portatil com graves encorpados e visual clean.",
    image: "assets/wave-mini.svg"
  },
  {
    id: "vertex-clean",
    name: "Vertex CleanBot",
    category: "Casa inteligente",
    badge: "Smart home",
    price: 899.9,
    oldPrice: 999.9,
    rating: 4.9,
    reviews: 58,
    shipping: "Frete premium",
    description: "Robo de limpeza com mapeamento, sensores e carga rapida.",
    image: "assets/vertex-clean.svg"
  },
  {
    id: "prism-air",
    name: "Prism Air Crisp",
    category: "Utilidades",
    badge: "Cozinha",
    price: 469.9,
    oldPrice: 569.9,
    rating: 4.8,
    reviews: 145,
    shipping: "Sai hoje",
    description: "Air fryer de design premium para receitas rapidas no dia a dia.",
    image: "assets/prism-air.svg"
  },
  {
    id: "nova-desk",
    name: "NovaDesk Station",
    category: "Escritorio",
    badge: "Setup",
    price: 289.9,
    oldPrice: 349.9,
    rating: 4.7,
    reviews: 96,
    shipping: "Entrega amanha",
    description: "Base modular para monitor, headset e itens de produtividade.",
    image: "assets/nova-desk.svg"
  },
  {
    id: "arc-mug",
    name: "ArcMug Thermal",
    category: "Mobilidade",
    badge: "Mobilidade",
    price: 129.9,
    oldPrice: 159.9,
    rating: 4.6,
    reviews: 132,
    shipping: "Frete rapido",
    description: "Caneca termica com tampa magnetica e acabamento premium.",
    image: "assets/arc-mug.svg"
  },
  {
    id: "halo-charge",
    name: "HaloCharge Pad",
    category: "Mobilidade",
    badge: "Carregador",
    price: 189.9,
    oldPrice: 239.9,
    rating: 4.8,
    reviews: 207,
    shipping: "Entrega amanha",
    description: "Base 3 em 1 para celular, relogio e fones sem ocupar espaco.",
    image: "assets/halo-charge.svg"
  },
  {
    id: "volt-cable",
    name: "VoltCable Max 100W",
    category: "Mobilidade",
    badge: "Cabo",
    price: 79.9,
    oldPrice: 99.9,
    rating: 4.7,
    reviews: 318,
    shipping: "Frete rapido",
    description: "Cabo reforcado USB-C para carga rapida e uso intenso.",
    image: "assets/volt-cable.svg"
  },
  {
    id: "aura-bulb",
    name: "AuraBulb Wi-Fi",
    category: "Casa inteligente",
    badge: "Lampada",
    price: 99.9,
    oldPrice: 129.9,
    rating: 4.8,
    reviews: 261,
    shipping: "Sai hoje",
    description: "Lampada inteligente com cenas, app e controle por voz.",
    image: "assets/aura-bulb.svg"
  },
  {
    id: "grid-strip",
    name: "GridStrip Power",
    category: "Escritorio",
    badge: "Energia",
    price: 149.9,
    oldPrice: 189.9,
    rating: 4.7,
    reviews: 184,
    shipping: "Entrega amanha",
    description: "Regua premium com tomadas, USB e visual limpo para setup.",
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
  email: "cliente@jlaxion.com",
  phone: "(11) 99999-0000",
  city: "Sao Paulo, SP",
  address: "Rua Axion Prime, 120",
  zip: "01000-000"
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
    code: "LT",
    title: "Lampadas, automacao e casa inteligente",
    description: "Uma selecao premium para iluminar, automatizar e organizar ambientes com mais estilo e praticidade.",
    badge: "SMART EDIT",
    shipping: "Entrega agil para itens de iluminacao e automacao",
    subtitle: "Curadoria para ambientes conectados e mais elegantes",
    editorialTitle: "Casa inteligente com visual limpo e foco no uso real",
    editorialText: "Esta categoria combina luminarias, automacao e itens de rotina para criar uma sensacao mais moderna dentro de casa, sem exagero visual.",
    highlightTitle: "O que guia esta selecao",
    highlightText: "Produtos pensados para rotina, atmosfera e tecnologia discreta em um catalogo facil de navegar.",
    bullets: [
      "Lampadas, sensores e energia para ambientes mais inteligentes.",
      "Pecas com linguagem visual mais limpa e contemporanea.",
      "Boa combinacao com setup, escritorio e utilidades do dia a dia."
    ]
  },
  "Utilidades": {
    code: "UT",
    title: "Utilidades premium para cozinha e rotina",
    description: "Itens praticos para o dia a dia com acabamento mais sofisticado, leitura clara de preco e foco em conveniencia.",
    badge: "HOME ESSENTIALS",
    shipping: "Saida rapida com selecao pensada para uso diario",
    subtitle: "Objetos uteis que elevam a rotina sem pesar no visual",
    editorialTitle: "Funcionalidade com apresentacao mais refinada",
    editorialText: "A proposta aqui e mostrar produtos uteis com cara de loja premium, equilibrando praticidade, textura e acabamento em uma mesma linguagem.",
    highlightTitle: "O que voce encontra aqui",
    highlightText: "Curadoria de bancada, cozinha e rotina com itens pensados para aparecer bem na vitrine e funcionar bem no cotidiano.",
    bullets: [
      "Produtos praticos com leitura comercial mais forte.",
      "Curadoria ideal para presentes e compras recorrentes.",
      "Visual consistente com a assinatura premium da JL AXION."
    ]
  },
  "Escritorio": {
    code: "DK",
    title: "Setup, energia e organizacao para escritorio",
    description: "Hubs, bases, energia e acessorios para mesa com um clima mais premium, pensado para produtividade e presenca visual.",
    badge: "DESK EDIT",
    shipping: "Frete rapido para setup e organizacao",
    subtitle: "Categoria para produtividade, mesa limpa e energia centralizada",
    editorialTitle: "Pecas para compor um setup mais sofisticado",
    editorialText: "O foco desta pagina e vender escritorio como experiencia: cabos organizados, energia centralizada e itens que valorizam a composicao da mesa.",
    highlightTitle: "Direcao da categoria",
    highlightText: "Produtos para quem quer produtividade e acabamento melhor, com menos ruino visual e mais sensacao de loja real.",
    bullets: [
      "Hubs, reguas e bases para uma mesa mais funcional.",
      "Itens com visual discreto e mais presenca comercial.",
      "Curadoria facil de combinar com audio e mobilidade."
    ]
  },
  "Mobilidade": {
    code: "CG",
    title: "Carregadores, cabos e energia para mobilidade",
    description: "Bases sem fio, cabos reforcados e itens de energia para rotina agil, viagens e uso continuo com cara de linha premium.",
    badge: "POWER EDIT",
    shipping: "Entrega amanha em itens selecionados de energia",
    subtitle: "Energia pratica para levar, apoiar e carregar melhor",
    editorialTitle: "Mobilidade com foco em energia e organizacao",
    editorialText: "Esta categoria concentra os itens mais comerciais da loja: carregadores, cabos e acessorios para rotina rapida, com leitura direta e premium.",
    highlightTitle: "Porque essa categoria vende bem",
    highlightText: "Produtos de alta recorrencia, boa margem visual de oferta e uso imediato no dia a dia do cliente.",
    bullets: [
      "Bases 3 em 1, cabos e acessorios de carga rapida.",
      "Produtos com appeal forte para vitrine e checkout.",
      "Perfeitos para upsell junto com escritorio e audio."
    ]
  },
  "Audio": {
    code: "AU",
    title: "Audio portatil e pecas para setup sonoro",
    description: "Selecao enxuta de audio com aparencia premium, boa presenca em mesa e portabilidade para acompanhar diferentes ambientes.",
    badge: "AUDIO CURATION",
    shipping: "Frete premium para itens de audio e lifestyle",
    subtitle: "Audio com design limpo e foco em presenca",
    editorialTitle: "Som com mais identidade visual",
    editorialText: "Aqui a categoria trabalha mais atmosfera e lifestyle, ajudando a loja a parecer completa sem perder o tom premium e organizado.",
    highlightTitle: "Como a linha foi pensada",
    highlightText: "Pecas compactas, boa leitura de valor e integracao natural com mobilidade, escritorio e casa inteligente.",
    bullets: [
      "Visual forte para compor vitrines e banners.",
      "Produtos compactos com boa leitura de valor.",
      "Complemento premium para mesas, quartos e rotinas moveis."
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
  userId: null,
  cart: [...DEFAULT_CART],
  favorites: [...DEFAULT_FAVORITES],
  profile: { ...DEFAULT_PROFILE },
  orders: [...DEFAULT_ORDERS]
};

document.addEventListener("DOMContentLoaded", async () => {
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
  const nextOptions = {
    method: options.method || "GET",
    credentials: "same-origin",
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(options.headers || {})
    }
  };

  if (options.body) {
    nextOptions.body = JSON.stringify(options.body);
  }

  const response = await window.fetch(url, nextOptions);
  const isJson = response.headers.get("content-type")?.includes("application/json");
  const payload = isJson ? await response.json() : null;

  if (!response.ok) {
    const message = payload?.message || "Nao foi possivel concluir a operacao.";
    throw new Error(message);
  }

  return payload;
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
    runtimeData.userId = payload.session.userId || runtimeData.userId;
  }

  if (Array.isArray(payload.cart)) {
    runtimeData.cart = payload.cart;
  }

  if (Array.isArray(payload.favorites)) {
    runtimeData.favorites = payload.favorites;
  }

  if (payload.profile) {
    runtimeData.profile = { ...DEFAULT_PROFILE, ...payload.profile };
  }

  if (payload.user) {
    runtimeData.profile = { ...DEFAULT_PROFILE, ...payload.user };
  }

  if (Array.isArray(payload.orders)) {
    runtimeData.orders = payload.orders;
  }
}

async function refreshRuntimeData() {
  if (!runtimeData.useBackend) {
    return;
  }

  const payload = await apiRequest("/api/bootstrap");
  applyRuntimePatch(payload);
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

  shell.innerHTML = `
    <div class="top-strip">
      <div class="top-strip__inner">
        <span>Frete gratis acima de R$ 600 | Cupom AXION15 em ofertas selecionadas</span>
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
                placeholder="Buscar carregadores, lampadas, utilidades..."
                autocomplete="off"
                enterkeyhint="search"
                value="${escapeAttribute(state.searchLabel)}"
                data-search-input
              >
            </label>
            <button type="submit" class="site-search__submit">Buscar</button>
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
            <a class="action-link" href="login.html">
              ${icon("user")}
              <span>Login</span>
            </a>
          </div>
        </div>

        <div class="site-header__navrow">
          <nav class="nav-links" aria-label="Navegacao principal">
            ${navLink("home", "index.html", "Inicio")}
            ${navLink("promotions", "promotions.html", "Promocoes")}
            ${navLink("favorites", "favorites.html", "Favoritos")}
            ${navLink("cart", "cart.html", "Carrinho")}
            ${navLink("account", "account.html", "Minha conta")}
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
          ${drawerLink("promotions", "promotions.html", "Promocoes", "Cupons e ofertas")}
          ${drawerLink("favorites", "favorites.html", "Favoritos", "Lista de desejos")}
          ${drawerLink("cart", "cart.html", "Carrinho", "Resumo da compra")}
          ${drawerLink("account", "account.html", "Minha conta", "Perfil e pedidos")}
          ${drawerLink("login", "login.html", "Login", "Acesso demonstrativo")}
          ${drawerLink("admin", "admin.html", "Admin", "Painel da loja")}
        </div>
      </div>

      <div class="drawer__section">
        <h2>Atalhos</h2>
        <div class="drawer__group">
          <button type="button" class="drawer-link" data-action="open-category" data-category="Casa inteligente">
            <span>Casa inteligente</span>
            <small>luzes e automacao</small>
          </button>
          <button type="button" class="drawer-link" data-action="open-category" data-category="Utilidades">
            <span>Utilidades</span>
            <small>cozinha e rotina</small>
          </button>
          <button type="button" class="drawer-link" data-action="open-category" data-category="Escritorio">
            <span>Escritorio</span>
            <small>setup e produtividade</small>
          </button>
        </div>
      </div>

      <div class="drawer-promo">
        <span class="eyebrow">Campanha ativa</span>
        <h2>AXION15</h2>
        <p>Use o menu lateral para navegar pelas paginas e testar a experiencia base da loja.</p>
      </div>
    </aside>

    <footer class="site-footer">
      <div class="site-footer__inner">
        <div>
          <strong>JL AXION</strong>
          <span>Loja demonstrativa de utilidades, energia, setup e casa inteligente.</span>
        </div>
        <div>
          <strong>Fluxo de compra</strong>
          <span>Inicio, categorias, produto, checkout, favoritos e conta do cliente.</span>
        </div>
        <div>
          <strong>Experiencia</strong>
          <span>Visual escuro premium, vitrine de produtos e navegacao responsiva.</span>
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

      try {
        if (runtimeData.useBackend) {
          const payload = await apiRequest("/api/auth/login", {
            method: "POST",
            body: {
              name: String(formData.get("name") || "").trim(),
              email: String(formData.get("email") || "").trim(),
              password: String(formData.get("password") || "").trim()
            }
          });

          applyRuntimePatch(payload);
          await refreshRuntimeData();
          updateProfileText();
          showToast(payload.message || "Login concluido. Redirecionando para Minha Conta.");
        } else {
          const current = getProfile();
          const nextProfile = {
            ...current,
            name: String(formData.get("name") || "").trim() || current.name,
            email: String(formData.get("email") || "").trim() || current.email
          };

          setProfile(nextProfile);
          updateProfileText();
          showToast("Login demonstrativo concluido. Redirecionando para Minha Conta.");
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

        updateProfileText();
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
  renderHomeProducts();
  renderPromotionProducts();
  renderCartPage();
  renderFavoritePage();
  renderAccountPage();
  renderCategoryPage();
  renderCheckoutPage();
  renderProductPage();
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
  const profile = getProfile();
  const firstName = (profile.name || DEFAULT_PROFILE.name).split(" ")[0];

  document.querySelectorAll("[data-profile-name]").forEach((element) => {
    element.textContent = firstName;
  });

  document.querySelectorAll("[data-profile-email]").forEach((element) => {
    element.textContent = profile.email || DEFAULT_PROFILE.email;
  });
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

  if (!orderList) {
    return;
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

  const profile = getProfile();
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
          <input class="input" type="text" name="name" value="${escapeAttribute(profile.name || DEFAULT_PROFILE.name)}" placeholder="Cliente JL AXION" required>
        </label>

        <label class="field">
          <span>E-mail</span>
          <input class="input" type="email" name="email" value="${escapeAttribute(profile.email || DEFAULT_PROFILE.email)}" placeholder="cliente@jlaxion.com" required>
        </label>

        <label class="field">
          <span>Telefone</span>
          <input class="input" type="tel" name="phone" value="${escapeAttribute(profile.phone || DEFAULT_PROFILE.phone)}" placeholder="(11) 99999-0000" required>
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
          <input class="input" type="text" name="address" value="${escapeAttribute(profile.address || DEFAULT_PROFILE.address)}" placeholder="Rua Axion Prime, 120" required>
        </label>

        <label class="field">
          <span>Cidade</span>
          <input class="input" type="text" name="city" value="${escapeAttribute(profile.city || DEFAULT_PROFILE.city)}" placeholder="Sao Paulo, SP" required>
        </label>

        <label class="field">
          <span>CEP</span>
          <input class="input" type="text" name="zip" value="${escapeAttribute(profile.zip || DEFAULT_PROFILE.zip)}" placeholder="01000-000" required>
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

    <div class="summary-note">Ao finalizar, os dados ficam salvos para acelerar a proxima compra e o pedido aparece em Minha Conta.</div>
    <button type="submit" class="primary-btn primary-btn--full">Finalizar pedido</button>
  `;

  summary.innerHTML = `
    <span class="eyebrow">Resumo do pedido</span>
    <h2>Sua selecao JL AXION</h2>
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
    <hr>
    <div class="summary-line checkout-total-line"><span>Total final</span><strong>${money.format(total)}</strong></div>
    <div class="summary-note">Checkout demonstrativo com dados locais. Depois a gente pode plugar pagamento e pedido reais.</div>
  `;

  form.onsubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const nextProfile = {
      ...getProfile(),
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
    </div>
  `;

  detailContainer.innerHTML = `
    <span class="eyebrow">Detalhes do produto</span>
    <h2>${product.name}</h2>
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
      "Linguagem visual limpa para ambientes modernos.",
      "Uso intuitivo no dia a dia com foco em praticidade.",
      "Combinacao ideal com lampadas, energia e automacao."
    ],
    "Mobilidade": [
      "Formato pensado para rotina agil e deslocamento.",
      "Energia e desempenho sem ocupar espaco demais.",
      "Acabamento premium para acompanhar setups contemporaneos."
    ],
    "Escritorio": [
      "Visual discreto para compor mesas mais sofisticadas.",
      "Mais organizacao e funcionalidade para produtividade.",
      "Facil de combinar com hubs, fontes e acessorios de setup."
    ],
    "Utilidades": [
      "Ajuda a elevar a rotina com mais praticidade.",
      "Design pensado para ficar bem na bancada ou na cozinha.",
      "Equilibrio entre funcionalidade e apresentacao premium."
    ],
    "Audio": [
      "Presenca visual forte sem perder simplicidade.",
      "Boa integracao com setups, escritorio e mobilidade.",
      "Experiencia de uso direta, com foco no essencial."
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
    "Casa inteligente": "Soft touch premium",
    "Mobilidade": "Acabamento fosco resistente",
    "Escritorio": "Design clean para setup",
    "Utilidades": "Superficie facil de limpar",
    "Audio": "Estrutura compacta premium"
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
