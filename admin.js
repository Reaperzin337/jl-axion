const adminState = {
  session: null,
  user: null,
  products: [],
  categories: [],
  orders: [],
  stats: {
    products: 0,
    categories: 0,
    orders: 0,
    revenue: 0
  },
  search: ""
};

const ORDER_STATUSES = [
  "Aguardando pagamento",
  "Pedido confirmado",
  "Em separacao",
  "Em transporte",
  "Entregue",
  "Cancelado"
];

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL"
});

const adminElements = {};

document.addEventListener("DOMContentLoaded", () => {
  cacheAdminElements();
  bindAdminEvents();
  initializeAdmin().catch((error) => {
    console.error("Falha ao iniciar o painel admin:", error);
    renderLoggedOut();
    showFeedback(error.message || "Nao foi possivel carregar o painel admin.", "warning");
  });
});

function cacheAdminElements() {
  adminElements.authRoot = document.querySelector("[data-admin-auth]");
  adminElements.dashboard = document.querySelector("[data-admin-dashboard]");
  adminElements.feedback = document.querySelector("[data-admin-feedback]");
  adminElements.stats = document.querySelector("[data-admin-stats]");
  adminElements.productForm = document.querySelector("[data-admin-product-form]");
  adminElements.productSubmit = adminElements.productForm.querySelector('button[type="submit"]');
  adminElements.categories = document.querySelector("[data-admin-categories]");
  adminElements.productSearch = document.querySelector("[data-admin-product-search]");
  adminElements.products = document.querySelector("[data-admin-products]");
  adminElements.orders = document.querySelector("[data-admin-orders]");
  adminElements.logout = document.querySelector("[data-admin-logout]");
}

function bindAdminEvents() {
  adminElements.authRoot.addEventListener("submit", handleAuthSubmit);
  adminElements.productForm.addEventListener("submit", handleProductSubmit);
  adminElements.productSearch.addEventListener("input", handleSearchInput);
  adminElements.dashboard.addEventListener("click", handleDashboardClick);
  adminElements.logout.addEventListener("click", handleLogout);
}

async function initializeAdmin() {
  const session = await apiRequest("/api/admin/session");
  adminState.session = session;
  adminState.user = session.user || null;

  if (session.isAuthenticated && session.isAdmin) {
    await loadDashboard();
    clearProductForm();
    return;
  }

  renderLoggedOut();

  if (session.isAuthenticated && session.user) {
    showFeedback(
      `A conta ${session.user.email} esta logada, mas nao tem permissao de administrador.`,
      "warning"
    );
    return;
  }

  showFeedback("Entre com uma conta admin para liberar o painel da loja.", "info");
}

async function loadDashboard(message = "") {
  try {
    const payload = await apiRequest("/api/admin/bootstrap");
    applyAdminPayload(payload);
    renderDashboardShell();
    renderAdminData();

    if (message) {
      showFeedback(message, "success");
    }
  } catch (error) {
    if (error.status === 401 || error.status === 403) {
      renderLoggedOut();
      showFeedback(error.message, "warning");
      return;
    }

    throw error;
  }
}

function renderLoggedOut() {
  adminElements.authRoot.hidden = false;
  adminElements.dashboard.hidden = true;
  adminElements.logout.hidden = true;

  const currentAccount = adminState.session && adminState.session.isAuthenticated && adminState.user
    ? `
      <div class="summary-note admin-session-note">
        <strong>Conta atual</strong>
        <span>${escapeHtml(adminState.user.name || adminState.user.email)}</span>
        <small>${escapeHtml(adminState.user.email)}</small>
      </div>
    `
    : "";

  adminElements.authRoot.innerHTML = `
    <article class="content-card admin-auth-card">
      <div class="section-heading section-heading--stacked">
        <div>
          <span class="eyebrow">Acesso admin</span>
          <h2>Entrar no painel da JL AXION</h2>
        </div>
      </div>

      <p>Use uma conta administrativa para gerenciar catalogo, pedidos e a operacao da loja.</p>

      ${currentAccount}

      <form class="form-grid" data-admin-login-form>
        <label class="field">
          <span>E-mail</span>
          <input class="input" type="email" name="email" placeholder="admin@jlaxion.com.br" required>
        </label>

        <label class="field">
          <span>Senha</span>
          <input class="input" type="password" name="password" placeholder="Sua senha admin" required>
        </label>

        <button type="submit" class="primary-btn primary-btn--full">Entrar no painel</button>
      </form>

      <div class="admin-auth-card__hint">
        <strong>Acesso seed</strong>
        <div class="admin-auth-card__credentials">
          <span>admin@jlaxion.com.br</span>
          <span>axionadmin</span>
        </div>
      </div>
    </article>
  `;
}

