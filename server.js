const express = require("express");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3");
const SQLiteStore = require("connect-sqlite3")(session);
const { open } = require("sqlite");
const { OAuth2Client } = require("google-auth-library");

const ROOT_DIR = __dirname;
const DATA_DIR = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : path.join(ROOT_DIR, "server-data");
const DB_PATH = process.env.DB_PATH
  ? path.resolve(process.env.DB_PATH)
  : path.join(DATA_DIR, "jlaxion.sqlite");
const PORT = Number(process.env.PORT || 3000);
const SESSION_SECRET = process.env.SESSION_SECRET || "jl-axion-local-secret";
const SESSION_DB_PATH = process.env.SESSION_DB_PATH
  ? path.resolve(process.env.SESSION_DB_PATH)
  : path.join(DATA_DIR, "sessions.sqlite");
const SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME || "jlaxion.sid";
const SESSION_REVISION = 2;
const ROOT_FILE_CACHE_CONTROL = "no-store, max-age=0";
const GOOGLE_CLIENT_ID = String(process.env.GOOGLE_CLIENT_ID || "").trim();
const googleClient = GOOGLE_CLIENT_ID ? new OAuth2Client(GOOGLE_CLIENT_ID) : null;

const HTML_FILES = new Set([
  "index.html",
  "login.html",
  "cart.html",
  "promotions.html",
  "account.html",
  "account-orders.html",
  "account-profile.html",
  "account-addresses.html",
  "account-wallet.html",
  "account-support.html",
  "account-protocols.html",
  "account-reviews.html",
  "account-draws.html",
  "favorites.html",
  "product.html",
  "category.html",
  "checkout.html",
  "admin.html",
  "styles.css",
  "app.js",
  "theme-init.js",
  "admin.js",
  "robots.txt",
  "sitemap.xml",
  "site.webmanifest",
  "favicon.svg",
  "jk-bg-fog-4k.png"
]);

