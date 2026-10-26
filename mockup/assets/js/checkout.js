renderHeader("");
renderFooter();
document.getElementById("app-bar").outerHTML = appBarHTML("Checkout", pageUrl("cart.html"));

const STATES = ["Johor", "Kedah", "Kelantan", "Melaka", "Negeri Sembilan", "Pahang", "Perak", "Perlis",
  "Pulau Pinang", "Sabah", "Sarawak", "Selangor", "Terengganu", "W.P. Kuala Lumpur", "W.P. Labuan", "W.P. Putrajaya"];
const BANKS = ["Maybank2u", "CIMB Clicks", "Public Bank", "RHB Now", "Hong Leong Connect", "AmOnline", "Bank Islam", "Bank Rakyat"];
const PAYMENTS = {
  fpx: { label: "Online banking (FPX)", note: "Maybank2u, CIMB Clicks, Public Bank and more", icon: "building-bank" },
  card: { label: "Credit / debit card", note: "Visa and Mastercard", icon: "credit-card" },
  ewallet: { label: "E-wallet", note: "Touch 'n Go eWallet, GrabPay, ShopeePay", icon: "wallet" },
};
const ADDRESS_KEY = "beauteshi_address";

const esc = (v) => String(v).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const state = {
  address: (() => { try{ return JSON.parse(localStorage.getItem(ADDRESS_KEY)); }catch{ return null; } })(),
  payment: { method: "fpx", bank: "" },
  note: "",
  terms: false,
  submitted: false,
};

const root = document.getElementById("checkout-root");
const bar = document.getElementById("checkout-bar");

/* ---------- sheets ---------- */
document.body.insertAdjacentHTML("beforeend", sheetHTML("address-sheet", "Shipping address", `
  <form id="address-form" novalidate>
    <div class="field-grid">
      <div class="field">
        <label for="name">Full name <span class="req">*</span></label>
        <input id="name" name="name" autocomplete="name" required>
        <span class="field-error">Enter the recipient's full name.</span>
      </div>
      <div class="field">
        <label for="phone">Phone number <span class="req">*</span></label>
        <input id="phone" name="phone" type="tel" autocomplete="tel" placeholder="012-345 6789" required pattern="^(\\+?6?0)[0-9\\- ]{8,12}$">
        <span class="field-error">Enter a Malaysian phone number, e.g. 012-345 6789.</span>
      </div>
      <div class="field">
        <label for="street">Address <span class="req">*</span></label>
        <input id="street" name="street" autocomplete="street-address" placeholder="House no., street, area" required>
        <span class="field-error">Enter your delivery address.</span>
      </div>
      <div class="field half">
        <label for="postcode">Postcode <span class="req">*</span></label>
        <input id="postcode" name="postcode" inputmode="numeric" autocomplete="postal-code" maxlength="5" required pattern="^[0-9]{5}$">
        <span class="field-error">Postcode must be 5 digits.</span>
      </div>
      <div class="field half">
        <label for="city">City <span class="req">*</span></label>
        <input id="city" name="city" autocomplete="address-level2" required>
        <span class="field-error">Enter your city.</span>
      </div>
      <div class="field">
        <label for="state">State <span class="req">*</span></label>
        <select id="state" name="state" autocomplete="address-level1" required>
          <option value="">Select state</option>
          ${STATES.map((s) => `<option>${s}</option>`).join("")}
        </select>
        <span class="field-error">Select your state.</span>
      </div>
    </div>
  </form>`, `<button class="btn btn-primary btn-lg btn-block" type="submit" form="address-form">Save address</button>`));

