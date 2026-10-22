const CDN = "https://platform-bcl.bsb-cdn.com/media/2026/09/";

const CATEGORIES = {
  skincare: "Skincare / Bodycare",
  supplement: "Supplement",
  set: "Set Products",
};

const DELIVERY_COPY = [
  "Orders are packed within 1–2 working days.",
  "Peninsular Malaysia: 2–4 working days.",
  "Sabah & Sarawak: 4–7 working days.",
  "Free shipping on orders above RM150.",
];

// Mockup coupons (not real promotions).
const COUPONS = [
  { code: "GLOW10", label: "10% off your order", type: "percent", value: 10, minSpend: 0 },
  { code: "BERRY15", label: "RM15 off orders from RM150", type: "fixed", value: 15, minSpend: 150 },
];

// whiteBg: the product photo is a clean shot on a white / plain studio background.
const PRODUCTS = [
  {
    id: "berry-lotion",
    whiteBg: true,
    name: "Berry Lotion",
    category: "skincare",
    price: 55,
    compareAt: null,
    images: [CDN + "01M3KC1THAHZFXZ18Y2WCVSEXE.jpg"],
    tagline: "A light body lotion that sinks in fast and leaves skin soft with a berry scent.",
    description:
      "Berry Lotion is the everyday step of the Berry range. It hydrates without a sticky finish, so you can put it on after a shower and get dressed straight away. Use it daily for skin that looks smoother and more even.",
    howTo: [
      "Apply to clean, slightly damp skin after showering.",
      "Massage in circular motions until fully absorbed.",
      "Use morning and night for best results.",
    ],
  },
  {
    id: "berry-booster",
    whiteBg: true,
    name: "Berry Booster",
    category: "skincare",
    price: 55,
    compareAt: null,
    images: [CDN + "01M3KC1T0HM5S2P2MR1ZZEZSK0.jpg"],
    tagline: "Pairs with Berry Lotion to boost hydration and glow.",
    description:
      "Berry Booster is made to layer with Berry Lotion. Mix a small amount into your lotion to give dry areas extra moisture and a healthy-looking radiance.",
    howTo: [
      "Mix 1 pump of Booster with your usual amount of Berry Lotion.",
      "Apply evenly over arms, legs and body.",
      "Use once a day, preferably at night.",
    ],
  },
  {
    id: "berry-whitening-set",
    whiteBg: true,
    name: "Berry Whitening Set",
    category: "set",
    price: 65,
    compareAt: null,
    images: ["https://i.postimg.cc/NfDDKB6m/berrywhiteningset.jpg"],
    tagline: "Berry whitening essentials boxed together — a simple start to your routine.",
    description:
      "A starter set for anyone new to Beauté Shi, with the core Berry whitening steps packed together in one box.",
    howTo: [
      "Follow the steps printed on each product in the set.",
      "Use daily as part of your shower routine.",
      "Stay consistent for at least 4 weeks.",
    ],
  },
  {
    id: "berry-serum",
    name: "Berry Serum",
    category: "skincare",
    price: 49,
    compareAt: null,
    images: ["https://i.postimg.cc/fL7TMHGX/berryserum.jpg"],
    tagline: "A concentrated serum for areas that need more attention.",
    description:
      "Berry Serum is a lightweight, fast-absorbing serum for spots that look dull or uneven, like elbows, knees and underarms. Apply before your lotion to target those areas.",
    howTo: [
      "Apply 2–3 drops to clean skin.",
      "Pat gently until absorbed.",
      "Follow with Berry Lotion to lock in moisture.",
    ],
  },
  {
    id: "berry-scrub",
    whiteBg: true,
    name: "Berry Scrub",
    category: "skincare",
    price: 35,
    compareAt: null,
    images: [CDN + "01M3KC0RDWQC3ZDXX1J57XA0TG.jpeg"],
    tagline: "A gentle body scrub that clears away dull, dry skin.",
    description:
      "Fine exfoliating grains buff away dead skin so your lotion and serum absorb better. Leaves skin feeling smooth with a fresh strawberry scent.",
    howTo: [
      "Take a scoop onto wet skin in the shower.",
      "Massage in circular motions for 1–2 minutes.",
      "Rinse well. Use 2–3 times a week.",
    ],
  },
  {
    id: "berry-white-soap",
    whiteBg: true,
    name: "Berry White Whitening Soap",
    category: "skincare",
    price: 25,
    compareAt: null,
    images: [CDN + "01M3KC0SM73ZAMJSNACC0P663A.jpg"],
    tagline: "A daily cleansing bar that keeps skin fresh and bright.",
    description:
      "A gentle cleansing bar for face and body. It lathers well, rinses clean and does not leave skin feeling tight — the first step of every Berry routine.",
    howTo: [
      "Lather the bar with water between your hands.",
      "Massage onto wet skin, then rinse.",
      "Use twice a day. Keep the bar dry between uses.",
    ],
  },
  {
    id: "elen-renewal-cream",
    whiteBg: true,
    name: "Elen Renewal Cream",
    category: "skincare",
    price: 38,
    compareAt: null,
    images: [CDN + "01M3KC0TN53SE8NYJC2ENMFRW7.jpeg"],
    tagline: "A nourishing night cream for a smoother, more even-looking face.",
    description:
      "Elen Renewal Cream works while you sleep. A rich but non-greasy texture helps skin look refreshed and more even-toned by morning.",
    howTo: [
      "Cleanse and dry your face.",
      "Apply a pea-sized amount over face and neck.",
      "Use at night. Wear sunscreen during the day.",
    ],
  },
  {
    id: "nestglow",
    whiteBg: true,
    name: "Nestglow",
    category: "supplement",
    price: 45,
    compareAt: null,
    images: ["https://i.postimg.cc/fRZ4NzwR/nestglowstrawberry.jpg"],
    tagline: "A strawberry beauty drink with bird's nest, in easy daily sachets.",
    description:
      "Nestglow supports your routine from the inside. One sachet a day, mixed with water, tastes like strawberry and fits easily into your morning.",
    howTo: [
      "Pour 1 sachet into 150ml of room-temperature water.",
      "Stir well and drink.",
      "Take once a day, preferably in the morning.",
    ],
  },
  {
    id: "combo-bodycare",
    name: "Combo Bodycare",
    category: "set",
    price: 110,
    compareAt: 115,
    images: [CDN + "01M3KD0JZGE3BKZBW7FQ8WX1Z0.jpg"],
    includes: "Lotion + Soap + Scrub",
    tagline: "The full shower-to-moisturise routine in three steps.",
    description:
      "Cleanse, exfoliate and moisturise. This combo covers the core Berry body routine so you never run out of a step.",
    howTo: [
      "Cleanse with Berry White Soap.",
      "Scrub 2–3 times a week.",
      "Finish with Berry Lotion on damp skin.",
    ],
  },
  {
    id: "combo-perfect-bodycare",
    name: "Combo Perfect Bodycare",
    category: "set",
    price: 160,
    compareAt: 170,
    images: [CDN + "01M3KD8EAXM0C17W4MXX6NRXNA.jpg"],
    includes: "Lotion + Booster + Scrub + Soap",
    tagline: "Adds Berry Booster to the bodycare routine for extra glow.",
    description:
      "Everything in Combo Bodycare, plus Berry Booster for drier skin or anyone who wants faster-looking results.",
    howTo: [
      "Cleanse with soap, exfoliate with scrub.",
      "Mix Booster into Lotion.",
      "Apply to body daily.",
    ],
  },
  {
    id: "combo-fullset",
    name: "Combo Fullset",
    category: "set",
    price: 255,
    compareAt: 264,
    images: [CDN + "01M3KD0N20WQC60CQG3M9FM6GT.jpg"],
    includes: "Nestglow + Serum + Soap + Scrub + Lotion + Booster",
    tagline: "The complete Beauté Shi collection, six products in one order.",
    description:
      "Our best value. Every Berry step plus Nestglow, for a complete routine from the inside out.",
    howTo: [
      "Morning: Nestglow, then soap and lotion.",
      "Night: serum on target areas, then lotion with Booster.",
      "Scrub 2–3 times a week.",
    ],
  },
  {
    id: "combo-gebu",
    name: "Combo Gebu",
    category: "set",
    price: 154,
    compareAt: 159,
    images: ["https://i.postimg.cc/QCckbrK4/combo-6.jpg"],
    includes: "Lotion + Booster + Serum",
    tagline: "The three moisturising steps for soft, plump-looking skin.",
    description:
      "Built for skin that needs more moisture. Serum targets dry or uneven areas, then Lotion and Booster lock in hydration.",
    howTo: [
      "Apply Berry Serum to target areas.",
      "Mix Booster into Lotion.",
      "Apply all over the body, morning and night.",
    ],
  },
  {
    id: "combo-elen-serum",
    name: "Combo Elen + Serum",
    category: "set",
    price: 85,
    compareAt: 87,
    images: [CDN + "01M3KC0T66G5YSMEMW09THJ609.jpg"],
    includes: "Elen Renewal Cream + Berry Serum",
    tagline: "A night cream and a serum, paired for face and targeted care.",
    description:
      "Elen Renewal Cream for your face at night, plus Berry Serum for areas that need extra attention.",
    howTo: [
      "Night: apply Elen Renewal Cream to clean face and neck.",
      "Apply Berry Serum to target areas.",
      "Wear sunscreen during the day.",
    ],
  },
];

