/* Site shell: top bar, header, footer and WhatsApp button shared by
   index, product, cart and checkout. Load after app.js. */

const onHome = (location.pathname.split("/").pop() || "index.html") === PAGES.home;

document.getElementById("t-top").outerHTML = `
  <div class="t-topbar">
    <div class="t-wrap t-topbar__row">
      <p>Join us for new berry launches and member promos</p>
    </div>
  </div>

  <header class="t-header">
    <div class="t-wrap t-header__row">
      <a class="t-logo" href="${PAGES.home}"><img src="assets/img/logo.webp" alt="Beauté Shi — Secret of Beauté"></a>
      <nav class="t-nav" id="t-nav" aria-label="Main">
        <a href="${PAGES.home}"${onHome ? ` aria-current="page"` : ""}>Home</a>
        <a href="${onHome ? "" : PAGES.home}#products">Our products</a>
        <a href="#">FAQs</a>
        <a href="#">Feedback</a>
        <a href="#contact">Contact</a>
      </nav>
      <div class="t-icons t-icons--header">
        <button class="t-menu" type="button" aria-label="Open menu" aria-controls="t-nav" aria-expanded="false"><i class="ti ti-menu-2" aria-hidden="true"></i></button>
        <a href="#" aria-label="Account"><i class="ti ti-user" aria-hidden="true"></i></a>
        <a href="#" aria-label="Wishlist"><i class="ti ti-heart" aria-hidden="true"></i></a>
        <a href="${PAGES.cart}" aria-label="Cart" class="t-cart">
          <i class="ti ti-shopping-bag" aria-hidden="true"></i>
          <span class="cart-count" data-cart-count hidden>0</span>
        </a>
      </div>
    </div>
  </header>`;

document.getElementById("t-bottom").outerHTML = `
  <footer class="t-footer" id="contact">
    <div class="t-wrap t-footer__grid">
      <div class="t-footer__brand">
        <img src="assets/img/logo.webp" alt="Beauté Shi">
        <div class="t-social">
          <a href="#" aria-label="Beauté Shi on Instagram"><i class="ti ti-brand-instagram" aria-hidden="true"></i></a>
          <a href="#" aria-label="Beauté Shi on TikTok"><i class="ti ti-brand-tiktok" aria-hidden="true"></i></a>
        </div>
      </div>
      <div class="t-footer__col">
        <h2>Beauté Shi</h2>
        <p>Beauty and wellness essentials for your everyday self-care routine.</p>
        <a class="t-footer__contact" href="#"><i class="ti ti-brand-whatsapp" aria-hidden="true"></i>Chat with us on WhatsApp</a>
        <a class="t-footer__contact" href="#"><i class="ti ti-mail-filled" aria-hidden="true"></i>Email us</a>
      </div>
      <div class="t-footer__col">
        <h2>Customer care</h2>
        <ul>
          <li><a href="#">Track your order</a></li>
          <li><a href="#">How to order</a></li>
          <li><a href="#">Shipping &amp; delivery</a></li>
          <li><a href="#">FAQs</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
      </div>
      <div class="t-footer__col">
        <h2>Information</h2>
        <ul>
          <li><a href="#">About Beauté Shi</a></li>
          <li><a href="#">Feedback</a></li>
          <li><a href="#">Terms of use</a></li>
          <li><a href="#">Privacy policy</a></li>
        </ul>
      </div>
    </div>
    <div class="t-wrap t-footer__copy">© 2026 Beauté Shi. All rights reserved.</div>
  </footer>

  <a class="t-whatsapp" href="#" aria-label="Chat with Beauté Shi on WhatsApp">
    <span class="t-whatsapp__label">Need Help? <strong>Chat with us</strong></span>
    <span class="t-whatsapp__btn"><i class="ti ti-brand-whatsapp" aria-hidden="true"></i></span>
  </a>`;

/* ---------- phone menu ---------- */
const menuBtn = document.querySelector(".t-menu");
const nav = document.getElementById("t-nav");
menuBtn.addEventListener("click", () => {
  const open = nav.classList.toggle("is-open");
  menuBtn.setAttribute("aria-expanded", String(open));
});
nav.addEventListener("click", (e) => {
  if(e.target.closest("a")){
    nav.classList.remove("is-open");
    menuBtn.setAttribute("aria-expanded", "false");
  }
});

updateCartCount();