document.body.insertAdjacentHTML("beforeend", sheetHTML("payment-sheet", "Payment method", `
  <div class="option-list" id="payment-options">
    ${Object.entries(PAYMENTS).map(([key, p]) => `
      <label class="option">
        <input type="radio" name="payment" value="${key}">
        <span class="option__icon">${icon(p.icon)}</span>
        <span class="option__label"><strong>${p.label}</strong><span>${p.note}</span></span>
      </label>`).join("")}
  </div>
  <div class="field bank-field" id="bank-field">
    <label for="bank">Choose your bank <span class="req">*</span></label>
    <select id="bank">
      <option value="">Select bank</option>
      ${BANKS.map((b) => `<option>${b}</option>`).join("")}
    </select>
    <span class="field-error">Select a bank to pay with FPX.</span>
  </div>
  <p class="sheet__note">${icon("lock")}You'll be taken to a secure payment page after placing your order.</p>`,
  `<button class="btn btn-primary btn-lg btn-block" type="button" id="payment-save">Confirm</button>`));

document.body.insertAdjacentHTML("beforeend", sheetHTML("notes-sheet", "Note for seller", `
  <label class="visually-hidden" for="note">Note for seller</label>
  <textarea class="app-textarea" id="note" maxlength="200" placeholder="E.g. leave the parcel with the guardhouse"></textarea>
  <p class="sheet__note" id="note-count">0/200</p>`,
  `<button class="btn btn-primary btn-lg btn-block" type="button" id="note-save">Save note</button>`));

const couponSheet = mountCouponSheet(render);

/* ---------- rendering ---------- */
function itemHTML({ product: p, qty }){
  const listing = getListing(p.id);
  const off = p.compareAt ? Math.round((1 - p.price / p.compareAt) * 100) : 0;
  return `
    <li class="ci ci--static">
      <span class="ci__media"><img src="${p.images[0]}" alt=""></span>
      <div class="ci__info">
        <span class="ci__name">${listing.title}</span>
        ${listing.options.length > 1 ? `<span class="ci__chip">${p.name}</span>` : p.includes ? `<span class="ci__meta">${p.includes}</span>` : ""}
        <div class="ci__bottom">
          <div class="ci__price">
            <strong>${formatRM(p.price)}</strong>
            ${off ? `<span><s>${formatRM(p.compareAt)}</s><em>-${off}%</em></span>` : ""}
          </div>
          <span class="ci__qty">×${qty}</span>
        </div>
      </div>
    </li>`;
}

function addressRow(){
  const a = state.address;
  const missing = state.submitted && !a;
  return `
    <button class="app-row${a ? " app-row--address" : ""}${missing ? " has-error" : ""}" type="button" data-sheet="address-sheet">
      <span class="app-row__icon">${icon("map-pin")}</span>
      <span class="app-row__text">
        ${a
          ? `<strong>${esc(a.name)}</strong>
             <span class="app-row__phone">${esc(a.phone)}</span>
             <span>${esc(a.street)}, ${esc(a.postcode)} ${esc(a.city)}, ${esc(a.state)}</span>`
          : `<strong>Add shipping address</strong><span>${missing ? "Add your address to place the order" : "Where should we send your order?"}</span>`}
      </span>
      ${icon("chevron-right", "app-row__chevron")}
    </button>`;
}

function paymentRow(){
  const p = PAYMENTS[state.payment.method];
  const needsBank = state.payment.method === "fpx" && !state.payment.bank;
  const missing = state.submitted && needsBank;
  return `
    <button class="app-row${missing ? " has-error" : ""}" type="button" data-sheet="payment-sheet">
      <span class="app-row__icon">${icon(p.icon)}</span>
      <span class="app-row__text">
        <strong>${p.label}</strong>
        <span>${state.payment.method === "fpx" ? (state.payment.bank || (missing ? "Choose your bank to continue" : "Choose your bank")) : p.note}</span>
      </span>
      ${icon("chevron-right", "app-row__chevron")}
    </button>`;
}

