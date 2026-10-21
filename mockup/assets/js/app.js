const FREE_SHIPPING_MIN = 150;
const CART_KEY = "beauteshi_cart";

const Cart = {
  read(){
    try{
      return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    }catch{
      return [];
    }
  },
  write(items){
    try{ localStorage.setItem(CART_KEY, JSON.stringify(items)); }catch{}
    updateCartCount();
  },
  add(id, qty = 1){
    const items = Cart.read();
    const line = items.find((i) => i.id === id);
    if(line) line.qty += qty;
    else items.push({ id, qty });
    Cart.write(items);
  },
  setQty(id, qty){
    const items = Cart.read()
      .map((i) => (i.id === id ? { ...i, qty } : i))
      .filter((i) => i.qty > 0);
    Cart.write(items);
  },
  remove(id){
    Cart.write(Cart.read().filter((i) => i.id !== id));
  },
  clear(){ Cart.write([]); },
  lines(){
    return Cart.read()
      .map((i) => ({ ...i, product: getProduct(i.id) }))
      .filter((l) => l.product);
  },
  count(){
    return Cart.read().reduce((n, i) => n + i.qty, 0);
  },
  replace(oldId, newId){
    const items = Cart.read();
    const from = items.find((i) => i.id === oldId);
    if(!from || oldId === newId) return;
    const into = items.find((i) => i.id === newId);
    if(into){
      into.qty += from.qty;
      Cart.write(items.filter((i) => i !== from));
    }else{
      from.id = newId;
      Cart.write(items);
    }
  },
};

const icon = (name, extra = "") =>
  `<i class="ti ti-${name}${extra ? " " + extra : ""}" aria-hidden="true"></i>`;

const ICONS = {
  bag: icon("shopping-bag"),
  menu: icon("menu-2"),
  trash: icon("trash"),
  check: icon("check"),
};

function renderHeader(active){
  const link = (href, label, key) =>
    `<a href="${href}"${active === key ? ' class="is-active" aria-current="page"' : ""}>${label}</a>`;
  document.getElementById("site-header").outerHTML = `
    <div class="announce">Free shipping for orders above RM${FREE_SHIPPING_MIN}</div>
    <header class="site-header">
      <div class="container site-header__row">
        <a class="brand" href="index.html" aria-label="Beauté Shi home">
          <img src="assets/img/logo.webp" alt="Beauté Shi — Secret of Beauté">
        </a>
        <nav class="nav" id="main-nav" aria-label="Main">
          ${link("index.html", "Home", "home")}
          ${link("index.html#products", "Shop", "shop")}
          ${link("index.html#combos", "Combos", "combos")}
          ${link("index.html#about", "About", "about")}
        </nav>
        <div class="header-actions">
          <a class="icon-btn" href="cart.html" aria-label="Cart">
            ${ICONS.bag}
            <span class="cart-count" data-cart-count hidden>0</span>
          </a>
          <button class="nav-toggle" type="button" aria-label="Open menu" aria-controls="main-nav" aria-expanded="false">${ICONS.menu}</button>
        </div>
      </div>
    </header>`;

  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("main-nav");
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  nav.addEventListener("click", (e) => {
    if(e.target.closest("a")) nav.classList.remove("is-open");
  });
  updateCartCount();
}

function renderFooter(){
  document.getElementById("site-footer").outerHTML = `
    <footer class="site-footer">
      <div class="container footer-grid">
        <div>
          <img src="assets/img/logo.webp" alt="Beauté Shi">
          <p>Beauty and wellness essentials for your everyday self-care routine.</p>
        </div>
        <div class="footer-col">
          <h4>Shop</h4>
          <ul>
            <li><a href="index.html#products">All products</a></li>
            <li><a href="index.html#combos">Combos</a></li>
            <li><a href="cart.html">Cart</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Help</h4>
          <ul>
            <li><a href="#">Shipping &amp; delivery</a></li>
            <li><a href="#">Returns</a></li>
            <li><a href="#">Privacy policy</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Contact</h4>
          <ul>
            <li><a href="#">${icon("brand-whatsapp")}WhatsApp us</a></li>
            <li><a href="#">${icon("brand-instagram")}Instagram</a></li>
            <li><a href="#">${icon("brand-tiktok")}TikTok</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">© 2026 Beauté Shi. All rights reserved.</div>
    </footer>`;
}

