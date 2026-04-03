const adminState = {
  session: null,
  user: null,
  products: [],
  categories: [],
  suppliers: [],
  orders: [],
  stats: {
    products: 0,
    categories: 0,
    orders: 0,
    revenue: 0,
    suppliers: 0,
    dropshippingProducts: 0,
    pendingTransfers: 0
  },
  search: "",
  ai: {
    enabled: false,
    provider: "gemini",
    model: "",
    result: null
  }
};

const ORDER_STATUSES = [
  "Aguardando pagamento",
  "Pedido confirmado",
  "Aguardando repasse ao fornecedor",
  "Repassado ao fornecedor",
  "Despachado pelo parceiro",
  "Entregue",
  "Cancelado"
];

const FULFILLMENT_STATUSES = [
  "Pagamento pendente",
  "A repassar ao fornecedor",
  "Repassado manualmente",
  "Fornecedor confirmou",
  "Despachado com rastreio",
  "Entregue ao cliente",
  "Operacao pausada"
];

const FULFILLMENT_LABELS = {
  dropshipping: "Dropshipping",
  hybrid: "Hibrido",
  own_stock: "Estoque proprio"
};

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
  adminElements.productSubmit = document.querySelector("[data-admin-product-submit]");
  adminElements.productSupplier = document.querySelector("[data-admin-product-supplier]");
  adminElements.categories = document.querySelector("[data-admin-categories]");
  adminElements.productSearch = document.querySelector("[data-admin-product-search]");
  adminElements.products = document.querySelector("[data-admin-products]");
  adminElements.supplierForm = document.querySelector("[data-admin-supplier-form]");
  adminElements.supplierSubmit = document.querySelector("[data-admin-supplier-submit]");
  adminElements.suppliers = document.querySelector("[data-admin-suppliers]");
  adminElements.orders = document.querySelector("[data-admin-orders]");
  adminElements.logout = document.querySelector("[data-admin-logout]");
  adminElements.aiForm = document.querySelector("[data-admin-ai-form]");
  adminElements.aiSubmit = document.querySelector("[data-admin-ai-submit]");
  adminElements.aiStatus = document.querySelector("[data-admin-ai-status]");
  adminElements.aiResult = document.querySelector("[data-admin-ai-result]");
  adminElements.aiActions = document.querySelector("[data-admin-ai-actions]");
}

function bindAdminEvents() {
  adminElements.authRoot.addEventListener("submit", handleAuthSubmit);
  adminElements.productForm.addEventListener("submit", handleProductSubmit);
  adminElements.supplierForm.addEventListener("submit", handleSupplierSubmit);
  adminElements.aiForm.addEventListener("submit", handleAiSubmit);
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
    clearSupplierForm();
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

  showFeedback("Entre com uma conta admin para liberar o painel de operacao da loja.", "info");
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
          <h2>Entrar no painel dropshipping da JL AXION</h2>
        </div>
      </div>

      <p>Use uma conta administrativa para cadastrar fornecedores, vincular SKUs externos e gerenciar pedidos sem estoque proprio.</p>

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
  renderSupplierOptions();
  renderAiPanel();
  renderProducts();
  renderSuppliers();
  renderOrders();
}

