renderHeader("home");
renderFooter();

const REVIEW_PHOTOS = [
  "01M3KDBWNSPS9FWZEERW5C9XSD.jpg",
  "01M3KDBXEPQ0X3CGXEE3P42FBX.jpg",
  "01M3KDBXYYZNA8PHKKMM6H5QK0.jpg",
  "01M3KDBYFNVWNEV5KEAXV6JPY5.jpg",
  "01M3KDBZMH09B2ZHA454TW0XG0.jpg",
  "01M3KDBZ0W32KKS1ZAD3XVY8EX.jpg",
].map((f) => CDN + f);

// Sticker per product. "Best seller" mirrors the 1K+ sold on TikTok; "New" matches the Berry Scrub banner.
function stickerFor(p){
  if(p.id === "berry-serum") return `<span class="c-sticker">Best seller</span>`;
  if(p.id === "berry-scrub") return `<span class="c-sticker c-sticker--new">New</span>`;
  if(p.compareAt) return `<span class="c-sticker c-sticker--save">Save ${formatRM(p.compareAt - p.price)}</span>`;
  return "";
}

function photoHTML(p, href){
  return `
    <a class="c-card__photo" href="${href}">
      ${stickerFor(p)}
      <span class="c-card__frame">
        <img src="${p.images[0]}" alt="${p.name}" loading="lazy">
        ${icon("heart-filled")}
      </span>
    </a>`;
}

function priceHTML(p){
  return `
    <div class="c-price">
      <strong>${formatRM(p.price)}</strong>
      ${p.compareAt ? `<s>${formatRM(p.compareAt)}</s>` : ""}
    </div>`;
}

function addHTML(p){
  return `
    <div class="c-card__add">
      <button class="c-btn c-btn--berry" type="button" data-add="${p.id}">${icon("shopping-bag-plus")}Add to cart</button>
    </div>`;
}

function cardHTML(listing, selectedId){
  const options = listing.options.map(getProduct);
  const p = getProduct(selectedId) || options[0];
  const href = `product.html?id=${p.id}`;
  return `
    <article class="c-card" data-listing="${listing.id}">
      ${photoHTML(p, href)}
      <div class="c-card__body">
        <h3 class="c-card__name"><a href="${href}">${p.name}</a></h3>
        <div class="c-rating">${icon("star-filled")}<strong>${listing.rating.toFixed(1)}</strong><span>(${listing.reviews})</span></div>
        ${priceHTML(p)}
        ${options.length > 1 ? `
          <div class="swatches" role="group" aria-label="${options.length} options">
            ${options.map((o) => `
              <button class="swatch${o.id === p.id ? " is-active" : ""}" type="button" data-swatch="${o.id}"
                aria-pressed="${o.id === p.id}" aria-label="${o.name}" title="${o.name}">
                <img src="${o.images[0]}" alt="" loading="lazy">
              </button>`).join("")}
          </div>` : ""}
        ${addHTML(p)}
      </div>
    </article>`;
}

/* ---------- shop grid ---------- */
const grid = document.getElementById("c-grid");
function showProducts(filter){
  grid.innerHTML = catalog()
    .map((l) => ({ l, match: filter === "all" ? l.options[0] : l.options.find((id) => getProduct(id).category === filter) }))
    .filter(({ match }) => match)
    .map(({ l, match }) => cardHTML(l, match))
    .join("");
}
showProducts("all");

document.querySelector(".c-filters").addEventListener("click", (e) => {
  const btn = e.target.closest("[data-filter]");
  if(!btn) return;
  document.querySelectorAll(".c-filter").forEach((b) => {
    b.classList.toggle("is-active", b === btn);
    b.setAttribute("aria-selected", String(b === btn));
  });
  showProducts(btn.dataset.filter);
});

/* ---------- combos ---------- */
document.getElementById("c-combo-rail").innerHTML = PRODUCTS.filter((p) => p.includes).map((p) => {
  const href = `product.html?id=${p.id}`;
  return `
    <article class="c-combo">
      ${photoHTML(p, href)}
      <div class="c-card__body">
        <h3 class="c-card__name"><a href="${href}">${p.name}</a></h3>
        <div class="c-combo__items">${p.includes.split(" + ").map((x) => `<span>${x}</span>`).join("")}</div>
        ${priceHTML(p)}
        ${addHTML(p)}
      </div>
    </article>`;
}).join("");

/* ---------- reviews ---------- */
document.getElementById("c-review-rail").innerHTML = REVIEW_PHOTOS.map((src, i) => `
  <figure class="c-snap">
    <img src="${src}" alt="Customer review photo ${i + 1} of ${REVIEW_PHOTOS.length}" loading="lazy">
    ${icon("heart-filled")}
  </figure>`).join("");

/* ---------- card interactions ---------- */
document.querySelector("main").addEventListener("click", (e) => {
  const swatch = e.target.closest("[data-swatch]");
  if(swatch){
    const id = swatch.dataset.swatch;
    const card = swatch.closest(".c-card");
    const tmp = document.createElement("div");
    tmp.innerHTML = cardHTML(getListing(id), id).trim();
    card.replaceWith(tmp.firstElementChild);
    grid.querySelector(`[data-swatch="${id}"]`)?.focus();
    return;
  }
  const add = e.target.closest("[data-add]");
  if(add){
    Cart.add(add.dataset.add, 1);
    showToast(`Added ${getProduct(add.dataset.add).name} to cart`);
    const html = add.innerHTML;
    add.innerHTML = `${icon("check")}Added`;
    add.disabled = true;
    setTimeout(() => { add.innerHTML = html; add.disabled = false; }, 1200);
  }
});

document.querySelectorAll("[data-slider]").forEach(initSlider);

/* ---------- "just purchased" pop-up ----------
   DEMO DATA ONLY: must be wired to real orders before launch. */
const PROOF_DEMO = [
  { who: "A customer in Selangor", id: "combo-gebu", when: "5 minutes ago" },
  { who: "A customer in Kelantan", id: "berry-scrub", when: "12 minutes ago" },
  { who: "A customer in Johor", id: "berry-serum", when: "20 minutes ago" },
  { who: "A customer in Sabah", id: "nestglow", when: "34 minutes ago" },
];
const proof = document.getElementById("c-proof");
let proofIndex = 0;
let proofTimer;
let proofOff = false;

function showProof(){
  if(proofOff) return;
  const item = PROOF_DEMO[proofIndex++ % PROOF_DEMO.length];
  const p = getProduct(item.id);
  document.getElementById("c-proof-img").src = p.images[0];
  document.getElementById("c-proof-who").textContent = `${item.who} bought`;
  document.getElementById("c-proof-what").textContent = p.name;
  document.getElementById("c-proof-when").textContent = item.when;
  proof.hidden = false;
  proof.classList.remove("is-in");
  void proof.offsetWidth;
  proof.classList.add("is-in");
  proofTimer = setTimeout(() => {
    proof.hidden = true;
    proofTimer = setTimeout(showProof, 9000);
  }, 6000);
}
document.getElementById("c-proof-close").addEventListener("click", () => {
  proofOff = true;
  clearTimeout(proofTimer);
  proof.hidden = true;
});
setTimeout(showProof, 5000);