function renderDashboardShell() {
  adminElements.authRoot.hidden = true;
  adminElements.dashboard.hidden = false;
  adminElements.logout.hidden = false;
}

function renderAdminData() {
  renderStats();
  renderCategoryOptions();
  renderProducts();
  renderOrders();
}

function renderStats() {
  const cards = [
    {
      label: "Produtos",
      value: adminState.stats.products,
      detail: "Catalogo pronto para vitrine e detalhe."
    },
    {
      label: "Categorias",
      value: adminState.stats.categories,
      detail: "Departamentos ativos para a home e paginas internas."
    },
    {
      label: "Pedidos",
      value: adminState.stats.orders,
      detail: "Fluxo comercial monitorado no painel."
    },
    {
      label: "Receita",
      value: formatCurrency(adminState.stats.revenue),
      detail: adminState.user
        ? `Sessao admin: ${escapeHtml(adminState.user.name || adminState.user.email)}`
        : "Receita consolidada da loja."
    }
  ];

  adminElements.stats.innerHTML = cards.map((card) => `
    <article class="content-card admin-stat-card">
      <span>${card.label}</span>
      <strong>${card.value}</strong>
      <p>${card.detail}</p>
    </article>
  `).join("");
}

function renderCategoryOptions() {
  adminElements.categories.innerHTML = adminState.categories
    .map((category) => `<option value="${escapeAttribute(category)}"></option>`)
    .join("");
}

function renderProducts() {
  const searchTerm = adminState.search.trim().toLowerCase();
  const filteredProducts = adminState.products.filter((product) => {
    if (!searchTerm) {
      return true;
    }

    return [
      product.name,
      product.category,
      product.badge,
      product.id
    ].some((value) => String(value || "").toLowerCase().includes(searchTerm));
  });

  if (!filteredProducts.length) {
    adminElements.products.innerHTML = `
      <tr>
        <td colspan="5" class="admin-empty-cell">
          <div class="admin-empty">Nenhum produto encontrado para esse filtro.</div>
        </td>
      </tr>
    `;
    return;
  }

  adminElements.products.innerHTML = filteredProducts.map((product) => `
    <tr>
      <td>
        <div class="admin-product-cell">
          <div class="admin-product-thumb">
            <img src="${escapeAttribute(product.image)}" alt="${escapeAttribute(product.name)}">
          </div>

          <div class="admin-product-meta">
            <strong>${escapeHtml(product.name)}</strong>
            <small>${escapeHtml(product.id)}</small>
          </div>
        </div>
      </td>

      <td>${escapeHtml(product.category)}</td>

      <td>
        <div class="admin-price">
          <strong>${formatCurrency(product.price)}</strong>
          <small>${product.oldPrice ? `de ${formatCurrency(product.oldPrice)}` : "sem preco anterior"}</small>
        </div>
      </td>

      <td>
        <span class="${getToneClass(product.oldPrice ? "warning" : "success")}">
          ${escapeHtml(product.badge || "Ativo")}
        </span>
      </td>

      <td>
        <div class="admin-table__actions">
          <button type="button" class="secondary-btn" data-admin-action="edit-product" data-product-id="${escapeAttribute(product.id)}">
            Editar
          </button>
          <button type="button" class="ghost-btn" data-admin-action="delete-product" data-product-id="${escapeAttribute(product.id)}">
            Excluir
          </button>
        </div>
      </td>
    </tr>
  `).join("");
}