function renderAiPanel() {
  if (!adminElements.aiStatus || !adminElements.aiResult || !adminElements.aiActions) {
    return;
  }

  const isReady = Boolean(adminState.ai.enabled);
  adminElements.aiStatus.className = `admin-ai-status ${isReady ? "is-ready" : "is-pending"}`;
  adminElements.aiStatus.innerHTML = isReady
    ? `
      <strong>Gemini ativo</strong>
      <span>${escapeHtml(adminState.ai.model || "Modelo padrao")} pronto para gerar copy no painel.</span>
    `
    : `
      <strong>Gemini em configuracao</strong>
      <span>Adicione GEMINI_API_KEY na Railway ou no .env para liberar o copiloto da loja.</span>
    `;

  if (!adminState.ai.result) {
    adminElements.aiResult.className = "admin-ai-result admin-ai-result--empty";
    adminElements.aiResult.innerHTML = `
      <strong>Copiloto pronto</strong>
      <p>Use o formulario ao lado para gerar textos comerciais da JL AXION com foco em conversao, clareza e linguagem de varejo tech.</p>
    `;
    adminElements.aiActions.hidden = true;
    return;
  }

  const result = adminState.ai.result;
  const bulletItems = result.bullets.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  const fullText = [
    `Headline: ${result.headline}`,
    `Subheadline: ${result.subheadline}`,
    `Descricao curta: ${result.shortDescription}`,
    `Bullets:`,
    ...result.bullets.map((item) => `- ${item}`),
    `Badge: ${result.badge}`,
    `CTA: ${result.cta}`,
    `Notas admin: ${result.adminNotes}`
  ].join("\n");

  adminElements.aiResult.className = "admin-ai-result";
  adminElements.aiResult.dataset.copyPayload = fullText;
  adminElements.aiResult.innerHTML = `
    <div class="admin-ai-block">
      <span class="eyebrow">Headline</span>
      <strong>${escapeHtml(result.headline)}</strong>
      <p>${escapeHtml(result.subheadline)}</p>
    </div>
    <div class="admin-ai-block">
      <span class="eyebrow">Descricao curta</span>
      <p>${escapeHtml(result.shortDescription)}</p>
    </div>
    <div class="admin-ai-block">
      <span class="eyebrow">Bullets</span>
      <ul class="feature-list compact-list admin-ai-list">${bulletItems}</ul>
    </div>
    <div class="admin-ai-metrics">
      <article class="micro-card">
        <strong>${escapeHtml(result.badge || "Sem selo")}</strong>
        <span>Badge sugerido</span>
      </article>
      <article class="micro-card">
        <strong>${escapeHtml(result.cta || "Sem CTA")}</strong>
        <span>CTA sugerido</span>
      </article>
    </div>
    <div class="summary-note">${escapeHtml(result.adminNotes || "Sem observacoes extras.")}</div>
  `;
  adminElements.aiActions.hidden = false;
}

