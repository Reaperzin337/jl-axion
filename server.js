const express = require("express");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3");
const SQLiteStore = require("connect-sqlite3")(session);
const { open } = require("sqlite");

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

const HTML_FILES = new Set([
  "index.html",
  "login.html",
  "cart.html",
  "promotions.html",
  "account.html",
  "favorites.html",
  "product.html",
  "category.html",
  "checkout.html",
  "admin.html",
  "styles.css",
  "app.js",
  "admin.js",
  "robots.txt",
  "sitemap.xml",
  "site.webmanifest",
  "favicon.svg",
  "jk-bg-fog-4k.png"
]);

const SEED_PRODUCTS = [
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
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'", "data:"],
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
        filters.push("category = ?");
        params.push(String(category));
      }

      if (search) {
        filters.push("(LOWER(name) LIKE ? OR LOWER(description) LIKE ? OR LOWER(category) LIKE ?)");
        const needle = `%${String(search).trim().toLowerCase()}%`;
        params.push(needle, needle, needle);
      }

      const whereClause = filters.length ? `WHERE ${filters.join(" AND ")}` : "";
      const rows = await db.all(`SELECT * FROM products ${whereClause} ORDER BY name`, params);
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
      const user = await getProfile(req.currentUserId);
      res.json({
        isAuthenticated: Boolean(req.session.isAuthenticated),
        isAdmin: user.role === "admin",
        user
      });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/auth/login", async (req, res, next) => {
    try {
      const email = String(req.body.email || "").trim().toLowerCase();
      const password = String(req.body.password || "").trim();
      const name = String(req.body.name || "").trim();

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
        const passwordHash = await bcrypt.hash(password, 10);
        const result = await db.run(
        `INSERT INTO users (name, email, password_hash, role, phone, city, address, zip)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          name || email.split("@")[0],
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
        return;
      }

      const matches = await bcrypt.compare(password, user.password_hash);

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

  app.get("/api/admin/session", async (req, res, next) => {
    try {
      const user = await getProfile(req.currentUserId);
      res.json({
        isAuthenticated: Boolean(req.session.isAuthenticated),
        isAdmin: user.role === "admin",
        user
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
      const status = payment === "pix" ? "Aguardando pagamento" : "Pedido confirmado";
      const statusTone = payment === "pix" ? "warning" : "success";

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
        `INSERT INTO orders (id, user_id, placed_at, status, status_tone, total, item_count, summary, payment, delivery)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        orderId,
        req.currentUserId,
        placedAt,
        status,
        statusTone,
        totals.total,
        cartItems.reduce((sum, item) => sum + item.quantity, 0),
        `${getDeliveryLabel(delivery)} - ${profile.city}`,
        getPaymentLabel(payment),
        getDeliveryLabel(delivery)
      );

      for (const item of cartItems) {
        await db.run(
          `INSERT INTO order_items (order_id, product_id, name, quantity, price)
           VALUES (?, ?, ?, ?, ?)`,
          orderId,
          item.product.id,
          item.product.name,
          item.quantity,
          item.product.price
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
      const statusTone = getStatusTone(status);

      await db.run(
        "UPDATE orders SET status = ?, status_tone = ? WHERE id = ?",
        status,
        statusTone,
        req.params.id
      );

      res.json({
        message: "Status do pedido atualizado.",
        order: await getOrderById(req.params.id),
        orders: await getAllOrders()
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
        `INSERT INTO products (id, name, category, badge, price, old_price, rating, reviews, shipping, description, image)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
        product.image
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
         SET name = ?, category = ?, badge = ?, price = ?, old_price = ?, rating = ?, reviews = ?, shipping = ?, description = ?, image = ?
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
      image TEXT
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
      delivery TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS order_items (
      order_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      name TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      price REAL NOT NULL,
      PRIMARY KEY (order_id, product_id)
    );
  `);

  await ensureColumn(database, "users", "role", "TEXT NOT NULL DEFAULT 'customer'");

  const passwordHash = await bcrypt.hash(SEED_PROFILE.password, 10);
  await database.run(
    `INSERT INTO users (name, email, password_hash, role, phone, city, address, zip)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(email) DO UPDATE SET
       name = excluded.name,
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

  for (const product of SEED_PRODUCTS) {
    await database.run(
      `INSERT INTO products (id, name, category, badge, price, old_price, rating, reviews, shipping, description, image)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
         image = excluded.image`,
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
      product.image
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
    await database.run(
      `INSERT INTO orders (id, user_id, placed_at, status, status_tone, total, item_count, summary, payment, delivery)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         user_id = excluded.user_id,
         placed_at = excluded.placed_at,
         status = excluded.status,
         status_tone = excluded.status_tone,
         total = excluded.total,
         item_count = excluded.item_count,
         summary = excluded.summary,
         payment = excluded.payment,
         delivery = excluded.delivery`,
      order.id,
      defaultUserId,
      order.placedAt,
      order.status,
      order.statusTone,
      order.total,
      order.itemCount,
      order.summary,
      order.payment,
      order.delivery
    );

    for (const item of order.items) {
      await database.run(
        `INSERT INTO order_items (order_id, product_id, name, quantity, price)
         VALUES (?, ?, ?, ?, ?)
         ON CONFLICT(order_id, product_id) DO UPDATE SET
           name = excluded.name,
           quantity = excluded.quantity,
           price = excluded.price`,
        order.id,
        item.id,
        item.name,
        item.quantity,
        item.price
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
    products: await getProducts(),
    categories: await getCategories(),
    profile,
    favorites: await getFavorites(req.currentUserId),
    cart: await getCart(req.currentUserId),
    orders: await getOrders(req.currentUserId)
  };
}

async function getProducts() {
  const rows = await db.all("SELECT * FROM products ORDER BY name");
  return rows.map(mapProduct);
}

async function getCategories() {
  const rows = await db.all("SELECT DISTINCT category FROM products ORDER BY category");
  return rows.map((row) => row.category);
}

async function getProductById(productId) {
  const row = await db.get("SELECT * FROM products WHERE id = ?", productId);
  return row ? mapProduct(row) : null;
}

async function getProfile(userId) {
  const row = await db.get(
    "SELECT id, name, email, role, phone, city, address, zip, created_at FROM users WHERE id = ?",
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
  return rows.map(mapOrder);
}

async function getOrderById(orderId) {
  const row = await db.get("SELECT * FROM orders WHERE id = ?", orderId);
  return row ? mapOrder(row) : null;
}

async function getAllOrders() {
  const rows = await db.all(
    `SELECT orders.*, users.name AS customer_name, users.email AS customer_email
     FROM orders
     JOIN users ON users.id = orders.user_id
     ORDER BY orders.rowid DESC`
  );

  return rows.map((row) => ({
    ...mapOrder(row),
    customerName: row.customer_name,
    customerEmail: row.customer_email
  }));
}

async function getAdminStats() {
  const [products, categories, orders, revenue] = await Promise.all([
    db.get("SELECT COUNT(*) AS total FROM products"),
    db.get("SELECT COUNT(DISTINCT category) AS total FROM products"),
    db.get("SELECT COUNT(*) AS total FROM orders"),
    db.get("SELECT COALESCE(SUM(total), 0) AS total FROM orders")
  ]);

  return {
    products: Number(products.total),
    categories: Number(categories.total),
    orders: Number(orders.total),
    revenue: Number(revenue.total)
  };
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
    image: String(input.image || existing.image || "assets/jl-axion-mark.svg").trim() || "assets/jl-axion-mark.svg"
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
    image: row.image
  };
}

function mapOrder(row) {
  return {
    id: row.id,
    placedAt: row.placed_at,
    status: row.status,
    statusTone: row.status_tone,
    total: Number(row.total),
    itemCount: Number(row.item_count),
    summary: row.summary,
    payment: row.payment
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