const BASE_SEED_PRODUCTS = [
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

const SEED_SUPPLIERS = [
  {
    id: "nex-power",
    name: "Nex Power Supply",
    contactName: "Camila Rocha",
    email: "operacao@nexpower.example",
    phone: "(11) 4002-1200",
    leadTimeMin: 1,
    leadTimeMax: 3,
    orderChannel: "WhatsApp",
    website: "https://fornecedor-nex-power.example",
    notes: "Parceiro para carregadores, cabos e energia. Repasse inicial manual via WhatsApp com SKU externo.",
    active: true
  },
  {
    id: "lumina-home",
    name: "Lumina Home Trade",
    contactName: "Bruna Sales",
    email: "pedidos@luminahome.example",
    phone: "(21) 3555-8800",
    leadTimeMin: 2,
    leadTimeMax: 5,
    orderChannel: "E-mail",
    website: "https://fornecedor-lumina.example",
    notes: "Foco em lampadas, casa inteligente e utilidades para casa premium.",
    active: true
  },
  {
    id: "studio-grid",
    name: "Studio Grid Distribuicao",
    contactName: "Rafael Ponte",
    email: "comercial@studiogrid.example",
    phone: "(31) 3333-4400",
    leadTimeMin: 2,
    leadTimeMax: 4,
    orderChannel: "Portal",
    website: "https://fornecedor-studiogrid.example",
    notes: "Fornecedor para escritorio, audio e itens de setup com ticket medio.",
    active: true
  }
];

const SUPPLIER_BY_CATEGORY = {
  Carregadores: "nex-power",
  Cabos: "nex-power",
  Lampadas: "lumina-home",
  "Casa inteligente": "lumina-home",
  Utilidades: "lumina-home",
  Escritorio: "studio-grid",
  Som: "studio-grid"
};

const SUPPLIER_COST_RATIO_BY_CATEGORY = {
  Carregadores: 0.54,
  Cabos: 0.42,
  Lampadas: 0.48,
  "Casa inteligente": 0.63,
  Utilidades: 0.5,
  Escritorio: 0.52,
  Som: 0.57
};

const SUPPLIER_ETA_BY_CATEGORY = {
  Carregadores: 2,
  Cabos: 2,
  Lampadas: 3,
  "Casa inteligente": 5,
  Utilidades: 4,
  Escritorio: 3,
  Som: 4
};

const SEED_PRODUCTS = BASE_SEED_PRODUCTS.map((product) => createSeedProduct(product));

const SEED_PROFILE = {
  name: "Cliente JL AXION",
  email: "cliente@jlaxion.com.br",
  password: "axion123",
  phone: "(11) 99999-0000",
  city: "Sao Paulo, SP",
  address: "Rua Axion Prime, 120",
  zip: "01000-000"
};

const ADMIN_SEED = {
  name: process.env.ADMIN_NAME || "Admin JL AXION",
  email: (process.env.ADMIN_EMAIL || "admin@jlaxion.com.br").trim().toLowerCase(),
  password: process.env.ADMIN_PASSWORD || "axionadmin"
};

const SEED_FAVORITES = ["pulse-lamp", "wave-mini", "arc-mug"];

const SEED_CART = [
  { id: "orbit-hub", quantity: 1 },
  { id: "prism-air", quantity: 1 }
];

const SEED_ORDERS = [
  {
    id: "AX-240318",
    placedAt: "26/03/2026",
    status: "Em separacao",
    statusTone: "warning",
    total: 529.8,
    itemCount: 2,
    summary: "Entrega expressa para Sao Paulo, SP",
    payment: "Cartao final 4087",
    delivery: "Entrega expressa",
    items: [
      { id: "orbit-hub", name: "Orbit Power Hub", quantity: 1, price: 179.9 },
      { id: "prism-air", name: "Prism Air Crisp", quantity: 1, price: 469.9 }
    ]
  },
  {
    id: "AX-240287",
    placedAt: "18/03/2026",
    status: "Entregue",
    statusTone: "success",
    total: 249.9,
    itemCount: 1,
    summary: "Compra smart para home office",
    payment: "Pix aprovado",
    delivery: "Entrega expressa",
    items: [
      { id: "pulse-lamp", name: "PulseBeam Lamp", quantity: 1, price: 249.9 }
    ]
  }
];

let db;
let defaultUserId = 1;
let adminUserId = 2;

startServer().catch((error) => {
  console.error("Falha ao iniciar o backend JL AXION:", error);
  process.exit(1);
});

async function startServer() {
  db = await initializeDatabase();

  const app = express();
  const isProduction = process.env.NODE_ENV === "production";
  const useSQLiteSessionStore = !isProduction || process.env.USE_SQLITE_SESSION_STORE === "true";
  const sessionStore = useSQLiteSessionStore
    ? new SQLiteStore({
      db: path.basename(SESSION_DB_PATH),
      dir: path.dirname(SESSION_DB_PATH),
      table: "sessions"
    })
    : undefined;
  const sessionMiddleware = session({
    name: SESSION_COOKIE_NAME,
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    unset: "destroy",
    ...(sessionStore ? { store: sessionStore } : {}),
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: isProduction
    }
  });
  const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: isProduction ? 10 : 100,
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true,
    message: {
      message: "Muitas tentativas de login. Tente novamente em alguns minutos."
    }
  });
  const adminLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: isProduction ? 120 : 500,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      message: "Muitas requisicoes administrativas. Aguarde um instante e tente novamente."
    }
  });

  app.set("trust proxy", 1);
  app.disable("x-powered-by");
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "https://accounts.google.com"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:"],
        connectSrc: ["'self'", "https://accounts.google.com"],
        fontSrc: ["'self'", "data:"],
        frameSrc: ["'self'", "https://accounts.google.com"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        frameAncestors: ["'none'"]
      }
    },
    crossOriginEmbedderPolicy: false
  }));
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: false, limit: "1mb" }));

  app.use("/assets", express.static(path.join(ROOT_DIR, "assets"), {
    etag: true,
    immutable: isProduction,
    maxAge: isProduction ? "7d" : 0
  }));
  app.get("/api/health", (_req, res) => {
    res.json({ ok: true });
  });
  app.get("/", (_req, res) => {
    res.set("Cache-Control", ROOT_FILE_CACHE_CONTROL);
    res.sendFile(path.join(ROOT_DIR, "index.html"));
  });

  app.get("/:file", (req, res, next) => {
    const file = req.params.file;

    if (!HTML_FILES.has(file)) {
      next();
      return;
    }

    res.set("Cache-Control", ROOT_FILE_CACHE_CONTROL);
    res.sendFile(path.join(ROOT_DIR, file));
  });

  app.use("/api", sessionMiddleware);
  app.use("/api/auth/login", loginLimiter);
  app.use("/api/auth/register", loginLimiter);
  app.use("/api/auth/google", loginLimiter);
  app.use("/api/admin", adminLimiter);
  app.use("/api", (_req, res, next) => {
    res.set("Cache-Control", "no-store");
    next();
  });

  app.use(async (req, _res, next) => {
    if (!req.path.startsWith("/api/")) {
      next();
      return;
    }

    if (req.session.revision !== SESSION_REVISION) {
      req.session.userId = defaultUserId;
      req.session.isAuthenticated = false;
      req.session.revision = SESSION_REVISION;
    }

    if (!req.session.userId) {
      req.session.userId = defaultUserId;
      req.session.isAuthenticated = false;
      req.session.revision = SESSION_REVISION;
    }

    req.currentUserId = req.session.userId;
    next();
  });

  app.get("/api/bootstrap", async (req, res, next) => {
    try {
      res.json(await buildBootstrapResponse(req));
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/categories", async (_req, res, next) => {
    try {
      const rows = await db.all("SELECT DISTINCT category FROM products ORDER BY category");
      res.json(rows.map((row) => row.category));
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/products", async (req, res, next) => {
    try {
      const { category = "", search = "" } = req.query;
      const params = [];
      const filters = [];

      if (category) {
        filters.push("products.category = ?");
        params.push(String(category));
      }

      if (search) {
        filters.push("(LOWER(products.name) LIKE ? OR LOWER(products.description) LIKE ? OR LOWER(products.category) LIKE ?)");
        const needle = `%${String(search).trim().toLowerCase()}%`;
        params.push(needle, needle, needle);
      }

      const whereClause = filters.length ? `WHERE ${filters.join(" AND ")}` : "";
      const rows = await db.all(
        `SELECT products.*, suppliers.name AS supplier_name
         FROM products
         LEFT JOIN suppliers ON suppliers.id = products.supplier_id
         ${whereClause}
         ORDER BY products.name`,
        params
      );
      res.json(rows.map(mapProduct));
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/products/:id", async (req, res, next) => {
    try {
      const product = await getProductById(req.params.id);

      if (!product) {
        res.status(404).json({ message: "Produto nao encontrado." });
        return;
      }

      res.json(product);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/auth/session", async (req, res, next) => {
    try {
      const user = req.session.isAuthenticated
        ? await getProfile(req.currentUserId)
        : await getProfile(defaultUserId);
      res.json({
        isAuthenticated: Boolean(req.session.isAuthenticated),
        isAdmin: Boolean(req.session.isAuthenticated && user.role === "admin"),
        user: req.session.isAuthenticated ? user : null,
        guest: req.session.isAuthenticated ? null : user
      });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/auth/login", async (req, res, next) => {
    try {
      const email = String(req.body.email || "").trim().toLowerCase();
      const password = String(req.body.password || "").trim();

      if (!email || !password) {
        res.status(400).json({ message: "Informe e-mail e senha." });
        return;
      }

      if (password.length < 6) {
        res.status(400).json({ message: "A senha precisa ter pelo menos 6 caracteres." });
        return;
      }

      let user = await db.get("SELECT * FROM users WHERE email = ?", email);

      if (!user) {
        res.status(404).json({ message: "Conta nao encontrada. Crie seu acesso para continuar." });
        return;
      }

      let matches = false;

      try {
        matches = await bcrypt.compare(password, user.password_hash);
      } catch (_error) {
        matches = false;
      }

      if (!matches) {
        res.status(401).json({ message: "Senha incorreta." });
        return;
      }

      await establishSession(req, user.id, true);
      res.json({
        message: "Login concluido com sucesso.",
        user: await getProfile(user.id)
      });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/auth/register", async (req, res, next) => {
    try {
      const name = String(req.body.name || "").trim();
      const email = String(req.body.email || "").trim().toLowerCase();
      const password = String(req.body.password || "").trim();

      if (!name || !email || !password) {
        res.status(400).json({ message: "Informe nome, e-mail e senha para criar sua conta." });
        return;
      }

      if (name.length < 3) {
        res.status(400).json({ message: "Informe seu nome completo para criar a conta." });
        return;
      }

      if (password.length < 6) {
        res.status(400).json({ message: "A senha precisa ter pelo menos 6 caracteres." });
        return;
      }

      const existingUser = await db.get("SELECT id FROM users WHERE email = ?", email);

      if (existingUser) {
        res.status(409).json({ message: "Este e-mail ja esta cadastrado. Entre para continuar." });
        return;
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const result = await db.run(
        `INSERT INTO users (name, email, password_hash, role, phone, city, address, zip)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        name,
        email,
        passwordHash,
        "customer",
        "",
        "",
        "",
        ""
      );

      await establishSession(req, result.lastID, true);

      res.status(201).json({
        message: "Conta criada com sucesso.",
        user: await getProfile(result.lastID)
      });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/auth/google", async (req, res, next) => {
    try {
      if (!googleClient || !GOOGLE_CLIENT_ID) {
        res.status(503).json({ message: "Login via Google ainda nao esta configurado." });
        return;
      }

      const credential = String(req.body.credential || "").trim();

      if (!credential) {
        res.status(400).json({ message: "Nao recebemos o token do Google para continuar." });
        return;
      }

      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: GOOGLE_CLIENT_ID
      });
      const payload = ticket.getPayload();
      const googleId = String(payload?.sub || "").trim();
      const email = String(payload?.email || "").trim().toLowerCase();
      const name = String(payload?.name || "").trim();

      if (!googleId || !email) {
        res.status(400).json({ message: "Nao foi possivel confirmar os dados da sua conta Google." });
        return;
      }

      if (payload?.email_verified !== true) {
        res.status(400).json({ message: "Use uma conta Google com e-mail verificado para entrar." });
        return;
      }

      let user = await db.get(
        "SELECT * FROM users WHERE google_id = ? OR email = ? LIMIT 1",
        googleId,
        email
      );

      if (user) {
        await db.run(
          `UPDATE users
           SET name = CASE WHEN trim(coalesce(name, '')) = '' THEN ? ELSE name END,
               google_id = CASE WHEN coalesce(google_id, '') = '' THEN ? ELSE google_id END
           WHERE id = ?`,
          name || "Cliente JL AXION",
          googleId,
          user.id
        );
      } else {
        const passwordHash = await bcrypt.hash(`google:${googleId}:${crypto.randomUUID()}`, 10);
        const result = await db.run(
          `INSERT INTO users (name, email, password_hash, role, phone, city, address, zip, google_id, auth_provider)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          name || "Cliente JL AXION",
          email,
          passwordHash,
          "customer",
          "",
          "",
          "",
          "",
          googleId,
          "google"
        );
        user = { id: result.lastID };
      }

      const nextUser = await db.get("SELECT * FROM users WHERE google_id = ? OR email = ? LIMIT 1", googleId, email);
      await establishSession(req, nextUser.id, true);

      res.json({
        message: "Login com Google concluido com sucesso.",
        user: await getProfile(nextUser.id)
      });
    } catch (error) {
      if (error?.message?.includes("Wrong number of segments") || error?.message?.includes("Token used too late")) {
        res.status(400).json({ message: "Nao foi possivel validar o token do Google. Tente novamente." });
        return;
      }

      next(error);
    }
  });

  app.get("/api/admin/session", async (req, res, next) => {
    try {
      const user = req.session.isAuthenticated
        ? await getProfile(req.currentUserId)
        : await getProfile(defaultUserId);
      res.json({
        isAuthenticated: Boolean(req.session.isAuthenticated),
        isAdmin: Boolean(req.session.isAuthenticated && user.role === "admin"),
        user: req.session.isAuthenticated ? user : null,
        guest: req.session.isAuthenticated ? null : user
      });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/auth/logout", async (req, res, next) => {
    try {
      await establishSession(req, defaultUserId, false);
      res.json({
        message: "Sessao encerrada.",
        user: await getProfile(defaultUserId)
      });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/admin/bootstrap", requireAdmin, async (req, res, next) => {
    try {
      res.json({
        user: await getProfile(req.currentUserId),
        products: await getProducts(),
        categories: await getCategories(),
        suppliers: await getSuppliers(),
        orders: await getAllOrders(),
        stats: await getAdminStats()
      });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/profile", async (req, res, next) => {
    try {
      res.json(await getProfile(req.currentUserId));
    } catch (error) {
      next(error);
    }
  });

  app.put("/api/profile", async (req, res, next) => {
    try {
      const current = await getProfile(req.currentUserId);
      const nextProfile = {
        name: String(req.body.name || "").trim() || current.name,
        email: String(req.body.email || "").trim().toLowerCase() || current.email,
        phone: String(req.body.phone || "").trim() || current.phone,
        city: String(req.body.city || "").trim() || current.city,
        address: String(req.body.address || "").trim() || current.address,
        zip: String(req.body.zip || "").trim() || current.zip
      };

      await db.run(
        `UPDATE users
         SET name = ?, email = ?, phone = ?, city = ?, address = ?, zip = ?
         WHERE id = ?`,
        nextProfile.name,
        nextProfile.email,
        nextProfile.phone,
        nextProfile.city,
        nextProfile.address,
        nextProfile.zip,
        req.currentUserId
      );

      res.json({
        message: "Perfil atualizado.",
        profile: await getProfile(req.currentUserId)
      });
    } catch (error) {
      if (String(error.message || "").includes("UNIQUE")) {
        res.status(409).json({ message: "Este e-mail ja esta em uso." });
        return;
      }

      next(error);
    }
  });

  app.get("/api/admin/suppliers", requireAdmin, async (_req, res, next) => {
    try {
      res.json(await getSuppliers());
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/admin/suppliers", requireAdmin, async (req, res, next) => {
    try {
      const supplier = normalizeSupplierInput(req.body);
      const exists = await db.get("SELECT id FROM suppliers WHERE id = ?", supplier.id);

      if (exists) {
        res.status(409).json({ message: "Ja existe um fornecedor com este identificador." });
        return;
      }

      await db.run(
        `INSERT INTO suppliers (id, name, contact_name, email, phone, lead_time_min, lead_time_max, order_channel, website, notes, active)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        supplier.id,
        supplier.name,
        supplier.contactName,
        supplier.email,
        supplier.phone,
        supplier.leadTimeMin,
        supplier.leadTimeMax,
        supplier.orderChannel,
        supplier.website,
        supplier.notes,
        supplier.active ? 1 : 0
      );

      res.status(201).json({
        message: "Fornecedor salvo no painel.",
        supplier: await getSupplierById(supplier.id),
        suppliers: await getSuppliers(),
        products: await getProducts(),
        stats: await getAdminStats()
      });
    } catch (error) {
      next(error);
    }
  });

  app.put("/api/admin/suppliers/:id", requireAdmin, async (req, res, next) => {
    try {
      const existing = await getSupplierById(req.params.id);

      if (!existing) {
        res.status(404).json({ message: "Fornecedor nao encontrado." });
        return;
      }

      const supplier = normalizeSupplierInput(req.body, existing);

      await db.run(
        `UPDATE suppliers
         SET name = ?, contact_name = ?, email = ?, phone = ?, lead_time_min = ?, lead_time_max = ?, order_channel = ?, website = ?, notes = ?, active = ?
         WHERE id = ?`,
        supplier.name,
        supplier.contactName,
        supplier.email,
        supplier.phone,
        supplier.leadTimeMin,
        supplier.leadTimeMax,
        supplier.orderChannel,
        supplier.website,
        supplier.notes,
        supplier.active ? 1 : 0,
        req.params.id
      );

      res.json({
        message: "Fornecedor atualizado.",
        supplier: await getSupplierById(req.params.id),
        suppliers: await getSuppliers(),
        products: await getProducts(),
        stats: await getAdminStats()
      });
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/admin/suppliers/:id", requireAdmin, async (req, res, next) => {
    try {
      const existing = await getSupplierById(req.params.id);

      if (!existing) {
        res.status(404).json({ message: "Fornecedor nao encontrado." });
        return;
      }

      const linkedProducts = await db.get(
        "SELECT COUNT(*) AS total FROM products WHERE supplier_id = ?",
        req.params.id
      );

      if (Number(linkedProducts.total) > 0) {
        res.status(409).json({
          message: "Esse fornecedor ainda esta vinculado a produtos. Reatribua os produtos antes de excluir."
        });
        return;
      }

      await db.run("DELETE FROM suppliers WHERE id = ?", req.params.id);

      res.json({
        message: "Fornecedor removido.",
        suppliers: await getSuppliers(),
        stats: await getAdminStats()
      });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/favorites", async (req, res, next) => {
    try {
      res.json(await getFavorites(req.currentUserId));
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/favorites/:productId", async (req, res, next) => {
    try {
      const product = await getProductById(req.params.productId);

      if (!product) {
        res.status(404).json({ message: "Produto nao encontrado." });
        return;
      }

      await db.run(
        "INSERT OR IGNORE INTO favorites (user_id, product_id) VALUES (?, ?)",
        req.currentUserId,
        product.id
      );

      res.json({
        message: "Favorito salvo.",
        favorites: await getFavorites(req.currentUserId)
      });
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/favorites/:productId", async (req, res, next) => {
    try {
      await db.run(
        "DELETE FROM favorites WHERE user_id = ? AND product_id = ?",
        req.currentUserId,
        req.params.productId
      );

      res.json({
        message: "Favorito removido.",
        favorites: await getFavorites(req.currentUserId)
      });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/cart", async (req, res, next) => {
    try {
      res.json(await getCart(req.currentUserId));
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/cart/items", async (req, res, next) => {
    try {
      const productId = String(req.body.productId || "").trim();
      const quantity = Math.max(1, Number(req.body.quantity || 1));
      const product = await getProductById(productId);

      if (!product) {
        res.status(404).json({ message: "Produto nao encontrado." });
        return;
      }

      const existing = await db.get(
        "SELECT quantity FROM cart_items WHERE user_id = ? AND product_id = ?",
        req.currentUserId,
        productId
      );

      if (existing) {
        await db.run(
          "UPDATE cart_items SET quantity = ? WHERE user_id = ? AND product_id = ?",
          existing.quantity + quantity,
          req.currentUserId,
          productId
        );
      } else {
        await db.run(
          "INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)",
          req.currentUserId,
          productId,
          quantity
        );
      }

      res.json({
        message: "Item adicionado ao carrinho.",
        cart: await getCart(req.currentUserId)
      });
    } catch (error) {
      next(error);
    }
  });

  app.patch("/api/cart/items/:productId", async (req, res, next) => {
    try {
      const quantity = Number(req.body.quantity || 0);

      if (quantity <= 0) {
        await db.run(
          "DELETE FROM cart_items WHERE user_id = ? AND product_id = ?",
          req.currentUserId,
          req.params.productId
        );
      } else {
        await db.run(
          "UPDATE cart_items SET quantity = ? WHERE user_id = ? AND product_id = ?",
          quantity,
          req.currentUserId,
          req.params.productId
        );
      }

      res.json({
        message: "Carrinho atualizado.",
        cart: await getCart(req.currentUserId)
      });
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/cart/items/:productId", async (req, res, next) => {
    try {
      await db.run(
        "DELETE FROM cart_items WHERE user_id = ? AND product_id = ?",
        req.currentUserId,
        req.params.productId
      );

      res.json({
        message: "Item removido do carrinho.",
        cart: await getCart(req.currentUserId)
      });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/cart/move-favorites", async (req, res, next) => {
    try {
      const favorites = await getFavorites(req.currentUserId);

      for (const productId of favorites) {
        const existing = await db.get(
          "SELECT quantity FROM cart_items WHERE user_id = ? AND product_id = ?",
          req.currentUserId,
          productId
        );

        if (existing) {
          await db.run(
            "UPDATE cart_items SET quantity = ? WHERE user_id = ? AND product_id = ?",
            existing.quantity + 1,
            req.currentUserId,
            productId
          );
        } else {
          await db.run(
            "INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, 1)",
            req.currentUserId,
            productId
          );
        }
      }

      res.json({
        message: favorites.length ? "Favoritos enviados ao carrinho." : "Nenhum favorito para mover.",
        cart: await getCart(req.currentUserId)
      });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/orders", async (req, res, next) => {
    try {
      res.json(await getOrders(req.currentUserId));
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/orders/checkout", async (req, res, next) => {
    try {
      const cartItems = await getCartWithProducts(req.currentUserId);

      if (!cartItems.length) {
        res.status(400).json({ message: "Nao ha itens no carrinho para finalizar." });
        return;
      }

      const profile = {
        name: String(req.body.name || "").trim() || SEED_PROFILE.name,
        email: String(req.body.email || "").trim().toLowerCase() || SEED_PROFILE.email,
        phone: String(req.body.phone || "").trim() || "",
        city: String(req.body.city || "").trim() || "",
        address: String(req.body.address || "").trim() || "",
        zip: String(req.body.zip || "").trim() || ""
      };
      const payment = String(req.body.payment || "pix");
      const delivery = String(req.body.delivery || "express");
      const totals = calculateTotals(cartItems);
      const orderId = createOrderId();
      const placedAt = formatDate(new Date());
      const fulfillment = buildOrderFulfillment(cartItems, payment);
      const status = fulfillment.status;
      const statusTone = getStatusTone(status);

      await db.exec("BEGIN");

      await db.run(
        `UPDATE users
         SET name = ?, email = ?, phone = ?, city = ?, address = ?, zip = ?
         WHERE id = ?`,
        profile.name,
        profile.email,
        profile.phone,
        profile.city,
        profile.address,
        profile.zip,
        req.currentUserId
      );

      await db.run(
        `INSERT INTO orders (id, user_id, placed_at, status, status_tone, total, item_count, summary, payment, delivery, fulfillment_mode, fulfillment_status, supplier_id, supplier_name, tracking_code, supplier_reference, internal_notes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        orderId,
        req.currentUserId,
        placedAt,
        status,
        statusTone,
        totals.total,
        cartItems.reduce((sum, item) => sum + item.quantity, 0),
        `${getDeliveryLabel(delivery)} - ${profile.city || "Operacao nacional"}`,
        getPaymentLabel(payment),
        getDeliveryLabel(delivery),
        fulfillment.mode,
        fulfillment.fulfillmentStatus,
        fulfillment.supplierId,
        fulfillment.supplierName,
        "",
        "",
        fulfillment.internalNotes
      );

      for (const item of cartItems) {
        await db.run(
          `INSERT INTO order_items (order_id, product_id, name, quantity, price, supplier_id, supplier_name, supplier_sku, supplier_cost, fulfillment_mode)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          orderId,
          item.product.id,
          item.product.name,
          item.quantity,
          item.product.price,
          item.product.supplierId || "",
          item.product.supplierName || "",
          item.product.supplierSku || "",
          item.product.supplierCost || 0,
          item.product.fulfillmentMode || "own_stock"
        );
      }

      await db.run("DELETE FROM cart_items WHERE user_id = ?", req.currentUserId);
      await db.exec("COMMIT");

      res.status(201).json({
        message: "Pedido finalizado com sucesso.",
        order: await getOrderById(orderId),
        profile: await getProfile(req.currentUserId),
        cart: []
      });
    } catch (error) {
      await db.exec("ROLLBACK").catch(() => {});
      next(error);
    }
  });

  app.get("/api/admin/orders", requireAdmin, async (_req, res, next) => {
    try {
      res.json(await getAllOrders());
    } catch (error) {
      next(error);
    }
  });

  app.patch("/api/admin/orders/:id", requireAdmin, async (req, res, next) => {
    try {
      const order = await db.get("SELECT id FROM orders WHERE id = ?", req.params.id);

      if (!order) {
        res.status(404).json({ message: "Pedido nao encontrado." });
        return;
      }

      const status = String(req.body.status || "").trim() || "Em analise";
      const fulfillmentStatus = String(req.body.fulfillmentStatus || "").trim();
      const trackingCode = String(req.body.trackingCode || "").trim();
      const supplierReference = String(req.body.supplierReference || "").trim();
      const internalNotes = String(req.body.internalNotes || "").trim();
      const statusTone = getStatusTone(status);

      await db.run(
        "UPDATE orders SET status = ?, status_tone = ?, fulfillment_status = ?, tracking_code = ?, supplier_reference = ?, internal_notes = ? WHERE id = ?",
        status,
        statusTone,
        fulfillmentStatus,
        trackingCode,
        supplierReference,
        internalNotes,
        req.params.id
      );

      res.json({
        message: "Status do pedido atualizado.",
        order: await getOrderById(req.params.id),
        orders: await getAllOrders(),
        stats: await getAdminStats()
      });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/admin/products", requireAdmin, async (req, res, next) => {
    try {
      const product = normalizeProductInput(req.body);
      const exists = await db.get("SELECT id FROM products WHERE id = ?", product.id);

      if (exists) {
        res.status(409).json({ message: "Ja existe um produto com este identificador." });
        return;
      }

      await db.run(
        `INSERT INTO products (id, name, category, badge, price, old_price, rating, reviews, shipping, description, image, fulfillment_mode, supplier_id, supplier_sku, supplier_cost, supplier_eta_days, supplier_url, procurement_notes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        product.id,
        product.name,
        product.category,
        product.badge,
        product.price,
        product.oldPrice,
        product.rating,
        product.reviews,
        product.shipping,
        product.description,
        product.image,
        product.fulfillmentMode,
        product.supplierId,
        product.supplierSku,
        product.supplierCost,
        product.supplierEtaDays,
        product.supplierUrl,
        product.procurementNotes
      );

      res.status(201).json({
        message: "Produto criado no painel admin.",
        product: await getProductById(product.id),
        products: await getProducts(),
        categories: await getCategories(),
        stats: await getAdminStats()
      });
    } catch (error) {
      next(error);
    }
  });

  app.put("/api/admin/products/:id", requireAdmin, async (req, res, next) => {
    try {
      const existing = await getProductById(req.params.id);

      if (!existing) {
        res.status(404).json({ message: "Produto nao encontrado." });
        return;
      }

      const product = normalizeProductInput(req.body, existing);

      await db.run(
        `UPDATE products
         SET name = ?, category = ?, badge = ?, price = ?, old_price = ?, rating = ?, reviews = ?, shipping = ?, description = ?, image = ?, fulfillment_mode = ?, supplier_id = ?, supplier_sku = ?, supplier_cost = ?, supplier_eta_days = ?, supplier_url = ?, procurement_notes = ?
         WHERE id = ?`,
        product.name,
        product.category,
        product.badge,
        product.price,
        product.oldPrice,
        product.rating,
        product.reviews,
        product.shipping,
        product.description,
        product.image,
        product.fulfillmentMode,
        product.supplierId,
        product.supplierSku,
        product.supplierCost,
        product.supplierEtaDays,
        product.supplierUrl,
        product.procurementNotes,
        req.params.id
      );

      res.json({
        message: "Produto atualizado.",
        product: await getProductById(req.params.id),
        products: await getProducts(),
        categories: await getCategories(),
        stats: await getAdminStats()
      });
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/admin/products/:id", requireAdmin, async (req, res, next) => {
    try {
      const existing = await getProductById(req.params.id);

      if (!existing) {
        res.status(404).json({ message: "Produto nao encontrado." });
        return;
      }

      await db.exec("BEGIN");
      await db.run("DELETE FROM favorites WHERE product_id = ?", req.params.id);
      await db.run("DELETE FROM cart_items WHERE product_id = ?", req.params.id);
      await db.run("DELETE FROM products WHERE id = ?", req.params.id);
      await db.exec("COMMIT");

      res.json({
        message: "Produto removido do catalogo.",
        products: await getProducts(),
        categories: await getCategories(),
        stats: await getAdminStats()
      });
    } catch (error) {
      await db.exec("ROLLBACK").catch(() => {});
      next(error);
    }
  });

  app.use((req, res) => {
    if (req.path.startsWith("/api/")) {
      res.status(404).json({ message: "Rota nao encontrada." });
      return;
    }

    res.status(404).send("Pagina nao encontrada.");
  });

  app.use((error, req, res, _next) => {
    console.error(error);

    if (req.path.startsWith("/api/")) {
      res.status(500).json({
        message: "Erro interno no backend da JL AXION."
      });
      return;
    }

    res.status(500).send("Erro interno do servidor.");
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`JL AXION backend online na porta ${PORT}`);
    if (!isProduction) {
      console.log(`Login padrao: ${SEED_PROFILE.email} / ${SEED_PROFILE.password}`);
      console.log(`Login admin: ${ADMIN_SEED.email} / ${ADMIN_SEED.password}`);
    }
  });
}

async function initializeDatabase() {
  fs.mkdirSync(DATA_DIR, { recursive: true });

  const database = await open({
    filename: DB_PATH,
    driver: sqlite3.Database
  });

  await database.exec(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'customer',
      phone TEXT DEFAULT '',
      city TEXT DEFAULT '',
      address TEXT DEFAULT '',
      zip TEXT DEFAULT '',
      google_id TEXT,
      auth_provider TEXT NOT NULL DEFAULT 'password',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS suppliers (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      contact_name TEXT DEFAULT '',
      email TEXT DEFAULT '',
      phone TEXT DEFAULT '',
      lead_time_min INTEGER DEFAULT 2,
      lead_time_max INTEGER DEFAULT 7,
      order_channel TEXT DEFAULT 'manual',
      website TEXT DEFAULT '',
      notes TEXT DEFAULT '',
      active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      badge TEXT,
      price REAL NOT NULL,
      old_price REAL,
      rating REAL,
      reviews INTEGER,
      shipping TEXT,
      description TEXT,
      image TEXT,
      fulfillment_mode TEXT NOT NULL DEFAULT 'own_stock',
      supplier_id TEXT DEFAULT '',
      supplier_sku TEXT DEFAULT '',
      supplier_cost REAL DEFAULT 0,
      supplier_eta_days INTEGER DEFAULT 0,
      supplier_url TEXT DEFAULT '',
      procurement_notes TEXT DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS favorites (
      user_id INTEGER NOT NULL,
      product_id TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (user_id, product_id)
    );

    CREATE TABLE IF NOT EXISTS cart_items (
      user_id INTEGER NOT NULL,
      product_id TEXT NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 1,
      PRIMARY KEY (user_id, product_id)
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL,
      placed_at TEXT NOT NULL,
      status TEXT NOT NULL,
      status_tone TEXT NOT NULL,
      total REAL NOT NULL,
      item_count INTEGER NOT NULL,
      summary TEXT NOT NULL,
      payment TEXT NOT NULL,
      delivery TEXT NOT NULL,
      fulfillment_mode TEXT NOT NULL DEFAULT 'own_stock',
      fulfillment_status TEXT DEFAULT '',
      supplier_id TEXT DEFAULT '',
      supplier_name TEXT DEFAULT '',
      tracking_code TEXT DEFAULT '',
      supplier_reference TEXT DEFAULT '',
      internal_notes TEXT DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS order_items (
      order_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      name TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      price REAL NOT NULL,
      supplier_id TEXT DEFAULT '',
      supplier_name TEXT DEFAULT '',
      supplier_sku TEXT DEFAULT '',
      supplier_cost REAL DEFAULT 0,
      fulfillment_mode TEXT DEFAULT 'own_stock',
      PRIMARY KEY (order_id, product_id)
    );
  `);

  await ensureColumn(database, "users", "role", "TEXT NOT NULL DEFAULT 'customer'");
  await ensureColumn(database, "users", "google_id", "TEXT");
  await ensureColumn(database, "users", "auth_provider", "TEXT NOT NULL DEFAULT 'password'");
  await database.exec("CREATE UNIQUE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id) WHERE google_id IS NOT NULL AND google_id <> ''");
  await ensureColumn(database, "products", "fulfillment_mode", "TEXT NOT NULL DEFAULT 'own_stock'");
  await ensureColumn(database, "products", "supplier_id", "TEXT DEFAULT ''");
  await ensureColumn(database, "products", "supplier_sku", "TEXT DEFAULT ''");
  await ensureColumn(database, "products", "supplier_cost", "REAL DEFAULT 0");
  await ensureColumn(database, "products", "supplier_eta_days", "INTEGER DEFAULT 0");
  await ensureColumn(database, "products", "supplier_url", "TEXT DEFAULT ''");
  await ensureColumn(database, "products", "procurement_notes", "TEXT DEFAULT ''");
  await ensureColumn(database, "orders", "fulfillment_mode", "TEXT NOT NULL DEFAULT 'own_stock'");
  await ensureColumn(database, "orders", "fulfillment_status", "TEXT DEFAULT ''");
  await ensureColumn(database, "orders", "supplier_id", "TEXT DEFAULT ''");
  await ensureColumn(database, "orders", "supplier_name", "TEXT DEFAULT ''");
  await ensureColumn(database, "orders", "tracking_code", "TEXT DEFAULT ''");
  await ensureColumn(database, "orders", "supplier_reference", "TEXT DEFAULT ''");
  await ensureColumn(database, "orders", "internal_notes", "TEXT DEFAULT ''");
  await ensureColumn(database, "order_items", "supplier_id", "TEXT DEFAULT ''");
  await ensureColumn(database, "order_items", "supplier_name", "TEXT DEFAULT ''");
  await ensureColumn(database, "order_items", "supplier_sku", "TEXT DEFAULT ''");
  await ensureColumn(database, "order_items", "supplier_cost", "REAL DEFAULT 0");
  await ensureColumn(database, "order_items", "fulfillment_mode", "TEXT DEFAULT 'own_stock'");

  const passwordHash = await bcrypt.hash(SEED_PROFILE.password, 10);
  await database.run(
    `INSERT INTO users (name, email, password_hash, role, phone, city, address, zip)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(email) DO UPDATE SET
       name = excluded.name,
       password_hash = excluded.password_hash,
       role = excluded.role,
       phone = excluded.phone,
       city = excluded.city,
       address = excluded.address,
       zip = excluded.zip`,
    SEED_PROFILE.name,
    SEED_PROFILE.email,
    passwordHash,
    "customer",
    SEED_PROFILE.phone,
    SEED_PROFILE.city,
    SEED_PROFILE.address,
    SEED_PROFILE.zip
  );

  const defaultUser = await database.get("SELECT id FROM users WHERE email = ?", SEED_PROFILE.email);
  defaultUserId = defaultUser.id;

  const adminPasswordHash = await bcrypt.hash(ADMIN_SEED.password, 10);
  await database.run(
    `INSERT INTO users (name, email, password_hash, role, phone, city, address, zip)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(email) DO UPDATE SET
       name = excluded.name,
       password_hash = excluded.password_hash,
       role = excluded.role`,
    ADMIN_SEED.name,
    ADMIN_SEED.email,
    adminPasswordHash,
    "admin",
    "",
    "",
    "",
    ""
  );

  const adminUser = await database.get("SELECT id FROM users WHERE email = ?", ADMIN_SEED.email);
  adminUserId = adminUser.id;

  for (const supplier of SEED_SUPPLIERS) {
    await database.run(
      `INSERT INTO suppliers (id, name, contact_name, email, phone, lead_time_min, lead_time_max, order_channel, website, notes, active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         name = excluded.name,
         contact_name = excluded.contact_name,
         email = excluded.email,
         phone = excluded.phone,
         lead_time_min = excluded.lead_time_min,
         lead_time_max = excluded.lead_time_max,
         order_channel = excluded.order_channel,
         website = excluded.website,
         notes = excluded.notes,
         active = excluded.active`,
      supplier.id,
      supplier.name,
      supplier.contactName,
      supplier.email,
      supplier.phone,
      supplier.leadTimeMin,
      supplier.leadTimeMax,
      supplier.orderChannel,
      supplier.website,
      supplier.notes,
      supplier.active ? 1 : 0
    );
  }

  for (const product of SEED_PRODUCTS) {
    await database.run(
      `INSERT INTO products (id, name, category, badge, price, old_price, rating, reviews, shipping, description, image, fulfillment_mode, supplier_id, supplier_sku, supplier_cost, supplier_eta_days, supplier_url, procurement_notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         name = excluded.name,
         category = excluded.category,
         badge = excluded.badge,
         price = excluded.price,
         old_price = excluded.old_price,
         rating = excluded.rating,
         reviews = excluded.reviews,
         shipping = excluded.shipping,
         description = excluded.description,
         image = excluded.image,
         fulfillment_mode = excluded.fulfillment_mode,
         supplier_id = excluded.supplier_id,
         supplier_sku = excluded.supplier_sku,
         supplier_cost = excluded.supplier_cost,
         supplier_eta_days = excluded.supplier_eta_days,
         supplier_url = excluded.supplier_url,
         procurement_notes = excluded.procurement_notes`,
      product.id,
      product.name,
      product.category,
      product.badge,
      product.price,
      product.oldPrice,
      product.rating,
      product.reviews,
      product.shipping,
      product.description,
      product.image,
      product.fulfillmentMode,
      product.supplierId,
      product.supplierSku,
      product.supplierCost,
      product.supplierEtaDays,
      product.supplierUrl,
      product.procurementNotes
    );
  }

  const favoriteCount = await database.get(
    "SELECT COUNT(*) AS total FROM favorites WHERE user_id = ?",
    defaultUserId
  );

  if (!favoriteCount.total) {
    for (const productId of SEED_FAVORITES) {
      await database.run(
        "INSERT OR IGNORE INTO favorites (user_id, product_id) VALUES (?, ?)",
        defaultUserId,
        productId
      );
    }
  }

  const cartCount = await database.get(
    "SELECT COUNT(*) AS total FROM cart_items WHERE user_id = ?",
    defaultUserId
  );

  if (!cartCount.total) {
    for (const item of SEED_CART) {
      await database.run(
        "INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)",
        defaultUserId,
        item.id,
        item.quantity
      );
    }
  }

  for (const order of SEED_ORDERS) {
    const orderItems = order.items.map((item) => {
      const product = SEED_PRODUCTS.find((productEntry) => productEntry.id === item.id);

      return {
        ...item,
        supplierId: product?.supplierId || "",
        supplierName: product?.supplierName || "",
        supplierSku: product?.supplierSku || "",
        supplierCost: product?.supplierCost || 0,
        fulfillmentMode: product?.fulfillmentMode || "own_stock"
      };
    });
    const orderFulfillment = buildOrderFulfillment(orderItems.map((item) => ({
      quantity: item.quantity,
      product: item
    })), order.payment.toLowerCase().includes("pix") ? "pix" : "card");

    await database.run(
      `INSERT INTO orders (id, user_id, placed_at, status, status_tone, total, item_count, summary, payment, delivery, fulfillment_mode, fulfillment_status, supplier_id, supplier_name, tracking_code, supplier_reference, internal_notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         user_id = excluded.user_id,
         placed_at = excluded.placed_at,
         status = excluded.status,
         status_tone = excluded.status_tone,
         total = excluded.total,
         item_count = excluded.item_count,
         summary = excluded.summary,
         payment = excluded.payment,
         delivery = excluded.delivery,
         fulfillment_mode = excluded.fulfillment_mode,
         fulfillment_status = excluded.fulfillment_status,
         supplier_id = excluded.supplier_id,
         supplier_name = excluded.supplier_name,
         tracking_code = excluded.tracking_code,
         supplier_reference = excluded.supplier_reference,
         internal_notes = excluded.internal_notes`,
      order.id,
      defaultUserId,
      order.placedAt,
      order.status,
      order.statusTone,
      order.total,
      order.itemCount,
      order.summary,
      order.payment,
      order.delivery,
      orderFulfillment.mode,
      order.fulfillmentStatus || orderFulfillment.fulfillmentStatus,
      orderFulfillment.supplierId,
      orderFulfillment.supplierName,
      order.trackingCode || "",
      order.supplierReference || "",
      order.internalNotes || orderFulfillment.internalNotes
    );

    for (const item of orderItems) {
      await database.run(
        `INSERT INTO order_items (order_id, product_id, name, quantity, price, supplier_id, supplier_name, supplier_sku, supplier_cost, fulfillment_mode)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(order_id, product_id) DO UPDATE SET
           name = excluded.name,
           quantity = excluded.quantity,
           price = excluded.price,
           supplier_id = excluded.supplier_id,
           supplier_name = excluded.supplier_name,
           supplier_sku = excluded.supplier_sku,
           supplier_cost = excluded.supplier_cost,
           fulfillment_mode = excluded.fulfillment_mode`,
        order.id,
        item.id,
        item.name,
        item.quantity,
        item.price,
        item.supplierId,
        item.supplierName,
        item.supplierSku,
        item.supplierCost,
        item.fulfillmentMode
      );
    }
  }

  return database;
}

async function buildBootstrapResponse(req) {
  const profile = await getProfile(req.currentUserId);

  return {
    session: {
      isAuthenticated: Boolean(req.session.isAuthenticated),
      isAdmin: profile.role === "admin",
      userId: req.currentUserId
    },
    features: {
      googleAuth: {
        enabled: Boolean(GOOGLE_CLIENT_ID),
        clientId: GOOGLE_CLIENT_ID
      }
    },
    products: await getProducts(),
    categories: await getCategories(),
    profile,
    favorites: await getFavorites(req.currentUserId),
    cart: await getCart(req.currentUserId),
    orders: await getOrders(req.currentUserId)
  };
}

async function getProducts() {
  const rows = await db.all(
    `SELECT products.*, suppliers.name AS supplier_name
     FROM products
     LEFT JOIN suppliers ON suppliers.id = products.supplier_id
     ORDER BY products.name`
  );
  return rows.map(mapProduct);
}

async function getCategories() {
  const rows = await db.all("SELECT DISTINCT category FROM products ORDER BY category");
  return rows.map((row) => row.category);
}

async function getProductById(productId) {
  const row = await db.get(
    `SELECT products.*, suppliers.name AS supplier_name
     FROM products
     LEFT JOIN suppliers ON suppliers.id = products.supplier_id
     WHERE products.id = ?`,
    productId
  );
  return row ? mapProduct(row) : null;
}

async function getSuppliers() {
  const rows = await db.all("SELECT * FROM suppliers ORDER BY active DESC, name");
  return rows.map(mapSupplier);
}

async function getSupplierById(supplierId) {
  const row = await db.get("SELECT * FROM suppliers WHERE id = ?", supplierId);
  return row ? mapSupplier(row) : null;
}

async function getProfile(userId) {
  const row = await db.get(
    "SELECT id, name, email, role, phone, city, address, zip, google_id, auth_provider, created_at FROM users WHERE id = ?",
    userId
  );

  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    phone: row.phone || "",
    city: row.city || "",
    address: row.address || "",
    zip: row.zip || "",
    authProvider: row.auth_provider || (row.google_id ? "google" : "password"),
    memberSince: row.created_at
  };
}

async function getFavorites(userId) {
  const rows = await db.all(
    "SELECT product_id FROM favorites WHERE user_id = ? ORDER BY created_at DESC",
    userId
  );
  return rows.map((row) => row.product_id);
}

async function getCart(userId) {
  const rows = await db.all(
    "SELECT product_id AS id, quantity FROM cart_items WHERE user_id = ? ORDER BY rowid DESC",
    userId
  );
  return rows.map((row) => ({
    id: row.id,
    quantity: Number(row.quantity)
  }));
}

async function getCartWithProducts(userId) {
  const cart = await getCart(userId);
  const products = await Promise.all(cart.map((item) => getProductById(item.id)));

  return cart.map((item, index) => ({
    ...item,
    product: products[index]
  })).filter((item) => item.product);
}

async function getOrders(userId) {
  const rows = await db.all(
    "SELECT * FROM orders WHERE user_id = ? ORDER BY rowid DESC",
    userId
  );
  const orderItemsMap = await getOrderItemsMap(rows.map((row) => row.id));
  return rows.map((row) => mapOrder(row, orderItemsMap.get(row.id) || []));
}

async function getOrderById(orderId) {
  const row = await db.get("SELECT * FROM orders WHERE id = ?", orderId);

  if (!row) {
    return null;
  }

  const items = await getOrderItems(orderId);
  return mapOrder(row, items);
}

async function getAllOrders() {
  const rows = await db.all(
    `SELECT orders.*, users.name AS customer_name, users.email AS customer_email, users.phone AS customer_phone, users.city AS customer_city, users.address AS customer_address, users.zip AS customer_zip
     FROM orders
     JOIN users ON users.id = orders.user_id
     ORDER BY orders.rowid DESC`
  );
  const orderItemsMap = await getOrderItemsMap(rows.map((row) => row.id));

  return rows.map((row) => ({
    ...mapOrder(row, orderItemsMap.get(row.id) || []),
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    customerPhone: row.customer_phone || "",
    customerCity: row.customer_city || "",
    customerAddress: row.customer_address || "",
    customerZip: row.customer_zip || ""
  }));
}

async function getAdminStats() {
  const [products, categories, orders, revenue, suppliers, dropshippingProducts, pendingTransfers] = await Promise.all([
    db.get("SELECT COUNT(*) AS total FROM products"),
    db.get("SELECT COUNT(DISTINCT category) AS total FROM products"),
    db.get("SELECT COUNT(*) AS total FROM orders"),
    db.get("SELECT COALESCE(SUM(total), 0) AS total FROM orders"),
    db.get("SELECT COUNT(*) AS total FROM suppliers WHERE active = 1"),
    db.get("SELECT COUNT(*) AS total FROM products WHERE fulfillment_mode = 'dropshipping'"),
    db.get(`SELECT COUNT(*) AS total FROM orders WHERE fulfillment_mode != 'own_stock' AND fulfillment_status IN ('Pagamento pendente', 'A repassar ao fornecedor', 'Repassado manualmente')`)
  ]);

  return {
    products: Number(products.total),
    categories: Number(categories.total),
    orders: Number(orders.total),
    revenue: Number(revenue.total),
    suppliers: Number(suppliers.total),
    dropshippingProducts: Number(dropshippingProducts.total),
    pendingTransfers: Number(pendingTransfers.total)
  };
}

async function getOrderItems(orderId) {
  const rows = await db.all(
    "SELECT * FROM order_items WHERE order_id = ? ORDER BY rowid ASC",
    orderId
  );

  return rows.map(mapOrderItem);
}

async function getOrderItemsMap(orderIds) {
  if (!orderIds.length) {
    return new Map();
  }

  const placeholders = orderIds.map(() => "?").join(", ");
  const rows = await db.all(
    `SELECT * FROM order_items WHERE order_id IN (${placeholders}) ORDER BY rowid ASC`,
    orderIds
  );

  const grouped = new Map();

  for (const row of rows) {
    if (!grouped.has(row.order_id)) {
      grouped.set(row.order_id, []);
    }

    grouped.get(row.order_id).push(mapOrderItem(row));
  }

  return grouped;
}

async function ensureColumn(database, tableName, columnName, definition) {
  const columns = await database.all(`PRAGMA table_info(${tableName})`);

  if (!columns.some((column) => column.name === columnName)) {
    await database.exec(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${definition}`);
  }
}

async function requireAdmin(req, res, next) {
  try {
    if (!req.session.isAuthenticated) {
      res.status(401).json({ message: "Entre com uma conta admin para acessar o painel." });
      return;
    }

    const user = await db.get("SELECT role FROM users WHERE id = ?", req.currentUserId);

    if (!user || user.role !== "admin") {
      res.status(403).json({ message: "Acesso restrito ao administrador." });
      return;
    }

    next();
  } catch (error) {
    next(error);
  }
}

async function establishSession(req, userId, isAuthenticated) {
  await new Promise((resolve, reject) => {
    req.session.regenerate((error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });

  req.session.userId = userId;
  req.session.isAuthenticated = isAuthenticated;
  req.session.revision = SESSION_REVISION;
}

function normalizeProductInput(input, existing = {}) {
  const id = slugify(String(existing.id || input.id || input.name || "produto"));
  const supplierId = String(input.supplierId ?? existing.supplierId ?? "").trim();
  const supplier = SEED_SUPPLIERS.find((entry) => entry.id === supplierId);

  return {
    id,
    name: String(input.name || existing.name || "").trim() || "Novo produto JL AXION",
    category: String(input.category || existing.category || "Utilidades").trim() || "Utilidades",
    badge: String(input.badge || existing.badge || "Novo").trim() || "Novo",
    price: Number(input.price ?? existing.price ?? 0),
    oldPrice: input.oldPrice === "" || input.oldPrice == null
      ? null
      : Number(input.oldPrice),
    rating: Number(input.rating ?? existing.rating ?? 4.8),
    reviews: Number(input.reviews ?? existing.reviews ?? 0),
    shipping: String(input.shipping || existing.shipping || "Entrega amanha").trim() || "Entrega amanha",
    description: String(input.description || existing.description || "").trim() || "Descricao premium do produto JL AXION.",
    image: String(input.image || existing.image || "assets/jl-axion-mark.svg").trim() || "assets/jl-axion-mark.svg",
    fulfillmentMode: String(input.fulfillmentMode || existing.fulfillmentMode || "dropshipping").trim() || "dropshipping",
    supplierId,
    supplierName: input.supplierName || existing.supplierName || supplier?.name || "",
    supplierSku: String(input.supplierSku || existing.supplierSku || "").trim(),
    supplierCost: input.supplierCost === "" || input.supplierCost == null
      ? Number(existing.supplierCost ?? 0)
      : Number(input.supplierCost),
    supplierEtaDays: Number(input.supplierEtaDays ?? existing.supplierEtaDays ?? 0),
    supplierUrl: String(input.supplierUrl || existing.supplierUrl || supplier?.website || "").trim(),
    procurementNotes: String(input.procurementNotes || existing.procurementNotes || "").trim()
  };
}

function normalizeSupplierInput(input, existing = {}) {
  const id = slugify(String(existing.id || input.id || input.name || "fornecedor"));

  return {
    id,
    name: String(input.name || existing.name || "").trim() || "Fornecedor JL AXION",
    contactName: String(input.contactName || existing.contactName || "").trim(),
    email: String(input.email || existing.email || "").trim().toLowerCase(),
    phone: String(input.phone || existing.phone || "").trim(),
    leadTimeMin: Math.max(0, Number(input.leadTimeMin ?? existing.leadTimeMin ?? 0)),
    leadTimeMax: Math.max(0, Number(input.leadTimeMax ?? existing.leadTimeMax ?? 0)),
    orderChannel: String(input.orderChannel || existing.orderChannel || "Manual").trim() || "Manual",
    website: String(input.website || existing.website || "").trim(),
    notes: String(input.notes || existing.notes || "").trim(),
    active: input.active === false || input.active === "false" || input.active === 0 || input.active === "0"
      ? false
      : input.active === true || input.active === "true" || input.active === 1 || input.active === "1" || input.active === "on"
        ? true
        : Boolean(existing.active ?? true)
  };
}

function slugify(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48) || "produto-jl-axion";
}

function mapProduct(row) {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    badge: row.badge,
    price: Number(row.price),
    oldPrice: row.old_price == null ? null : Number(row.old_price),
    rating: Number(row.rating),
    reviews: Number(row.reviews),
    shipping: row.shipping,
    description: row.description,
    image: row.image,
    fulfillmentMode: row.fulfillment_mode || "own_stock",
    supplierId: row.supplier_id || "",
    supplierName: row.supplier_name || "",
    supplierSku: row.supplier_sku || "",
    supplierCost: row.supplier_cost == null ? 0 : Number(row.supplier_cost),
    supplierEtaDays: Number(row.supplier_eta_days || 0),
    supplierUrl: row.supplier_url || "",
    procurementNotes: row.procurement_notes || ""
  };
}

function mapSupplier(row) {
  return {
    id: row.id,
    name: row.name,
    contactName: row.contact_name || "",
    email: row.email || "",
    phone: row.phone || "",
    leadTimeMin: Number(row.lead_time_min || 0),
    leadTimeMax: Number(row.lead_time_max || 0),
    orderChannel: row.order_channel || "Manual",
    website: row.website || "",
    notes: row.notes || "",
    active: Boolean(row.active)
  };
}

function mapOrder(row, items = []) {
  return {
    id: row.id,
    placedAt: row.placed_at,
    status: row.status,
    statusTone: row.status_tone,
    total: Number(row.total),
    itemCount: Number(row.item_count),
    summary: row.summary,
    payment: row.payment,
    delivery: row.delivery,
    fulfillmentMode: row.fulfillment_mode || "own_stock",
    fulfillmentStatus: row.fulfillment_status || "",
    supplierId: row.supplier_id || "",
    supplierName: row.supplier_name || "",
    trackingCode: row.tracking_code || "",
    supplierReference: row.supplier_reference || "",
    internalNotes: row.internal_notes || "",
    items
  };
}

function mapOrderItem(row) {
  return {
    id: row.product_id,
    name: row.name,
    quantity: Number(row.quantity),
    price: Number(row.price),
    supplierId: row.supplier_id || "",
    supplierName: row.supplier_name || "",
    supplierSku: row.supplier_sku || "",
    supplierCost: row.supplier_cost == null ? 0 : Number(row.supplier_cost),
    fulfillmentMode: row.fulfillment_mode || "own_stock"
  };
}

function calculateTotals(cartItems) {
  const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const shipping = subtotal >= 600 ? 0 : 24.9;
  const discount = subtotal * 0.05;
  return {
    subtotal,
    shipping,
    discount,
    total: subtotal + shipping - discount
  };
}

function createOrderId() {
  return `AX-${String(Date.now()).slice(-6)}`;
}

function formatDate(date) {
  return date.toLocaleDateString("pt-BR");
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

function getStatusTone(status) {
  const normalized = String(status || "").toLowerCase();

  if (normalized.includes("entreg") || normalized.includes("confirm")) {
    return "success";
  }

  if (normalized.includes("cancel")) {
    return "warning";
  }

  return "warning";
}

function createSeedProduct(product) {
  const supplierId = SUPPLIER_BY_CATEGORY[product.category] || "";
  const supplier = SEED_SUPPLIERS.find((entry) => entry.id === supplierId);
  const etaDays = SUPPLIER_ETA_BY_CATEGORY[product.category] || 3;
  const supplierCost = roundCurrency(product.price * (SUPPLIER_COST_RATIO_BY_CATEGORY[product.category] || 0.5));

  return {
    ...product,
    fulfillmentMode: "dropshipping",
    supplierId,
    supplierName: supplier?.name || "",
    supplierSku: `${supplierId || "axion"}-${product.id}`.toUpperCase(),
    supplierCost,
    supplierEtaDays: etaDays,
    supplierUrl: supplier?.website || "",
    procurementNotes: `Repasse manual inicial via ${supplier?.orderChannel || "canal combinado"} com envio direto ao cliente em ate ${etaDays} dias uteis.`
  };
}

function buildOrderFulfillment(cartItems, payment) {
  const itemModes = [...new Set(cartItems.map((item) => item.product.fulfillmentMode || "own_stock"))];
  const supplierIds = [...new Set(cartItems.map((item) => item.product.supplierId).filter(Boolean))];
  const supplierNames = [...new Set(cartItems.map((item) => item.product.supplierName).filter(Boolean))];
  const allDropshipping = itemModes.length === 1 && itemModes[0] === "dropshipping";
  const hasDropshipping = itemModes.includes("dropshipping");
  const paymentPending = payment === "pix";

  if (paymentPending) {
    return {
      mode: allDropshipping ? "dropshipping" : hasDropshipping ? "hybrid" : "own_stock",
      status: "Aguardando pagamento",
      fulfillmentStatus: "Pagamento pendente",
      supplierId: supplierIds.length === 1 ? supplierIds[0] : "",
      supplierName: supplierNames.length === 1 ? supplierNames[0] : supplierNames.length ? "Operacao multipla" : "",
      internalNotes: hasDropshipping
        ? "Assim que o pagamento for confirmado, copie o resumo e repasse manualmente ao parceiro."
        : "Pagamento aguardando confirmacao antes da separacao interna."
    };
  }

  if (allDropshipping) {
    return {
      mode: "dropshipping",
      status: "Aguardando repasse ao fornecedor",
      fulfillmentStatus: "A repassar ao fornecedor",
      supplierId: supplierIds.length === 1 ? supplierIds[0] : "",
      supplierName: supplierNames.length === 1 ? supplierNames[0] : "Operacao multipla",
      internalNotes: "Pedido pronto para repasse manual ao fornecedor parceiro."
    };
  }

  if (hasDropshipping) {
    return {
      mode: "hybrid",
      status: "Pedido confirmado",
      fulfillmentStatus: "Separar itens proprios e repassar parceiros",
      supplierId: "",
      supplierName: "Operacao multipla",
      internalNotes: "Pedido hibrido: separar itens proprios e repassar os parceiros antes do despacho."
    };
  }

  return {
    mode: "own_stock",
    status: "Pedido confirmado",
    fulfillmentStatus: "Separacao interna",
    supplierId: "",
    supplierName: "",
    internalNotes: "Fluxo proprio sem parceiro."
  };
}

function roundCurrency(value) {
  return Number(Number(value || 0).toFixed(2));
}