function render(){
  const lines = Cart.lines();
  if(!lines.length){
    bar.hidden = true;
    document.body.classList.remove("has-checkout-bar");
    root.innerHTML = `
      <div class="empty-state">
        <div class="empty-state__icon" aria-hidden="true">${ICONS.bag}</div>
        <h2>Nothing to check out yet</h2>
        <p>Add a product to your cart, then come back here to place your order.</p>
        <a class="btn btn-primary btn-lg" href="${pageUrl("index.html")}#products">Shop products</a>
      </div>`;
    return;
  }

  const subtotal = lines.reduce((s, l) => s + l.product.price * l.qty, 0);
  const shipping = shippingFor(state.address?.state, subtotal);
  const t = orderTotals(shipping);
  const east = EAST_MALAYSIA.includes(state.address?.state);

  root.innerHTML = `
    <div class="app-group">${addressRow()}</div>

    <section class="app-group" aria-labelledby="summary-title">
      <h2 class="app-group__title" id="summary-title">Order summary</h2>
      <ul class="ci-list">${lines.map(itemHTML).join("")}</ul>
    </section>

    <div class="app-group">
      <div class="app-row app-row--static">
        <span class="app-row__icon">${icon("truck-delivery")}</span>
        <span class="app-row__text">
          <strong>Standard delivery</strong>
          <span>${state.address ? (east ? "4–7 working days to Sabah, Sarawak & Labuan" : "2–4 working days in Peninsular Malaysia") : "Add your address to see delivery time"}</span>
        </span>
        ${shipping === null ? "" : `<span class="app-row__value">${shipping === 0 ? "Free" : formatRM(shipping)}</span>`}
      </div>
      ${paymentRow()}
      ${couponRowHTML(t)}
      <button class="app-row" type="button" data-sheet="notes-sheet">
        <span class="app-row__icon">${icon("file-text")}</span>
        <span class="app-row__text">
          <strong>Note for seller</strong>
          <span>${state.note ? esc(state.note) : "Optional"}</span>
        </span>
        ${icon("chevron-right", "app-row__chevron")}
      </button>
    </div>

    <div class="app-group app-totals">
      <div class="summary-row"><span>Subtotal</span><strong>${formatRM(t.subtotal)}</strong></div>
      ${t.discount ? `<div class="summary-row is-savings"><span>Coupon (${t.coupon.code})</span><span>−${formatRM(t.discount)}</span></div>` : ""}
      <div class="summary-row"><span>Shipping</span><strong>${shipping === null ? "Add address" : shipping === 0 ? "Free" : formatRM(shipping)}</strong></div>
      <hr class="summary-divider">
      <div class="summary-row summary-row--total"><span>Total</span><strong>${formatRM(t.total)}</strong></div>
    </div>

    <label class="app-terms${state.submitted && !state.terms ? " has-error" : ""}">
      <input type="checkbox" id="terms" ${state.terms ? "checked" : ""}>
      <span>I have read and agree to the <a href="#">Terms and Conditions</a> <span class="req">*</span>
        ${state.submitted && !state.terms ? `<span class="app-terms__error">Tick the box to agree before placing your order.</span>` : ""}
      </span>
    </label>`;

  bar.hidden = false;
  document.body.classList.add("has-checkout-bar");
  const struck = t.original + (shipping || 0);
  bar.innerHTML = `
    <div class="app-checkout-bar__inner">
      <div class="app-checkout-bar__total">
        <strong>${formatRM(t.total)}${t.saved > 0 ? ` <s>${formatRM(struck)}</s>` : ""}</strong>
        ${t.saved > 0 ? `<span class="is-saving">You save ${formatRM(t.saved)}</span>` : `<span>${shipping === null ? "Excludes shipping" : "Includes shipping"}</span>`}
      </div>
      <button class="btn btn-primary btn-lg" type="button" id="place-order">Place order</button>
    </div>`;
}