function renderStats() {
  const cards = [
    {
      label: "Produtos",
      value: adminState.stats.products,
      detail: `${adminState.stats.dropshippingProducts || 0} prontos para dropshipping`
    },
    {
      label: "Fornecedores",
      value: adminState.stats.suppliers || 0,
      detail: "Base ativa para repasse manual."
    },
    {
      label: "Repasses",
      value: adminState.stats.pendingTransfers || 0,
      detail: "Pedidos que pedem acao do operador."
    },
    {
      label: "Pedidos",
      value: adminState.stats.orders,
      detail: "Fluxo comercial monitorado no painel."
    },
    {
      label: "Categorias",
      value: adminState.stats.categories,
      detail: "Departamentos ativos na vitrine."
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

function renderSupplierOptions() {
  const currentValue = adminElements.productSupplier.value;
  const options = [
    `<option value="">Selecione um fornecedor</option>`,
    ...adminState.suppliers.map((supplier) => `
      <option value="${escapeAttribute(supplier.id)}">
        ${escapeHtml(supplier.name)}${supplier.active ? "" : " (inativo)"}
      </option>
    `)
  ];

  adminElements.productSupplier.innerHTML = options.join("");
  adminElements.productSupplier.value = adminState.suppliers.some((supplier) => supplier.id === currentValue)
    ? currentValue
    : "";
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
      product.id,
      product.supplierName,
      product.supplierSku
    ].some((value) => String(value || "").toLowerCase().includes(searchTerm));
  });

  if (!filteredProducts.length) {
    adminElements.products.innerHTML = `
      <tr>
        <td colspan="6" class="admin-empty-cell">
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
        <div class="admin-op-stack">
          <span class="${getToneClass(product.fulfillmentMode === "dropshipping" ? "success" : "warning")}">
            ${escapeHtml(getFulfillmentLabel(product.fulfillmentMode))}
          </span>
          <small>${escapeHtml(product.supplierSku || "SKU externo nao definido")}</small>
        </div>
      </td>

      <td>
        <div class="admin-price">
          <strong>${formatCurrency(product.price)}</strong>
          <small>
            custo ${formatCurrency(product.supplierCost || 0)}
            ${product.oldPrice ? ` | de ${formatCurrency(product.oldPrice)}` : ""}
          </small>
        </div>
      </td>

      <td>
        <div class="admin-op-stack">
          <strong>${escapeHtml(product.supplierName || "Sem fornecedor")}</strong>
          <small>${product.supplierEtaDays ? `${product.supplierEtaDays} dias parceiro` : "prazo nao definido"}</small>
        </div>
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

function renderSuppliers() {
  if (!adminState.suppliers.length) {
    adminElements.suppliers.innerHTML = `<div class="admin-empty">Cadastre o primeiro fornecedor para liberar a operacao de dropshipping.</div>`;
    return;
  }

  adminElements.suppliers.innerHTML = adminState.suppliers.map((supplier) => {
    const linkedProducts = adminState.products.filter((product) => product.supplierId === supplier.id).length;

    return `
      <article class="admin-supplier-card">
        <div class="admin-supplier-card__top">
          <div class="stack-gap">
            <strong>${escapeHtml(supplier.name)}</strong>
            <span>${escapeHtml(supplier.contactName || "Contato nao definido")}</span>
          </div>

          <span class="${getToneClass(supplier.active ? "success" : "warning")}">
            ${supplier.active ? "Ativo" : "Inativo"}
          </span>
        </div>

        <div class="admin-supplier-card__meta">
          <span>${escapeHtml(supplier.orderChannel)}</span>
          <span>${formatLeadTime(supplier.leadTimeMin, supplier.leadTimeMax)}</span>
          <span>${linkedProducts} ${linkedProducts === 1 ? "produto" : "produtos"}</span>
        </div>

        <div class="summary-note">
          ${escapeHtml(supplier.notes || "Sem observacoes internas.")}
        </div>

        <div class="admin-supplier-card__footer">
          <div class="stack-gap">
            <small>${escapeHtml(supplier.email || "Sem e-mail")}</small>
            <small>${escapeHtml(supplier.phone || "Sem telefone")}</small>
          </div>

          <div class="admin-table__actions">
            <button type="button" class="secondary-btn" data-admin-action="edit-supplier" data-supplier-id="${escapeAttribute(supplier.id)}">
              Editar
            </button>
            <button type="button" class="ghost-btn" data-admin-action="delete-supplier" data-supplier-id="${escapeAttribute(supplier.id)}">
              Excluir
            </button>
          </div>
        </div>
      </article>
    `;
  }).join("");
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
          <span>Modo</span>
          <strong>${escapeHtml(getFulfillmentLabel(order.fulfillmentMode))}</strong>
        </div>
        <div>
          <span>Fornecedor</span>
          <strong>${escapeHtml(order.supplierName || "Operacao propria")}</strong>
        </div>
      </div>

      <div class="summary-note">${escapeHtml(order.summary || "Resumo indisponivel.")}</div>

      <div class="admin-order-items">
        ${(order.items || []).map((item) => `
          <div class="admin-order-item">
            <div>
              <strong>${escapeHtml(item.name)}</strong>
              <span>${escapeHtml(item.quantity)} x ${formatCurrency(item.price)}</span>
            </div>
            <div>
              <strong>${escapeHtml(item.supplierName || "Sem parceiro")}</strong>
              <span>${escapeHtml(item.supplierSku || "SKU nao definido")}</span>
            </div>
          </div>
        `).join("")}
      </div>

      <div class="admin-order-fields">
        <label class="field">
          <span>Status comercial</span>
          <select class="input" data-admin-order-status="${escapeAttribute(order.id)}">
            ${ORDER_STATUSES.map((status) => `
              <option value="${escapeAttribute(status)}" ${order.status === status ? "selected" : ""}>
                ${escapeHtml(status)}
              </option>
            `).join("")}
          </select>
        </label>

        <label class="field">
          <span>Status operacional</span>
          <select class="input" data-admin-order-fulfillment-status="${escapeAttribute(order.id)}">
            ${FULFILLMENT_STATUSES.map((status) => `
              <option value="${escapeAttribute(status)}" ${order.fulfillmentStatus === status ? "selected" : ""}>
                ${escapeHtml(status)}
              </option>
            `).join("")}
          </select>
        </label>

        <label class="field">
          <span>Codigo de rastreio</span>
          <input class="input" type="text" value="${escapeAttribute(order.trackingCode || "")}" data-admin-order-tracking="${escapeAttribute(order.id)}" placeholder="BR123456789">
        </label>

        <label class="field">
          <span>Referencia do fornecedor</span>
          <input class="input" type="text" value="${escapeAttribute(order.supplierReference || "")}" data-admin-order-reference="${escapeAttribute(order.id)}" placeholder="Pedido no parceiro">
        </label>

        <label class="field field--full">
          <span>Observacoes internas</span>
          <textarea class="input admin-textarea admin-textarea--compact" data-admin-order-notes="${escapeAttribute(order.id)}" placeholder="Anotacoes internas para acompanhar a operacao.">${escapeHtml(order.internalNotes || "")}</textarea>
        </label>
      </div>

      <div class="admin-order-card__actions">
        <button type="button" class="primary-btn" data-admin-action="update-order" data-order-id="${escapeAttribute(order.id)}">
          Salvar operacao
        </button>
        <button type="button" class="secondary-btn" data-admin-action="copy-transfer" data-order-id="${escapeAttribute(order.id)}">
          Copiar resumo para repasse
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
    clearSupplierForm();
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
    description: String(formData.get("description") || "").trim(),
    fulfillmentMode: String(formData.get("fulfillmentMode") || "dropshipping").trim(),
    supplierId: String(formData.get("supplierId") || "").trim(),
    supplierSku: String(formData.get("supplierSku") || "").trim(),
    supplierCost: String(formData.get("supplierCost") || "").trim(),
    supplierEtaDays: String(formData.get("supplierEtaDays") || "").trim(),
    supplierUrl: String(formData.get("supplierUrl") || "").trim(),
    procurementNotes: String(formData.get("procurementNotes") || "").trim()
  };

  const endpoint = currentId
    ? `/api/admin/products/${encodeURIComponent(currentId)}`
    : "/api/admin/products";

  const method = currentId ? "PUT" : "POST";

  if (!payload.name || !payload.category || !payload.price) {
    showFeedback("Preencha nome, categoria e preco antes de salvar o produto.", "warning");
    return;
  }

  if (payload.fulfillmentMode !== "own_stock" && !payload.supplierId) {
    showFeedback("Selecione um fornecedor para operar este item em dropshipping ou no modo hibrido.", "warning");
    return;
  }

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

async function handleSupplierSubmit(event) {
  event.preventDefault();

  const formData = new FormData(adminElements.supplierForm);
  const currentId = String(formData.get("currentId") || "").trim();
  const payload = {
    name: String(formData.get("name") || "").trim(),
    contactName: String(formData.get("contactName") || "").trim(),
    email: String(formData.get("email") || "").trim(),
    phone: String(formData.get("phone") || "").trim(),
    leadTimeMin: String(formData.get("leadTimeMin") || "").trim(),
    leadTimeMax: String(formData.get("leadTimeMax") || "").trim(),
    orderChannel: String(formData.get("orderChannel") || "").trim(),
    website: String(formData.get("website") || "").trim(),
    notes: String(formData.get("notes") || "").trim(),
    active: adminElements.supplierForm.elements.active.checked
  };

  const endpoint = currentId
    ? `/api/admin/suppliers/${encodeURIComponent(currentId)}`
    : "/api/admin/suppliers";

  const method = currentId ? "PUT" : "POST";

  if (!payload.name) {
    showFeedback("Informe pelo menos o nome do fornecedor para salvar a base.", "warning");
    return;
  }

  if (payload.leadTimeMax && payload.leadTimeMin && Number(payload.leadTimeMax) < Number(payload.leadTimeMin)) {
    const currentMax = payload.leadTimeMax;
    payload.leadTimeMax = payload.leadTimeMin;
    payload.leadTimeMin = currentMax;
  }

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
    clearSupplierForm();
    showFeedback(response.message || "Fornecedor salvo no painel.", "success");
  } catch (error) {
    showFeedback(error.message || "Nao foi possivel salvar o fornecedor.", "warning");
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

  const { adminAction, productId, supplierId, orderId } = actionTarget.dataset;

  if (adminAction === "clear-product-form") {
    clearProductForm();
    return;
  }

  if (adminAction === "clear-supplier-form") {
    clearSupplierForm();
    return;
  }

  if (adminAction === "copy-ai-result") {
    await copyAiResult();
    return;
  }

  if (adminAction === "apply-ai-to-product") {
    applyAiResultToProductForm();
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

  if (adminAction === "edit-supplier") {
    const supplier = adminState.suppliers.find((item) => item.id === supplierId);

    if (supplier) {
      fillSupplierForm(supplier);
      showFeedback(`Editando ${supplier.name}.`, "info");
    }

    return;
  }

  if (adminAction === "delete-supplier") {
    await deleteSupplier(supplierId);
    return;
  }

  if (adminAction === "update-order") {
    await updateOrderStatus(orderId);
    return;
  }

  if (adminAction === "copy-transfer") {
    await copyTransferSummary(orderId);
  }
}

async function handleAiSubmit(event) {
  const form = event.target.closest("[data-admin-ai-form]");

  if (!form) {
    return;
  }

  event.preventDefault();

  const formData = new FormData(form);
  const payload = Object.fromEntries(formData.entries());

  setFormLoading(adminElements.aiSubmit, true, "Gerando...");

  try {
    const response = await apiRequest("/api/admin/ai/generate-copy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    adminState.ai.result = response.result || null;
    renderAiPanel();
    showFeedback(response.message || "Copy gerada com Gemini.", "success");
  } catch (error) {
    showFeedback(error.message || "Nao foi possivel gerar copy com Gemini.", "warning");
  } finally {
    setFormLoading(adminElements.aiSubmit, false);
  }
}

async function copyAiResult() {
  if (!adminState.ai.result) {
    showFeedback("Gere uma copy antes de copiar o resultado.", "warning");
    return;
  }

  const payload = adminElements.aiResult?.dataset.copyPayload || "";

  try {
    await navigator.clipboard.writeText(payload);
    showFeedback("Resultado da IA copiado para a area de transferencia.", "success");
  } catch (_error) {
    showFeedback("Nao foi possivel copiar automaticamente. Tente novamente.", "warning");
  }
}

function applyAiResultToProductForm() {
  if (!adminState.ai.result) {
    showFeedback("Gere uma copy antes de aplicar no cadastro do produto.", "warning");
    return;
  }

  const { headline, shortDescription, badge } = adminState.ai.result;
  const nameField = adminElements.productForm.elements.namedItem("name");
  const descriptionField = adminElements.productForm.elements.namedItem("description");
  const badgeField = adminElements.productForm.elements.namedItem("badge");

  if (nameField && !String(nameField.value || "").trim()) {
    nameField.value = headline;
  }

  if (descriptionField) {
    descriptionField.value = shortDescription;
  }

  if (badgeField && badge) {
    badgeField.value = badge;
  }

  showFeedback("Resultado da IA aplicado no formulario do produto.", "success");
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

async function deleteSupplier(supplierId) {
  const supplier = adminState.suppliers.find((item) => item.id === supplierId);

  if (!supplier) {
    return;
  }

  const confirmed = window.confirm(`Remover "${supplier.name}" da base de fornecedores?`);

  if (!confirmed) {
    return;
  }

  try {
    const response = await apiRequest(`/api/admin/suppliers/${encodeURIComponent(supplierId)}`, {
      method: "DELETE"
    });

    applyAdminPayload(response);
    renderAdminData();

    if (adminElements.supplierForm.elements.currentId.value === supplierId) {
      clearSupplierForm();
    }

    showFeedback(response.message || "Fornecedor removido.", "success");
  } catch (error) {
    showFeedback(error.message || "Nao foi possivel remover o fornecedor.", "warning");
  }
}

async function updateOrderStatus(orderId) {
  const status = readOrderField(`[data-admin-order-status="${orderId}"]`);
  const fulfillmentStatus = readOrderField(`[data-admin-order-fulfillment-status="${orderId}"]`);
  const trackingCode = readOrderField(`[data-admin-order-tracking="${orderId}"]`);
  const supplierReference = readOrderField(`[data-admin-order-reference="${orderId}"]`);
  const internalNotes = readOrderField(`[data-admin-order-notes="${orderId}"]`);

  try {
    const response = await apiRequest(`/api/admin/orders/${encodeURIComponent(orderId)}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        status,
        fulfillmentStatus,
        trackingCode,
        supplierReference,
        internalNotes
      })
    });

    applyAdminPayload(response);
    renderOrders();
    showFeedback(response.message || "Pedido atualizado.", "success");
  } catch (error) {
    showFeedback(error.message || "Nao foi possivel atualizar o pedido.", "warning");
  }
}

