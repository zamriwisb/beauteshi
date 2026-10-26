/* Homepage product grid and "just purchased" pop-up. Header/footer come from shell.js. */

// Products photographed on a white background, one card each (TemyLens shows plain cards, no buttons).
const products = PRODUCTS.filter((p) => p.whiteBg);

function badgeFor(p){
  if(p.id === "berry-scrub") return `<span class="t-badge">New</span>`;
  if(p.compareAt) return `<span class="t-badge">Save ${formatRM(p.compareAt - p.price)}</span>`;
  return "";
}

document.getElementById("t-grid").innerHTML = products.map((p) => `
  <li class="t-card">
    <a href="${pageUrl("product.html")}?id=${p.id}">
      <span class="t-card__photo">
        <img src="${p.images[0]}" alt="${p.name}" loading="lazy">
        ${badgeFor(p)}
      </span>
      <h3 class="t-card__name">${p.name}</h3>
      <p class="t-card__price">${formatRM(p.price)}${p.compareAt ? ` <s>${formatRM(p.compareAt)}</s>` : ""}</p>
    </a>
  </li>`).join("");

/* ---------- "just purchased" pop-up ----------
   DEMO DATA ONLY: must be wired to real orders before launch. */
const PROOF_DEMO = [
  { who: "A customer in Kelantan", id: "berry-scrub", when: "8 minutes ago" },
  { who: "A customer in Selangor", id: "berry-lotion", when: "15 minutes ago" },
  { who: "A customer in Johor", id: "nestglow", when: "26 minutes ago" },
  { who: "A customer in Penang", id: "elen-renewal-cream", when: "40 minutes ago" },
];
const proof = document.getElementById("t-proof");
let proofIndex = 0;
let proofTimer;
let proofOff = false;

function showProof(){
  if(proofOff) return;
  const item = PROOF_DEMO[proofIndex++ % PROOF_DEMO.length];
  const p = getProduct(item.id);
  document.getElementById("t-proof-img").src = p.images[0];
  document.getElementById("t-proof-who").textContent = `${item.who} just purchased`;
  const link = document.getElementById("t-proof-what");
  link.textContent = p.name;
  link.href = `${pageUrl("product.html")}?id=${p.id}`;
  document.getElementById("t-proof-when").textContent = item.when;
  proof.hidden = false;
  proof.classList.remove("is-in");
  void proof.offsetWidth;
  proof.classList.add("is-in");
  proofTimer = setTimeout(() => {
    proof.hidden = true;
    proofTimer = setTimeout(showProof, 9000);
  }, 6000);
}
document.getElementById("t-proof-close").addEventListener("click", () => {
  proofOff = true;
  clearTimeout(proofTimer);
  proof.hidden = true;
});
setTimeout(showProof, 5000);