function renderOrders() {
  if (!adminState.orders.length) {
    adminElements.orders.innerHTML = `<div class="admin-empty">Os pedidos vao aparecer aqui assim que o checkout for usado.</div>`;
    return;
  }

  adminElements.orders.innerHTML = adminState.orders.map((order) => `
    <article class="admin-order-card">
      <div class="admin-order-card__top">
        <div class="stack-gap">
          <span class="eyebrow">Pedido ${escapeHtml(order.id)}</span>
          <h3>${escapeHtml(order.customerName || "Cliente JL AXION")}</h3>
          <p>${escapeHtml(order.customerEmail || "cliente@jlaxion.com.br")}</p>
        </div>

        <span class="${getToneClass(order.statusTone)}">${escapeHtml(order.status)}</span>
      </div>

      <div class="admin-order-card__summary">
        <div>
          <span>Data</span>
          <strong>${escapeHtml(order.placedAt)}</strong>
        </div>
        <div>
          <span>Total</span>
          <strong>${formatCurrency(order.total)}</strong>
        </div>
        <div>
          <span>Itens</span>
          <strong>${escapeHtml(String(order.itemCount))}</strong>
        </div>
        <div>
          <span>Pagamento</span>
          <strong>${escapeHtml(order.payment)}</strong>
        </div>
      </div>

      <div class="summary-note">${escapeHtml(order.summary || "Resumo indisponivel.")}</div>

      <div class="admin-order-card__actions">
        <select class="input" data-admin-order-status="${escapeAttribute(order.id)}">
          ${ORDER_STATUSES.map((status) => `
            <option value="${escapeAttribute(status)}" ${order.status === status ? "selected" : ""}>
              ${escapeHtml(status)}
            </option>
          `).join("")}
        </select>

        <button type="button" class="primary-btn" data-admin-action="update-order" data-order-id="${escapeAttribute(order.id)}">
          Atualizar status
        </button>
      </div>
    </article>
  `).join("");
}

