// Mock catalogue data and filtering, used until the backend catalogue module is merged.
// The response shapes here are the contract the backend should return.
// To use real photos, put files in public/images/products/ and set `image: "/images/products/<file>"`.

export const COLORS = {
  lilac: { name: "Lilac Mist", hex: "#b8a4e3" },
  damson: { name: "Damson", hex: "#4a2a4f" },
  obsidian: { name: "Obsidian", hex: "#1c1724" },
  ivory: { name: "Ivory Crepe", hex: "#f2ece0" },
  olive: { name: "Pale Olive", hex: "#a3a58a" },
  taupe: { name: "Rose Taupe", hex: "#c9a7a3" },
  champagne: { name: "Champagne", hex: "#e9dcc4" },
};

export const CATEGORIES = [
  { slug: "dresses", label: "Dresses & Gowns", note: "Fluid silhouettes" },
  { slug: "tops", label: "Tops & Knitwear", note: "Signature binding" },
  { slug: "skirts-trousers", label: "Skirts & Trousers", note: "Straight & wide cut" },
  { slug: "outerwear", label: "Tailored Outerwear", note: "Structured layers" },
];

const sizes = (stock) => ["XS", "S", "M", "L", "XL"].map((size, i) => ({ size, stock: stock[i] ?? 0 }));

export const PRODUCTS = [
  {
    id: 1, slug: "tailored-a-line-midi-dress", name: "Tailored A-Line Midi Dress",
    category: "dresses", collection: "Silk Capsule", price: 145, salePrice: null, badge: "New",
    colors: [COLORS.lilac, COLORS.obsidian, COLORS.ivory], sizes: sizes([2, 5, 4, 3, 0]),
    createdAt: "2026-10-12", sold: 120,
  },
  {
    id: 2, slug: "contrast-binding-fitted-top", name: "Contrast Binding Fitted Top",
    category: "tops", collection: "Separates", price: 88, salePrice: null, badge: null,
    colors: [COLORS.obsidian, COLORS.ivory], sizes: sizes([4, 6, 3, 2, 1]),
    createdAt: "2026-09-20", sold: 210,
  },
  {
    id: 3, slug: "off-shoulder-column-gown", name: "Off Shoulder Column Gown",
    category: "dresses", collection: "Evening", price: 220, salePrice: 168, badge: "Sale",
    colors: [COLORS.damson, COLORS.taupe], sizes: sizes([0, 2, 3, 1, 1]),
    createdAt: "2026-08-02", sold: 64,
  },
  {
    id: 4, slug: "high-rise-pleated-trouser", name: "High-Rise Pleated Trouser",
    category: "skirts-trousers", collection: "Tailoring", price: 135, salePrice: null, badge: "Atelier",
    colors: [COLORS.taupe, COLORS.obsidian], sizes: sizes([3, 4, 4, 2, 2]),
    createdAt: "2026-09-28", sold: 98,
  },
  {
    id: 5, slug: "sculpted-cashmere-cardigan", name: "Sculpted Cashmere Cardigan",
    category: "tops", collection: "Knitwear", price: 190, salePrice: null, badge: null,
    colors: [COLORS.lilac], sizes: sizes([1, 3, 2, 2, 0]),
    createdAt: "2026-10-01", sold: 75,
  },
  {
    id: 6, slug: "silk-bias-cut-slip-skirt", name: "Silk Bias Cut Slip Skirt",
    category: "skirts-trousers", collection: "Pure Silk", price: 125, salePrice: null, badge: "New",
    colors: [COLORS.champagne, COLORS.lilac, COLORS.obsidian], sizes: sizes([2, 2, 2, 1, 1]),
    createdAt: "2026-10-18", sold: 40,
  },
  {
    id: 7, slug: "atelier-structured-shirt", name: "Atelier Structured Shirt",
    category: "tops", collection: "Shirting", price: 98, salePrice: null, badge: null,
    colors: [COLORS.ivory, COLORS.lilac], sizes: sizes([5, 5, 5, 4, 3]),
    createdAt: "2026-07-14", sold: 180,
  },
  {
    id: 8, slug: "draped-silk-chiffon-dress", name: "Draped Silk Chiffon Dress",
    category: "dresses", collection: "Seasonal Capsule", price: 160, salePrice: 112, badge: "Sale",
    colors: [COLORS.lilac, COLORS.taupe], sizes: sizes([1, 2, 0, 1, 0]),
    createdAt: "2026-06-30", sold: 150,
  },
  {
    id: 9, slug: "relaxed-double-breasted-blazer", name: "Relaxed Double-Breasted Blazer",
    category: "outerwear", collection: "Relaxed Suiting", price: 195, salePrice: null, badge: "Atelier",
    colors: [COLORS.olive, COLORS.obsidian], sizes: sizes([2, 3, 3, 2, 1]),
    createdAt: "2026-09-05", sold: 55,
  },
  {
    id: 10, slug: "high-neck-halter-dress", name: "High-Neck Halter Dress",
    category: "dresses", collection: "Evening", price: 155, salePrice: null, badge: null,
    colors: [COLORS.damson, COLORS.obsidian, COLORS.lilac], sizes: sizes([2, 3, 2, 2, 1]),
    createdAt: "2026-08-21", sold: 88,
  },
  {
    id: 11, slug: "refined-boatneck-knit", name: "Refined Boatneck Knit",
    category: "tops", collection: "Knitwear", price: 92, salePrice: null, badge: "New",
    colors: [COLORS.lilac, COLORS.obsidian], sizes: sizes([4, 4, 4, 3, 2]),
    createdAt: "2026-10-20", sold: 30,
  },
  {
    id: 12, slug: "fluid-wide-leg-trouser", name: "Fluid Wide-Leg Trouser",
    category: "skirts-trousers", collection: "Tailoring", price: 140, salePrice: null, badge: null,
    colors: [COLORS.damson, COLORS.ivory], sizes: sizes([3, 3, 3, 3, 2]),
    createdAt: "2026-09-12", sold: 132,
  },
  {
    id: 13, slug: "aura-linen-slip-dress", name: "Aura Linen Slip Dress",
    category: "dresses", collection: "Pure Belgian Linen", price: 160, salePrice: null, badge: null,
    colors: [COLORS.lilac, COLORS.obsidian], sizes: sizes([2, 4, 3, 2, 0]),
    createdAt: "2026-10-05", sold: 102,
  },
  {
    id: 14, slug: "sculpted-linen-midi-dress", name: "Sculpted Linen Midi Dress",
    category: "dresses", collection: "Normandy Flax", price: 185, salePrice: null, badge: "New",
    colors: [COLORS.ivory, COLORS.lilac], sizes: sizes([1, 3, 3, 1, 1]),
    createdAt: "2026-10-22", sold: 22,
  },
  {
    id: 15, slug: "linen-blend-wrap-jacket", name: "Linen Blend Wrap Jacket",
    category: "outerwear", collection: "Breathable Weave", price: 176, salePrice: 135, badge: "Sale",
    colors: [COLORS.olive, COLORS.ivory], sizes: sizes([0, 1, 2, 2, 1]),
    createdAt: "2026-05-18", sold: 70,
  },
  {
    id: 16, slug: "ribbed-cap-sleeve-corset-tee", name: "Ribbed Cap Sleeve Corset Tee",
    category: "tops", collection: "Elevated Basics", price: 54, salePrice: null, badge: null,
    colors: [COLORS.lilac, COLORS.obsidian, COLORS.ivory], sizes: sizes([6, 6, 5, 4, 3]),
    createdAt: "2026-09-01", sold: 240,
  },
].map((product) => ({
  image: null,
  description:
    "Cut from a fluid, tactile fabric with a quiet structure that holds its line. Finished with " +
    "delicate contrast details and designed to move from day to evening.",
  fabric: "Main: 100% natural fibre. Dry clean or gentle hand wash cold. Do not tumble dry.",
  ...product,
}));

