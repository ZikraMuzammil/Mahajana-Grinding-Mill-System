// Put this file in the same src folder as AllProducts.js
// It decides which picture to show for a product coming from the database.

import img1 from "./images/spicepowders.jpg";
import img2 from "./images/flouritems.jpg";
import img3 from "./images/herbalitems.jpg";
import img4 from "./images/chaimasala.jpg";
import img5 from "./images/grains.jpg";
import img6 from "./images/nuts.jpg";
import img7 from "./images/facialproducts.jpg";
import img8 from "./images/product8.jpg";
import img9 from "./images/ready-mix.jpg";
import img10 from "./images/packaging.jpg";
import img11 from "./images/coconut.jpg";
import img12 from "./images/beverages.jpg";
import img13 from "./images/bakery.jpg";
import img14 from "./images/ayurvedic.jpg";
import img15 from "./images/natural-sweet.jpg";
import logoImg from "./images/logo.png";

// If your backend serves uploaded pictures, set this to that folder URL.
// Example: http://localhost:5000/uploads
const IMAGE_BASE = "http://localhost:5000/uploads";

export const FALLBACK_IMAGE = logoImg;

// Order matters: the first keyword found in the name/category wins.
const KEYWORDS = [
  [["rice"], img8],
  [["flour"], img2],
  [["chai", "tea masala"], img4],
  [["herbal", "herb", "moringa", "gotukola", "gotu kola", "iramusu", "venivel", "ranawara", "neem", "aloe", "beli", "kothala", "polpala", "katuwelbatu"], img3],
  [["ayurved"], img14],
  [["spice", "powder", "masala", "chilli", "chili", "pepper", "cinnamon", "turmeric", "curry"], img1],
  [["grain", "pulse", "dhal", "dal", "gram"], img5],
  [["nut", "seed", "cashew", "peanut"], img6],
  [["facial", "beauty", "face", "skin"], img7],
  [["ready", "mix"], img9],
  [["packag"], img10],
  [["coconut"], img11],
  [["beverage", "drink", "juice"], img12],
  [["bakery", "bread", "cake"], img13],
  [["sweet", "jaggery", "honey"], img15],
];
export function getProductImage(p) {
  if (!p) return FALLBACK_IMAGE;

  const raw = p.image || p.img || "";

  // already a full url, data url, or a built react asset
  if (raw && /^(https?:|data:|blob:|\/static\/)/.test(raw)) return raw;

  // match by product name or category
  const text = `${p.name || p.title || ""} ${p.category || ""}`.toLowerCase();
  for (const [words, img] of KEYWORDS) {
    if (words.some((w) => text.includes(w))) return img;
  }

  // a file name saved in the database
  if (raw) return `${IMAGE_BASE}/${String(raw).replace(/^\/+/, "")}`;

  return FALLBACK_IMAGE;
}

export const onImgError = (e) => {
  e.currentTarget.onerror = null;
  e.currentTarget.src = FALLBACK_IMAGE;
};