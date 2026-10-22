renderHeader("home");
renderFooter();

// Keep the menu on this concept page instead of jumping to the current homepage.
const NAV = { home: ["Home", "#"], shop: ["Shop", "#products"], combos: ["Sets", "#products"], about: ["About", "#about"] };
document.querySelectorAll("#main-nav a").forEach((a, i) => {
  const [label, href] = Object.values(NAV)[i] || [];
  if(!label) return;
  a.textContent = label;
  a.setAttribute("href", href === "#" ? "concept-2.html" : href);
  if(label === "Sets") a.addEventListener("click", () => setFilter("set"));
});
document.querySelector(".brand").setAttribute("href", "concept-2.html");

const REVIEW_PHOTOS = [
  "01M3KDBWNSPS9FWZEERW5C9XSD.jpg",
  "01M3KDBXEPQ0X3CGXEE3P42FBX.jpg",
  "01M3KDBXYYZNA8PHKKMM6H5QK0.jpg",
  "01M3KDBYFNVWNEV5KEAXV6JPY5.jpg",
  "01M3KDBZMH09B2ZHA454TW0XG0.jpg",
  "01M3KDBZ0W32KKS1ZAD3XVY8EX.jpg",
].map((f) => CDN + f);

function matchFor(listing, filter){
  return filter === "all" ? listing.options[0] : listing.options.find((id) => getProduct(id).category === filter);
}

function labelFor(p){
  if(p.id === "berry-serum") return `<span class="k-label">Best seller</span>`;
  if(p.id === "berry-scrub") return `<span class="k-label">New</span>`;
  if(p.compareAt) return `<span class="k-label">Save ${formatRM(p.compareAt - p.price)}</span>`;
  return "";
}

function cardHTML(listing, selectedId){
  const options = listing.options.map(getProduct);
  const p = getProduct(selectedId) || options[0];
  const href = `product.html?id=${p.id}`;
  return `
    <article class="k-card" data-listing="${listing.id}">
      <a class="k-card__photo" href="${href}">
        <img src="${p.images[0]}" alt="${p.name}" loading="lazy">
        ${labelFor(p)}
      </a>
      <div class="k-card__body">
        <h3 class="k-card__name"><a href="${href}">${p.name}</a></h3>
        <span class="k-card__cat">${CATEGORIES[p.category]}</span>
        <div class="k-card__price">
          <strong>${formatRM(p.price)}</strong>
          ${p.compareAt ? `<s>${formatRM(p.compareAt)}</s>` : ""}
        </div>
        ${options.length > 1 ? `
          <div class="swatches" role="group" aria-label="${options.length} options">
            ${options.map((o) => `
              <button class="swatch${o.id === p.id ? " is-active" : ""}" type="button" data-swatch="${o.id}"
                aria-pressed="${o.id === p.id}" aria-label="${o.name}" title="${o.name}">
                <img src="${o.images[0]}" alt="" loading="lazy">
              </button>`).join("")}
          </div>` : ""}
        <button class="k-btn" type="button" data-add="${p.id}">Add to cart</button>
      </div>
    </article>`;
}

/* ---------- product grid ---------- */
const grid = document.getElementById("k-grid");
function showProducts(filter){
  grid.innerHTML = catalog()
    .map((l) => ({ l, match: matchFor(l, filter) }))
    .filter(({ match }) => match)
    .map(({ l, match }) => cardHTML(l, match))
    .join("");
}
function setFilter(filter){
  document.querySelectorAll(".k-tab").forEach((t) => {
    const on = t.dataset.filter === filter;
    t.classList.toggle("is-active", on);
    t.setAttribute("aria-selected", String(on));
  });
  showProducts(filter);
}
showProducts("all");

document.querySelector(".k-tabs").addEventListener("click", (e) => {
  const tab = e.target.closest("[data-filter]");
  if(tab) setFilter(tab.dataset.filter);
});

grid.addEventListener("click", (e) => {
  const swatch = e.target.closest("[data-swatch]");
  if(swatch){
    const id = swatch.dataset.swatch;
    const tmp = document.createElement("div");
    tmp.innerHTML = cardHTML(getListing(id), id).trim();
    swatch.closest(".k-card").replaceWith(tmp.firstElementChild);
    grid.querySelector(`[data-swatch="${id}"]`)?.focus();
    return;
  }
  const add = e.target.closest("[data-add]");
  if(add){
    Cart.add(add.dataset.add, 1);
    showToast(`Added ${getProduct(add.dataset.add).name} to cart`);
    add.textContent = "Added";
    add.disabled = true;
    setTimeout(() => { add.textContent = "Add to cart"; add.disabled = false; }, 1200);
  }
});

/* ---------- feedback ---------- */
document.getElementById("k-reviews").innerHTML = REVIEW_PHOTOS.map((src, i) => `
  <figure><img src="${src}" alt="Customer review photo ${i + 1} of ${REVIEW_PHOTOS.length}" loading="lazy"></figure>`).join("");