function updateCartCount(){
  const n = Cart.count();
  document.querySelectorAll("[data-cart-count]").forEach((el) => {
    el.textContent = n;
    el.hidden = n === 0;
  });
}

const MAX_SWATCHES = 4;

function productCard(listing, selectedId){
  const options = listing.options.map(getProduct);
  const p = getProduct(selectedId) || options[0];
  const pct = p.compareAt ? Math.round((1 - p.price / p.compareAt) * 100) : 0;
  const extra = options.length - MAX_SWATCHES;
  const swatches = options.length > 1 ? `
        <div class="swatches" role="group" aria-label="${options.length} options">
          ${options.slice(0, MAX_SWATCHES).map((o) => `
            <button class="swatch${o.id === p.id ? " is-active" : ""}" type="button" data-swatch="${o.id}"
              aria-pressed="${o.id === p.id}" aria-label="${o.name}" title="${o.name}">
              <img src="${o.images[0]}" alt="" loading="lazy">
            </button>`).join("")}
          ${extra > 0 ? `<a class="swatch swatch--more" href="product.html?id=${p.id}" aria-label="${extra} more options">+${extra}</a>` : ""}
        </div>` : "";
  return `
    <article class="product-card" data-listing="${listing.id}">
      <a class="product-card__media" href="product.html?id=${p.id}">
        <img src="${p.images[0]}" alt="${p.name}" loading="lazy">
        ${pct ? `<span class="product-card__badge">-${pct}%</span>` : ""}
      </a>
      <div class="product-card__body">
        <span class="product-card__cat">${CATEGORIES[p.category]}</span>
        <h3 class="product-card__name"><a href="product.html?id=${p.id}">${p.name}</a></h3>
        <div class="price">
          <span class="price__now">${formatRM(p.price)}</span>
          ${p.compareAt ? `<span class="price__was">${formatRM(p.compareAt)}</span>` : ""}
        </div>
        ${swatches}
        <button class="btn btn-outline btn-block product-card__cta" type="button" data-add="${p.id}">Add to cart</button>
      </div>
    </article>`;
}

function bindProductCards(root = document){
  root.addEventListener("click", (e) => {
    const swatch = e.target.closest("[data-swatch]");
    if(swatch){
      const card = swatch.closest(".product-card");
      const id = swatch.dataset.swatch;
      const tmp = document.createElement("div");
      tmp.innerHTML = productCard(getListing(id), id).trim();
      const next = tmp.firstElementChild;
      card.replaceWith(next);
      next.querySelector(`[data-swatch="${id}"]`).focus();
      return;
    }

    const btn = e.target.closest("[data-add]");
    if(!btn) return;
    Cart.add(btn.dataset.add, 1);
    const label = btn.textContent;
    btn.textContent = "Added";
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = label;
      btn.disabled = false;
    }, 1200);
  });
}


/* ---------- Shipping ---------- */
const EAST_MALAYSIA = ["Sabah", "Sarawak", "W.P. Labuan"];
const SHIPPING_RATES = { west: 8, east: 15 };

function shippingFor(state, subtotal){
  if(subtotal >= FREE_SHIPPING_MIN) return 0;
  if(!state) return null;
  return EAST_MALAYSIA.includes(state) ? SHIPPING_RATES.east : SHIPPING_RATES.west;
}

/* ---------- Coupons ---------- */
const COUPON_KEY = "beauteshi_promo";

const Coupon = {
  code(){
    try{ return sessionStorage.getItem(COUPON_KEY); }catch{ return null; }
  },
  current(subtotal){
    const c = COUPONS.find((x) => x.code === Coupon.code());
    return c && subtotal >= c.minSpend ? c : null;
  },
  set(code){ try{ sessionStorage.setItem(COUPON_KEY, code); }catch{} },
  clear(){ try{ sessionStorage.removeItem(COUPON_KEY); }catch{} },
  discount(c, subtotal){
    if(!c) return 0;
    return c.type === "percent" ? subtotal * (c.value / 100) : Math.min(c.value, subtotal);
  },
};