/* ---------- address ---------- */
const addressForm = document.getElementById("address-form");
function validateField(input){
  const field = input.closest(".field");
  const ok = input.checkValidity();
  field.classList.toggle("has-error", !ok);
  input.setAttribute("aria-invalid", String(!ok));
  return ok;
}
function openAddress(trigger){
  const a = state.address || {};
  ["name", "phone", "street", "postcode", "city", "state"].forEach((k) => {
    addressForm.elements[k].value = a[k] || "";
    addressForm.elements[k].closest(".field").classList.remove("has-error");
  });
  Sheets.open("address-sheet", trigger);
}
addressForm.addEventListener("change", (e) => validateField(e.target));
addressForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const inputs = [...addressForm.querySelectorAll("input, select")];
  const invalid = inputs.filter((i) => !validateField(i));
  if(invalid.length) return invalid[0].focus();
  state.address = Object.fromEntries(inputs.map((i) => [i.name, i.value.trim()]));
  try{ localStorage.setItem(ADDRESS_KEY, JSON.stringify(state.address)); }catch{}
  Sheets.close();
  render();
  showToast("Address saved");
});

/* ---------- payment ---------- */
const bankField = document.getElementById("bank-field");
const bankSelect = document.getElementById("bank");
function syncBankField(){
  bankField.hidden = document.querySelector('#payment-options input:checked')?.value !== "fpx";
}
function openPayment(trigger){
  document.querySelector(`#payment-options input[value="${state.payment.method}"]`).checked = true;
  bankSelect.value = state.payment.bank;
  bankField.classList.remove("has-error");
  syncBankField();
  Sheets.open("payment-sheet", trigger);
}
document.getElementById("payment-options").addEventListener("change", syncBankField);
document.getElementById("payment-save").addEventListener("click", () => {
  const method = document.querySelector("#payment-options input:checked").value;
  if(method === "fpx" && !bankSelect.value){
    bankField.classList.add("has-error");
    return bankSelect.focus();
  }
  state.payment = { method, bank: method === "fpx" ? bankSelect.value : "" };
  Sheets.close();
  render();
});

/* ---------- notes ---------- */
const noteInput = document.getElementById("note");
noteInput.addEventListener("input", () => {
  document.getElementById("note-count").textContent = `${noteInput.value.length}/200`;
});
document.getElementById("note-save").addEventListener("click", () => {
  state.note = noteInput.value.trim();
  Sheets.close();
  render();
});

/* ---------- events ---------- */
root.addEventListener("click", (e) => {
  const coupon = e.target.closest("[data-open-coupon]");
  if(coupon) return couponSheet.open(coupon);
  const row = e.target.closest("[data-sheet]");
  if(!row) return;
  if(row.dataset.sheet === "address-sheet") return openAddress(row);
  if(row.dataset.sheet === "payment-sheet") return openPayment(row);
  noteInput.value = state.note;
  noteInput.dispatchEvent(new Event("input"));
  Sheets.open("notes-sheet", row);
});

root.addEventListener("change", (e) => {
  if(e.target.id !== "terms") return;
  state.terms = e.target.checked;
  if(state.submitted) render();
});

bar.addEventListener("click", (e) => {
  if(!e.target.closest("#place-order")) return;
  state.submitted = true;
  const needsAddress = !state.address;
  const needsBank = state.payment.method === "fpx" && !state.payment.bank;
  render();

  if(needsAddress) return openAddress(root.querySelector('[data-sheet="address-sheet"]'));
  if(needsBank) return openPayment(root.querySelector('[data-sheet="payment-sheet"]'));
  if(!state.terms){
    const terms = root.querySelector(".app-terms");
    terms.scrollIntoView({ block: "center", behavior: "smooth" });
    terms.querySelector("input").focus({ preventScroll: true });
    return;
  }

  const orderNo = "BS" + Date.now().toString().slice(-8);
  document.getElementById("confirm-icon").innerHTML = ICONS.check;
  document.getElementById("confirm-name").textContent = state.address.name.split(" ")[0];
  document.getElementById("confirm-no").textContent = orderNo;
  document.getElementById("confirm-phone").textContent = state.address.phone;
  Cart.clear();
  Coupon.clear();
  const overlay = document.getElementById("confirm");
  overlay.classList.add("is-visible");
  overlay.querySelector(".btn").focus();
});

render();

document.querySelector("#confirm .btn").setAttribute("href", pageUrl("index.html"));