export const PRICE_RANGE = { min: 0, max: 250 };

const categoryLabel = (slug) => CATEGORIES.find((c) => c.slug === slug)?.label ?? slug;
const effectivePrice = (p) => p.salePrice ?? p.price;
const totalStock = (p) => p.sizes.reduce((sum, s) => sum + s.stock, 0);

export function toListItem(product) {
  return {
    ...product,
    categoryLabel: categoryLabel(product.category),
    inStock: totalStock(product) > 0,
    stock: totalStock(product),
  };
}

const SORTERS = {
  newest: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  price_asc: (a, b) => effectivePrice(a) - effectivePrice(b),
  price_desc: (a, b) => effectivePrice(b) - effectivePrice(a),
  bestselling: (a, b) => b.sold - a.sold,
};

// Mirrors the planned GET /catalogue/products query parameters.
export function queryProducts({
  category, q, sizes: sizeFilter = [], colors = [], minPrice, maxPrice,
  inStock, collection, sort = "newest", page = 1, limit = 12,
} = {}) {
  let list = PRODUCTS.map(toListItem);

  if (category) list = list.filter((p) => p.category === category);
  if (collection === "new") list = list.filter((p) => p.badge === "New");
  if (collection === "sale") list = list.filter((p) => p.salePrice !== null);
  if (collection === "bestsellers") list = [...list].sort(SORTERS.bestselling).slice(0, 8);
  if (q) {
    const words = q.toLowerCase().split(/\s+/).filter(Boolean);
    list = list.filter((p) => {
      const text = `${p.name} ${p.collection} ${p.categoryLabel}`.toLowerCase();
      return words.some((word) => text.includes(word));
    });
  }
  if (sizeFilter.length) {
    list = list.filter((p) => p.sizes.some((s) => sizeFilter.includes(s.size) && s.stock > 0));
  }
  if (colors.length) list = list.filter((p) => p.colors.some((c) => colors.includes(c.name)));
  if (minPrice != null) list = list.filter((p) => effectivePrice(p) >= minPrice);
  if (maxPrice != null) list = list.filter((p) => effectivePrice(p) <= maxPrice);
  if (inStock) list = list.filter((p) => p.inStock);

  if (collection !== "bestsellers") list = [...list].sort(SORTERS[sort] ?? SORTERS.newest);

  const total = list.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit;

  return { items: list.slice(start, start + limit), total, page, totalPages };
}

export function findProduct(slug) {
  const product = PRODUCTS.find((p) => p.slug === slug);
  if (!product) return null;
  const related = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4)
    .map(toListItem);
  return { ...toListItem(product), related };
}

export function categoriesWithCounts() {
  return CATEGORIES.map((c) => ({
    ...c,
    count: PRODUCTS.filter((p) => p.category === c.slug).length,
  }));
}
