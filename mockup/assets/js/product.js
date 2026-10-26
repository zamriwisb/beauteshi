renderHeader("shop");
renderFooter();

const params = new URLSearchParams(location.search);
const listing = getListing(getProduct(params.get("id")) ? params.get("id") : PRODUCTS[0].id);
const options = listing.options.map(getProduct);

const state = {
  selected: getProduct(params.get("id")) || options[0],
  qty: 1,
  mode: "cart",
  slide: 0,
};

const $ = (id) => document.getElementById(id);
const track = $("track");
const sheet = $("sheet");
let lastFocus = null;

function priceHTML(value){
  const [whole, cents] = value.toFixed(2).split(".");
  return `<small>RM</small>${whole}<small>.${cents}</small>`;
}

function starHTML(rating, reviews, sold){
  return `
    ${icon("star-filled", "pdp-star")}
    <strong>${rating.toFixed(1)}</strong>
    <span class="pdp-muted">(${reviews})</span>
    <span class="pdp-sep" aria-hidden="true"></span>
    <span>${sold} sold</span>`;
}

function galleryImages(){
  const imgs = [...state.selected.images];
  options.forEach((o) => o.images.forEach((src) => { if(!imgs.includes(src)) imgs.push(src); }));
  return imgs;
}

function tilesHTML(){
  return options.map((o) => {
    const active = o.id === state.selected.id;
    const badge = listing.badges?.[o.id];
    return `
      <button class="option-tile${active ? " is-active" : ""}" type="button" data-option="${o.id}" aria-pressed="${active}">
        <span class="option-tile__media"><img src="${o.images[0]}" alt=""></span>
        <span class="option-tile__name">${o.name}</span>
        ${badge ? `<span class="option-tile__badge">${badge}</span>` : ""}
      </button>`;
  }).join("");
}

function shipText(p){
  return p.price * state.qty >= FREE_SHIPPING_MIN ? "Free shipping" : `Free shipping on RM${FREE_SHIPPING_MIN}+`;
}

function renderGallery(){
  const imgs = galleryImages();
  track.innerHTML = imgs.map((src, i) =>
    `<div class="pdp-slide"><img src="${src}" alt="${state.selected.name}, image ${i + 1} of ${imgs.length}"${i ? ' loading="lazy"' : ""}></div>`
  ).join("");
  $("thumbs").innerHTML = imgs.length > 1 ? imgs.map((src, i) =>
    `<button class="pdp-thumb${i === 0 ? " is-active" : ""}" type="button" data-thumb="${i}" aria-label="Show image ${i + 1}"><img src="${src}" alt=""></button>`
  ).join("") : "";
  document.querySelectorAll(".pdp-arrow").forEach((b) => { b.hidden = imgs.length < 2; });
  track.scrollTo({ left: 0, behavior: "instant" });
  setSlide(0);
}

function setSlide(i){
  const total = track.children.length;
  state.slide = Math.max(0, Math.min(total - 1, i));
  $("counter").textContent = `${state.slide + 1}/${total}`;
  $("counter").hidden = total < 2;
  document.querySelectorAll(".pdp-thumb").forEach((t, n) => t.classList.toggle("is-active", n === state.slide));
}

function goToSlide(i){
  const slide = track.children[i];
  if(slide) track.scrollTo({ left: slide.offsetLeft, behavior: "smooth" });
}

function render(){
  const p = state.selected;
  const off = p.compareAt ? Math.round((1 - p.price / p.compareAt) * 100) : 0;

  document.title = `${p.name} — Beauté Shi`;
  $("crumb-cat").textContent = CATEGORIES[p.category];
  $("crumb-name").textContent = p.name;

  $("price").innerHTML = priceHTML(p.price);
  $("was").textContent = p.compareAt ? formatRM(p.compareAt) : "";
  $("off").textContent = off ? `-${off}%` : "";
  $("off").hidden = !off;

  const chips = [];
  if(p.compareAt) chips.push(`Save ${formatRM(p.compareAt - p.price)} vs buying separately`);
  chips.push(`Free shipping on RM${FREE_SHIPPING_MIN}+`);
  chips.push("GLOW10: 10% off your order");
  $("chips").innerHTML = chips.map((c) => `<span class="tt-chip">${c}</span>`).join("");

  $("title").textContent = listing.title;
  $("rating").innerHTML = starHTML(listing.rating, listing.reviews, listing.sold);
  $("rating-lg").innerHTML = starHTML(listing.rating, listing.reviews, listing.sold);

  const count = options.length;
  const hasOptions = count > 1;
  ["options-row", "inline-options-title", "inline-tiles", "sheet-options-title", "sheet-tiles"]
    .forEach((id) => { $(id).hidden = !hasOptions; });
  document.querySelectorAll(".pdp-buybox, .sheet__body").forEach((el) => el.classList.toggle("is-single", !hasOptions));
  if(hasOptions){
    $("options-row-thumbs").innerHTML = options.slice(0, 3).map((o) => `<img src="${o.images[0]}" alt="">`).join("");
    $("options-row-text").innerHTML = `<strong>${p.name}</strong><span>${count} options available</span>`;
    $("inline-options-title").textContent = `Options (${count})`;
    $("sheet-options-title").textContent = `Options (${count})`;
    $("inline-tiles").innerHTML = tilesHTML();
    $("sheet-tiles").innerHTML = tilesHTML();
  }

  $("sheet-thumb").src = p.images[0];
  $("sheet-price").innerHTML = priceHTML(p.price);
  $("sheet-selected").textContent = p.name;
  renderQty();

  $("ship-title").textContent = `Free shipping on orders above RM${FREE_SHIPPING_MIN}`;

  $("desc-body").innerHTML = `
    <p class="pdp-desc__lead">${p.tagline}</p>
    <p>${p.description}</p>
    ${p.includes ? `<p><strong>Includes:</strong> ${p.includes}</p>` : ""}
    <h3>How to use</h3>
    <ol>${p.howTo.map((s) => `<li>${s}</li>`).join("")}</ol>
    <h3>Delivery</h3>
    <ul>${DELIVERY_COPY.map((s) => `<li>${s}</li>`).join("")}</ul>`;

  // Suggestions use white-background photos only, matching the shop grid.
  const others = whiteCatalog().filter((l) => l.id !== listing.id);
  const sameCat = (l) => l.options.some((id) => getProduct(id).category === p.category);
  const related = others.filter(sameCat).concat(others.filter((l) => !sameCat(l))).slice(0, 4);
  $("related").innerHTML = related.map((l) => productCard(l)).join("");
}