// A listing groups products shown as options of one product page (like TikTok Shop "Spesifikasi").
// Rating / sold numbers are placeholders except serum-elen, which mirrors the live TikTok listing.
// Products not in a listing are sold on their own (no options).
const LISTINGS = [
  {
    id: "serum-elen",
    title: "Berry Serum for Body & Face by Beauté Shi & Elen Beauté Renewal Cream",
    options: ["berry-serum", "elen-renewal-cream", "combo-elen-serum"],
    rating: 4.9, reviews: "2.5K", sold: "13.7K",
    badges: { "berry-serum": "1K+ sold" },
  },
  {
    id: "combos",
    title: "Beauté Shi Combo Sets — Complete Berry Body Care Routine",
    options: ["combo-bodycare", "combo-perfect-bodycare", "combo-gebu", "combo-fullset"],
    rating: 4.8, reviews: "860", sold: "5.1K",
  },
];

function getProduct(id){
  return PRODUCTS.find((p) => p.id === id);
}

// Catalogue limited to products whose photo has a white background (used by the concept pages).
function whiteListing(productId){
  const l = getListing(productId);
  return { ...l, options: l.options.filter((id) => getProduct(id).whiteBg) };
}
function whiteCatalog(){
  return catalog().map((l) => whiteListing(l.options[0])).filter((l) => l.options.length);
}

function catalog(){
  const seen = new Set();
  return PRODUCTS.map((p) => getListing(p.id)).filter((l) => !seen.has(l.id) && seen.add(l.id));
}

function getListing(productId){
  const found = LISTINGS.find((l) => l.options.includes(productId));
  if(found) return found;
  const p = getProduct(productId);
  return { id: productId, title: p.name, options: [productId], rating: 4.8, reviews: "320", sold: "1.9K" };
}

function formatRM(value){
  return "RM" + value.toFixed(2);
}