function orderTotals(shipping = null){
  const lines = Cart.lines();
  const subtotal = lines.reduce((s, l) => s + l.product.price * l.qty, 0);
  const original = lines.reduce((s, l) => s + (l.product.compareAt || l.product.price) * l.qty, 0);
  const coupon = Coupon.current(subtotal);
  const discount = Coupon.discount(coupon, subtotal);
  const total = subtotal - discount + (shipping || 0);
  return { lines, subtotal, original, coupon, discount, shipping, total, saved: original - subtotal + discount };
}

/* ---------- Bottom sheets ---------- */
const Sheets = {
  active: null,
  lastFocus: null,
  open(id, trigger){
    const sheet = document.getElementById(id);
    Sheets.active = sheet;
    Sheets.lastFocus = trigger || document.activeElement;
    sheet.classList.add("is-open");
    sheet.setAttribute("aria-hidden", "false");
    document.body.classList.add("sheet-open");
    const first = sheet.querySelector("input, select, textarea, button:not([data-close-sheet])") || sheet.querySelector("button");
    setTimeout(() => first && first.focus(), 50);
  },
  close(){
    const sheet = Sheets.active;
    if(!sheet) return;
    sheet.classList.remove("is-open");
    sheet.setAttribute("aria-hidden", "true");
    document.body.classList.remove("sheet-open");
    Sheets.active = null;
    if(Sheets.lastFocus) Sheets.lastFocus.focus();
  },
};

function sheetHTML(id, title, body, foot = ""){
  return `
    <div class="sheet" id="${id}" aria-hidden="true">
      <div class="sheet__backdrop" data-close-sheet></div>
      <div class="sheet__panel" role="dialog" aria-modal="true" aria-labelledby="${id}-title">
        <div class="sheet__header">
          <h2 id="${id}-title">${title}</h2>
          <button class="sheet__x" type="button" data-close-sheet aria-label="Close">${icon("x")}</button>
        </div>
        <div class="sheet__body">${body}</div>
        ${foot ? `<div class="sheet__foot">${foot}</div>` : ""}
      </div>
    </div>`;
}

document.addEventListener("click", (e) => {
  if(Sheets.active && e.target.closest("[data-close-sheet]") && Sheets.active.contains(e.target)) Sheets.close();
});
document.addEventListener("keydown", (e) => {
  const sheet = Sheets.active;
  if(!sheet) return;
  if(e.key === "Escape") Sheets.close();
  if(e.key === "Tab"){
    const f = [...sheet.querySelectorAll("button:not([disabled]), input:not([disabled]), select, textarea, a[href]")].filter((el) => el.offsetParent);
    if(!f.length) return;
    if(e.shiftKey && document.activeElement === f[0]){ e.preventDefault(); f[f.length - 1].focus(); }
    else if(!e.shiftKey && document.activeElement === f[f.length - 1]){ e.preventDefault(); f[0].focus(); }
  }
});