async function copyTransferSummary(orderId) {
  const order = adminState.orders.find((item) => item.id === orderId);

  if (!order) {
    return;
  }

  const summary = buildTransferSummary(order);

  try {
    await navigator.clipboard.writeText(summary);
    showFeedback(`Resumo do pedido ${order.id} copiado para repasse manual.`, "success");
  } catch (error) {
    showFeedback("Nao foi possivel copiar automaticamente. Tente novamente.", "warning");
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
    adminState.suppliers = [];
    adminState.orders = [];
    adminState.stats = {
      products: 0,
      categories: 0,
      orders: 0,
      revenue: 0,
      suppliers: 0,
      dropshippingProducts: 0,
      pendingTransfers: 0
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
  adminElements.productForm.elements.fulfillmentMode.value = product.fulfillmentMode || "dropshipping";
  adminElements.productForm.elements.supplierId.value = product.supplierId || "";
  adminElements.productForm.elements.supplierSku.value = product.supplierSku || "";
  adminElements.productForm.elements.supplierCost.value = product.supplierCost || "";
  adminElements.productForm.elements.supplierEtaDays.value = product.supplierEtaDays || "";
  adminElements.productForm.elements.supplierUrl.value = product.supplierUrl || "";
  adminElements.productForm.elements.procurementNotes.value = product.procurementNotes || "";
  adminElements.productSubmit.textContent = "Atualizar produto";
  adminElements.productForm.scrollIntoView({ behavior: "smooth", block: "start" });
}

function clearProductForm() {
  adminElements.productForm.reset();
  adminElements.productForm.elements.currentId.value = "";
  adminElements.productForm.elements.fulfillmentMode.value = "dropshipping";
  adminElements.productForm.elements.supplierId.value = "";
  adminElements.productSubmit.textContent = "Salvar produto";
}

function fillSupplierForm(supplier) {
  adminElements.supplierForm.elements.currentId.value = supplier.id;
  adminElements.supplierForm.elements.name.value = supplier.name;
  adminElements.supplierForm.elements.contactName.value = supplier.contactName || "";
  adminElements.supplierForm.elements.email.value = supplier.email || "";
  adminElements.supplierForm.elements.phone.value = supplier.phone || "";
  adminElements.supplierForm.elements.leadTimeMin.value = supplier.leadTimeMin || "";
  adminElements.supplierForm.elements.leadTimeMax.value = supplier.leadTimeMax || "";
  adminElements.supplierForm.elements.orderChannel.value = supplier.orderChannel || "";
  adminElements.supplierForm.elements.website.value = supplier.website || "";
  adminElements.supplierForm.elements.notes.value = supplier.notes || "";
  adminElements.supplierForm.elements.active.checked = Boolean(supplier.active);
  adminElements.supplierSubmit.textContent = "Atualizar fornecedor";
  adminElements.supplierForm.scrollIntoView({ behavior: "smooth", block: "start" });
}

function clearSupplierForm() {
  adminElements.supplierForm.reset();
  adminElements.supplierForm.elements.currentId.value = "";
  adminElements.supplierForm.elements.active.checked = true;
  adminElements.supplierSubmit.textContent = "Salvar fornecedor";
}

function applyAdminPayload(payload = {}) {
  if (!payload || typeof payload !== "object") {
    return;
  }

  if (payload.user) {
    adminState.user = payload.user;
  }

  if (Array.isArray(payload.products)) {
    adminState.products = [...payload.products].sort((left, right) => compareText(left.name, right.name));
  } else if (payload.product && payload.product.id) {
    adminState.products = upsertById(adminState.products, payload.product).sort((left, right) => compareText(left.name, right.name));
  }

  if (Array.isArray(payload.categories)) {
    adminState.categories = [...new Set(payload.categories.filter(Boolean))]
      .sort(compareText);
  } else if (adminState.products.length) {
    adminState.categories = [...new Set(adminState.products.map((product) => product.category).filter(Boolean))]
      .sort(compareText);
  }

  if (Array.isArray(payload.suppliers)) {
    adminState.suppliers = [...payload.suppliers].sort(sortSuppliers);
  } else if (payload.supplier && payload.supplier.id) {
    adminState.suppliers = upsertById(adminState.suppliers, payload.supplier).sort(sortSuppliers);
  }

  if (Array.isArray(payload.orders)) {
    adminState.orders = [...payload.orders];
  } else if (payload.order && payload.order.id) {
    adminState.orders = upsertById(adminState.orders, payload.order);
  }

  if (payload.stats && typeof payload.stats === "object") {
    adminState.stats = {
      ...adminState.stats,
      ...payload.stats
    };
  }

  if (payload.features?.ai && typeof payload.features.ai === "object") {
    adminState.ai = {
      ...adminState.ai,
      ...payload.features.ai
    };
  }
}

function upsertById(collection, item) {
  const items = Array.isArray(collection) ? [...collection] : [];
  const index = items.findIndex((entry) => entry.id === item.id);

  if (index >= 0) {
    items[index] = {
      ...items[index],
      ...item
    };
  } else {
    items.push(item);
  }

  return items;
}

function compareText(left, right) {
  return String(left || "").localeCompare(String(right || ""), "pt-BR", {
    sensitivity: "base"
  });
}

function sortSuppliers(left, right) {
  return Number(Boolean(right.active)) - Number(Boolean(left.active))
    || compareText(left.name, right.name);
}

function readOrderField(selector) {
  const field = document.querySelector(selector);
  return field ? String(field.value || "").trim() : "";
}

function buildTransferSummary(order) {
  const items = Array.isArray(order.items) ? order.items : [];
  const customerLabel = order.customerName || "Cliente JL AXION";
  const addressParts = [
    order.customerAddress,
    order.customerCity,
    order.customerZip
  ].filter(Boolean);

  const lines = [
    "JL AXION | Repasse manual dropshipping",
    `Pedido: ${order.id}`,
    `Cliente: ${customerLabel}`,
    `Contato: ${order.customerEmail || "sem email"}${order.customerPhone ? ` | ${order.customerPhone}` : ""}`,
    `Entrega: ${addressParts.length ? addressParts.join(" | ") : order.delivery || "nao informada"}`,
    `Pagamento: ${order.payment || "nao informado"}`,
    `Operacao: ${getFulfillmentLabel(order.fulfillmentMode)}`,
    `Fornecedor principal: ${order.supplierName || "a definir"}`,
    "",
    "Itens"
  ];

  items.forEach((item, index) => {
    lines.push(
      `${index + 1}. ${item.name}`,
      `   Quantidade: ${item.quantity}`,
      `   Valor venda: ${formatCurrency(item.price)}`,
      `   Fornecedor: ${item.supplierName || "nao definido"}`,
      `   SKU parceiro: ${item.supplierSku || "nao definido"}`,
      `   Custo parceiro: ${formatCurrency(item.supplierCost || 0)}`
    );
  });

  if (order.supplierReference) {
    lines.push("", `Referencia do parceiro: ${order.supplierReference}`);
  }

  if (order.trackingCode) {
    lines.push(`Rastreio: ${order.trackingCode}`);
  }

  if (order.internalNotes) {
    lines.push("", `Observacoes internas: ${order.internalNotes}`);
  }

  return lines.join("\n");
}

function getFulfillmentLabel(mode) {
  return FULFILLMENT_LABELS[mode] || "Operacao personalizada";
}

function formatLeadTime(minDays, maxDays) {
  const min = Number(minDays || 0);
  const max = Number(maxDays || 0);

  if (!min && !max) {
    return "Prazo a combinar";
  }

  if (min && max && min !== max) {
    return `${min} a ${Math.max(min, max)} dias uteis`;
  }

  return `${Math.max(min, max)} dias uteis`;
}

let feedbackTimerId = 0;

function showFeedback(message, tone = "info") {
  if (!message) {
    adminElements.feedback.hidden = true;
    adminElements.feedback.textContent = "";
    adminElements.feedback.className = "summary-note admin-feedback";
    return;
  }

  adminElements.feedback.hidden = false;
  adminElements.feedback.textContent = message;
  adminElements.feedback.className = `summary-note admin-feedback admin-feedback--${tone}`;

  window.clearTimeout(feedbackTimerId);
  feedbackTimerId = window.setTimeout(() => {
    adminElements.feedback.hidden = true;
  }, 7000);
}

function getToneClass(tone = "info") {
  return `admin-tone admin-tone--${tone}`;
}

function formatCurrency(value) {
  return currencyFormatter.format(Number(value || 0));
}

async function apiRequest(url, options = {}) {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 10000);

  const nextOptions = {
    method: options.method || "GET",
    credentials: "same-origin",
    signal: controller.signal,
    headers: {
      ...(options.headers || {})
    }
  };

  if (options.body !== undefined) {
    nextOptions.body = typeof options.body === "string"
      ? options.body
      : JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, nextOptions);
    const contentType = response.headers.get("content-type") || "";
    const payload = contentType.includes("application/json")
      ? await response.json()
      : await response.text();

    if (!response.ok) {
      const error = new Error(
        typeof payload === "string"
          ? payload
          : payload.message || "Nao foi possivel concluir a requisicao."
      );
      error.status = response.status;
      error.payload = payload;
      throw error;
    }

    return payload;
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("A requisicao demorou demais. Tente novamente.");
    }

    throw error;
  } finally {
    window.clearTimeout(timeoutId);
  }
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replace(/`/g, "&#96;");
}

function setFormLoading(button, isLoading, loadingText = "Salvando...") {
  if (!button) {
    return;
  }

  if (!button.dataset.originalText) {
    button.dataset.originalText = button.textContent;
  }

  button.disabled = isLoading;
  button.textContent = isLoading ? loadingText : button.dataset.originalText;
}