async function handleAuthSubmit(event) {
  const form = event.target.closest("[data-admin-login-form]");

  if (!form) {
    return;
  }

  event.preventDefault();

  const formData = new FormData(form);
  const payload = {
    email: String(formData.get("email") || "").trim(),
    password: String(formData.get("password") || "").trim()
  };

  try {
    const response = await apiRequest("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const session = await apiRequest("/api/admin/session");
    adminState.session = session;
    adminState.user = session.user || null;

    if (!session.isAdmin) {
      renderLoggedOut();
      showFeedback(
        "Login feito, mas a conta informada nao tem permissao de administrador.",
        "warning"
      );
      return;
    }

    await loadDashboard(response.message || "Painel admin liberado.");
    clearProductForm();
  } catch (error) {
    showFeedback(error.message || "Nao foi possivel entrar no painel.", "warning");
  }
}

async function handleProductSubmit(event) {
  event.preventDefault();

  const formData = new FormData(adminElements.productForm);
  const currentId = String(formData.get("currentId") || "").trim();
  const payload = {
    name: String(formData.get("name") || "").trim(),
    category: String(formData.get("category") || "").trim(),
    badge: String(formData.get("badge") || "").trim(),
    price: String(formData.get("price") || "").trim(),
    oldPrice: String(formData.get("oldPrice") || "").trim(),
    rating: String(formData.get("rating") || "").trim(),
    reviews: String(formData.get("reviews") || "").trim(),
    shipping: String(formData.get("shipping") || "").trim(),
    image: String(formData.get("image") || "").trim(),
    description: String(formData.get("description") || "").trim()
  };

  const endpoint = currentId
    ? `/api/admin/products/${encodeURIComponent(currentId)}`
    : "/api/admin/products";

  const method = currentId ? "PUT" : "POST";

  try {
    const response = await apiRequest(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    applyAdminPayload(response);
    renderAdminData();
    clearProductForm();
    showFeedback(response.message || "Produto salvo no painel.", "success");
  } catch (error) {
    showFeedback(error.message || "Nao foi possivel salvar o produto.", "warning");
  }
}

function handleSearchInput(event) {
  adminState.search = event.target.value || "";
  renderProducts();
}

async function handleDashboardClick(event) {
  const actionTarget = event.target.closest("[data-admin-action]");

  if (!actionTarget) {
    return;
  }

  const { adminAction, productId, orderId } = actionTarget.dataset;

  if (adminAction === "clear-product-form") {
    clearProductForm();
    return;
  }

  if (adminAction === "edit-product") {
    const product = adminState.products.find((item) => item.id === productId);

    if (product) {
      fillProductForm(product);
      showFeedback(`Editando ${product.name}.`, "info");
    }

    return;
  }

  if (adminAction === "delete-product") {
    await deleteProduct(productId);
    return;
  }

  if (adminAction === "update-order") {
    await updateOrderStatus(orderId);
  }
}

async function deleteProduct(productId) {
  const product = adminState.products.find((item) => item.id === productId);

  if (!product) {
    return;
  }

  const confirmed = window.confirm(`Remover "${product.name}" do catalogo?`);

  if (!confirmed) {
    return;
  }

  try {
    const response = await apiRequest(`/api/admin/products/${encodeURIComponent(productId)}`, {
      method: "DELETE"
    });

    applyAdminPayload(response);
    renderAdminData();

    if (adminElements.productForm.elements.currentId.value === productId) {
      clearProductForm();
    }

    showFeedback(response.message || "Produto removido.", "success");
  } catch (error) {
    showFeedback(error.message || "Nao foi possivel remover o produto.", "warning");
  }
}

async function updateOrderStatus(orderId) {
  const select = adminElements.orders.querySelector(`[data-admin-order-status="${orderId}"]`);
  const status = select ? select.value : "";

  try {
    const response = await apiRequest(`/api/admin/orders/${encodeURIComponent(orderId)}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ status })
    });

    applyAdminPayload(response);
    renderOrders();
    showFeedback(response.message || "Status atualizado.", "success");
  } catch (error) {
    showFeedback(error.message || "Nao foi possivel atualizar o pedido.", "warning");
  }
}

async function handleLogout() {
  try {
    await apiRequest("/api/auth/logout", {
      method: "POST"
    });

    adminState.session = null;
    adminState.user = null;
    adminState.products = [];
    adminState.categories = [];
    adminState.orders = [];
    adminState.stats = {
      products: 0,
      categories: 0,
      orders: 0,
      revenue: 0
    };

    renderLoggedOut();
    showFeedback("Sessao admin encerrada.", "success");
  } catch (error) {
    showFeedback(error.message || "Nao foi possivel sair do painel.", "warning");
  }
}

function fillProductForm(product) {
  adminElements.productForm.elements.currentId.value = product.id;
  adminElements.productForm.elements.name.value = product.name;
  adminElements.productForm.elements.category.value = product.category;
  adminElements.productForm.elements.badge.value = product.badge || "";
  adminElements.productForm.elements.price.value = product.price;
  adminElements.productForm.elements.oldPrice.value = product.oldPrice ?? "";
  adminElements.productForm.elements.rating.value = product.rating || "";
  adminElements.productForm.elements.reviews.value = product.reviews || "";
  adminElements.productForm.elements.shipping.value = product.shipping || "";
  adminElements.productForm.elements.image.value = product.image || "";
  adminElements.productForm.elements.description.value = product.description || "";
  adminElements.productSubmit.textContent = "Atualizar produto";
  adminElements.productForm.scrollIntoView({ behavior: "smooth", block: "start" });
}

function clearProductForm() {
  adminElements.productForm.reset();
  adminElements.productForm.elements.currentId.value = "";
  adminElements.productSubmit.textContent = "Salvar produto";
}

function applyAdminPayload(payload) {
  if (payload.user) {
    adminState.user = payload.user;
  }

  if (payload.products) {
    adminState.products = sortProducts(payload.products);
  }

  if (payload.categories) {
    adminState.categories = [...payload.categories];
  }

  if (payload.orders) {
    adminState.orders = [...payload.orders];
  }

  if (payload.stats) {
    adminState.stats = {
      ...adminState.stats,
      ...payload.stats
    };
  }
}

function sortProducts(products) {
  return [...products].sort((left, right) => left.name.localeCompare(right.name, "pt-BR"));
}

function showFeedback(message, tone = "info") {
  adminElements.feedback.hidden = false;
  adminElements.feedback.className = `summary-note admin-feedback admin-feedback--${tone}`;
  adminElements.feedback.textContent = message;
}

function getToneClass(tone) {
  if (tone === "success") {
    return "status-chip status-chip--success";
  }

  if (tone === "warning") {
    return "status-chip status-chip--warning";
  }

  return "status-chip";
}

function formatCurrency(value) {
  return currencyFormatter.format(Number(value || 0));
}

async function apiRequest(url, options = {}) {
  const response = await fetch(url, {
    credentials: "same-origin",
    ...options
  });

  const isJson = response.headers.get("content-type")?.includes("application/json");
  const payload = isJson ? await response.json() : null;

  if (!response.ok) {
    const error = new Error(payload && payload.message ? payload.message : "Erro ao comunicar com o servidor.");
    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  return payload;
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeAttribute(value) {
  return escapeHtml(value);
}