/* ---------- Coupon sheet (cart + checkout) ---------- */
function mountCouponSheet(onChange){
  document.body.insertAdjacentHTML("beforeend", sheetHTML("coupon-sheet", "Discount coupon", `
    <form class="coupon-form" id="coupon-form" novalidate>
      <label class="visually-hidden" for="coupon-input">Coupon code</label>
      <input id="coupon-input" type="text" placeholder="Enter coupon code" autocomplete="off" autocapitalize="characters">
      <button class="btn btn-primary" type="submit">Apply</button>
    </form>
    <p class="coupon-msg" id="coupon-msg" role="status"></p>
    <h3 class="sheet__subtitle">Available for you</h3>
    <ul class="coupon-list" id="coupon-list"></ul>`));

  const list = document.getElementById("coupon-list");
  const msg = document.getElementById("coupon-msg");

  function renderList(){
    const { subtotal } = orderTotals();
    const applied = Coupon.code();
    list.innerHTML = COUPONS.map((c) => {
      const short = c.minSpend - subtotal;
      const isApplied = applied === c.code && short <= 0;
      return `
        <li class="coupon${short > 0 ? " is-locked" : ""}${isApplied ? " is-applied" : ""}">
          <div class="coupon__value">${c.type === "percent" ? `${c.value}%` : `RM${c.value}`}<small>off</small></div>
          <div class="coupon__info">
            <strong>${c.code}</strong>
            <span>${c.label}</span>
            ${short > 0 ? `<span class="coupon__hint">Add ${formatRM(short)} more to use</span>` : ""}
          </div>
          ${isApplied
            ? `<button class="coupon__btn" type="button" data-coupon-remove>Remove</button>`
            : `<button class="coupon__btn" type="button" data-coupon-use="${c.code}" ${short > 0 ? "disabled" : ""}>Use</button>`}
        </li>`;
    }).join("");
  }

  function apply(code){
    const c = COUPONS.find((x) => x.code === code);
    const { subtotal } = orderTotals();
    msg.classList.remove("is-error");
    if(!c){
      msg.textContent = code ? `"${code}" isn't a valid code. Check the spelling and try again.` : "Enter a coupon code first.";
      msg.classList.add("is-error");
      return;
    }
    if(subtotal < c.minSpend){
      msg.textContent = `${c.code} needs a subtotal of ${formatRM(c.minSpend)}. Add ${formatRM(c.minSpend - subtotal)} more to use it.`;
      msg.classList.add("is-error");
      return;
    }
    Coupon.set(c.code);
    msg.textContent = "";
    document.getElementById("coupon-input").value = "";
    Sheets.close();
    onChange();
    showToast(`${c.code} applied`);
  }

  document.getElementById("coupon-form").addEventListener("submit", (e) => {
    e.preventDefault();
    apply(document.getElementById("coupon-input").value.trim().toUpperCase());
  });
  list.addEventListener("click", (e) => {
    const use = e.target.closest("[data-coupon-use]");
    if(use) return apply(use.dataset.couponUse);
    if(e.target.closest("[data-coupon-remove]")){
      Coupon.clear();
      renderList();
      onChange();
      showToast("Coupon removed");
    }
  });

  return {
    open(trigger){
      msg.textContent = "";
      renderList();
      Sheets.open("coupon-sheet", trigger);
    },
  };
}

function couponRowHTML(t){
  return `
    <button class="app-row" type="button" data-open-coupon>
      <span class="app-row__icon app-row__icon--accent">${icon("ticket")}</span>
      <span class="app-row__text">
        <strong>Discount coupon</strong>
        <span>${t.coupon ? `${t.coupon.code} applied` : "Enter a code or pick a coupon"}</span>
      </span>
      ${t.coupon ? `<span class="app-row__value is-saving">−${formatRM(t.discount)}</span>` : ""}
      ${icon("chevron-right", "app-row__chevron")}
    </button>`;
}

/* ---------- Toast ---------- */
let toastTimer;
function showToast(message){
  let t = document.getElementById("app-toast");
  if(!t){
    t = document.createElement("div");
    t.id = "app-toast";
    t.className = "toast";
    t.setAttribute("role", "status");
    t.setAttribute("aria-live", "polite");
    document.body.appendChild(t);
  }
  t.textContent = message;
  requestAnimationFrame(() => t.classList.add("is-visible"));
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("is-visible"), 2000);
}

function appBarHTML(title, backHref){
  return `
    <div class="app-bar" id="app-bar">
      <a class="app-bar__back" href="${backHref}" aria-label="Back" data-back>${icon("chevron-left")}</a>
      <h1>${title}</h1>
      <span class="app-bar__spacer" aria-hidden="true"></span>
    </div>`;
}

document.addEventListener("click", (e) => {
  const back = e.target.closest("[data-back]");
  if(back && document.referrer.startsWith(location.origin)){
    e.preventDefault();
    history.back();
  }
});