function renderQty(){
  const p = state.selected;
  document.querySelectorAll("[data-qty-value]").forEach((o) => { o.textContent = state.qty; });
  document.querySelectorAll('[data-qty-step="-1"]').forEach((b) => { b.disabled = state.qty <= 1; });
  $("sheet-ship").textContent = shipText(p);
  const free = p.price * state.qty >= FREE_SHIPPING_MIN;
  $("bar-sub").innerHTML = formatRM(p.price * state.qty) +
    (free ? `<span class="tt-bar__div" aria-hidden="true"></span>Free shipping` : "");
}

function selectOption(id){
  const next = getProduct(id);
  if(!next || next.id === state.selected.id) return;
  state.selected = next;
  history.replaceState(null, "", `?id=${next.id}`);
  const fromTile = document.activeElement?.closest("[data-option]");
  const scope = fromTile?.closest(".option-tiles")?.id;
  render();
  renderGallery();
  if(scope) $(scope).querySelector(`[data-option="${next.id}"]`).focus();
}

function openSheet(mode, trigger){
  state.mode = mode;
  $("sheet-confirm").textContent = mode === "buy" ? "Buy now" : "Add to cart";
  lastFocus = trigger || document.activeElement;
  sheet.classList.add("is-open");
  sheet.setAttribute("aria-hidden", "false");
  document.body.classList.add("sheet-open");
  sheet.querySelector(".sheet__close").focus();
}

function closeSheet(){
  sheet.classList.remove("is-open");
  sheet.setAttribute("aria-hidden", "true");
  document.body.classList.remove("sheet-open");
  if(lastFocus) lastFocus.focus();
}

function commit(mode){
  Cart.add(state.selected.id, state.qty);
  if(mode === "buy"){
    location.href = pageUrl("checkout.html");
    return;
  }
  closeSheet();
  showToast(`Added ${state.qty} × ${state.selected.name} to cart`);
  state.qty = 1;
  renderQty();
}

/* ---------- events ---------- */
document.addEventListener("click", (e) => {
  const opt = e.target.closest("[data-option]");
  if(opt) return selectOption(opt.dataset.option);

  const step = e.target.closest("[data-qty-step]");
  if(step){
    state.qty = Math.max(1, Math.min(99, state.qty + Number(step.dataset.qtyStep)));
    return renderQty();
  }

  const open = e.target.closest("[data-open-sheet]");
  if(open) return openSheet(open.dataset.openSheet, open);

  if(e.target.closest("[data-close-sheet]")) return closeSheet();

  const action = e.target.closest("[data-action]");
  if(action) return commit(action.dataset.action);

  const thumb = e.target.closest("[data-thumb]");
  if(thumb) return goToSlide(Number(thumb.dataset.thumb));

  const arrow = e.target.closest("[data-slide]");
  if(arrow) return goToSlide(state.slide + Number(arrow.dataset.slide));
});

$("sheet-confirm").addEventListener("click", () => commit(state.mode));

document.addEventListener("keydown", (e) => {
  if(!sheet.classList.contains("is-open")) return;
  if(e.key === "Escape") closeSheet();
  if(e.key === "Tab"){
    const focusables = [...sheet.querySelectorAll("button:not([disabled])")];
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if(e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
    else if(!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
  }
});

track.addEventListener("scroll", () => {
  setSlide(Math.round(track.scrollLeft / track.clientWidth));
}, { passive: true });

track.addEventListener("keydown", (e) => {
  if(e.key === "ArrowRight"){ e.preventDefault(); goToSlide(state.slide + 1); }
  if(e.key === "ArrowLeft"){ e.preventDefault(); goToSlide(state.slide - 1); }
});

$("see-more").addEventListener("click", (e) => {
  const body = $("desc-body");
  const expanded = body.classList.toggle("is-clamped") === false;
  e.currentTarget.textContent = expanded ? "See less" : "See more";
  e.currentTarget.setAttribute("aria-expanded", String(expanded));
});

$("wish-btn").addEventListener("click", (e) => {
  const on = e.currentTarget.getAttribute("aria-pressed") !== "true";
  e.currentTarget.setAttribute("aria-pressed", String(on));
  e.currentTarget.querySelector(".ti").className = `ti ti-${on ? "bookmark-filled" : "bookmark"}`;
  showToast(on ? "Saved to wishlist" : "Removed from wishlist");
});

$("share-btn").addEventListener("click", async () => {
  const data = { title: document.title, url: location.href };
  if(navigator.share){
    try{ await navigator.share(data); }catch{}
    return;
  }
  try{
    await navigator.clipboard.writeText(location.href);
    showToast("Link copied");
  }catch{
    showToast("Copy the link from your address bar to share");
  }
});

$("back-btn").addEventListener("click", (e) => {
  if(document.referrer.startsWith(location.origin)){
    e.preventDefault();
    history.back();
  }
});

bindProductCards($("related"));
render();
renderGallery();
