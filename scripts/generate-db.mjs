import fs from "fs";

const CATEGORIES = {
  men: { label: "Men", subcategories: ["T-Shirts", "Shirts", "Pants", "Shorts", "Jackets"] },
  women: { label: "Women", subcategories: ["Tops", "Dresses", "Skirts", "Pants", "Jackets"] },
  kid: { label: "Kids", subcategories: ["T-Shirts", "Shorts", "Dresses", "Sets"] },
  men_shoes: { label: "Men Shoes", subcategories: ["Casual", "Sports", "Formal", "Sandals"] },
  women_shoes: { label: "Women Shoes", subcategories: ["Heels", "Flats", "Boots", "Sandals", "Sports"] },
  jewelry: { label: "Jewelry", subcategories: ["Necklaces", "Earrings", "Bracelets", "Rings"] },
  hats: { label: "Hats", subcategories: ["Casual", "Beach", "Formal", "Winter"] },
  watches: { label: "Watches", subcategories: ["Analog", "Digital", "Smart", "Luxury"] },
};

const SIZES_CLOTHING = ["PP", "P", "M", "G", "GG"];
const SIZES_SHOES = ["35", "36", "37", "38", "39", "40", "41", "42", "43", "44"];
const SIZES_ONE = ["Unique"];

const COLORS = [
  { name: "Preto", hex: "#000000" },
  { name: "Branco", hex: "#FFFFFF" },
  { name: "Azul", hex: "#2563EB" },
  { name: "Vermelho", hex: "#DC2626" },
  { name: "Verde", hex: "#16A34A" },
  { name: "Rosa", hex: "#EC4899" },
  { name: "Cinza", hex: "#6B7280" },
  { name: "Marrom", hex: "#92400E" },
  { name: "Bege", hex: "#D4A574" },
  { name: "Roxo", hex: "#7C3AED" },
];

const CLOTHING_NAMES_BY_CATEGORY = {
  men: [
    "Classic Fit Cotton T-Shirt", "Slim Fit Oxford Shirt", "Casual Chino Pants", "Athletic Shorts", "Lightweight Bomber Jacket",
    "Striped Polo Shirt", "Denim Jacket", "Cargo Pants", "Linen Button-Up", "Performance Hoodie",
    "Graphic Print Tee", "Wool Blazer", "Slim Jeans", "Board Shorts", "Puffer Vest",
    "Henley Shirt", "Jogger Pants", "Corduroy Shirt", "Windbreaker Jacket", "Crewneck Sweatshirt",
  ],
  women: [
    "Floral Print Top", "Elegant Midi Dress", "High-Waist Skirt", "Slim Fit Trousers", "Tailored Blazer",
    "Off-Shoulder Blouse", "Maxi Dress", "Pleated Skirt", "Wide Leg Pants", "Leather Jacket",
    "Crop Top", "Bodycon Dress", "A-Line Skirt", "Palazzo Pants", "Denim Jacket",
    "Wrap Blouse", "Paperbag Shorts", "Trench Coat", "Knit Sweater", "Satin Camisole",
  ],
  kid: [
    "Fun Graphic Tee", "Denim Dungaree", "Cotton Shorts Set", "Princess Dress", "Sporty Hoodie",
    "Striped Polo", "Cargo Shorts", "Floral Sundress", "Zip-Up Jacket", "Track Pants",
    "Cartoon Print Tee", "Dungaree Dress", "Swim Trunks", "Cardigan", "Leggings",
  ],
  men_shoes: [
    "Leather Sneakers", "Running Shoes", "Oxford Dress Shoes", "Canvas Slip-Ons", "Hiking Boots",
    "Casual Loafers", "Basketball Shoes", "Desert Boots", "Flip Flops", "Trail Runners",
    "Chelsea Boots", "Tennis Shoes", "Espadrilles", "Winter Boots", "Skate Shoes",
  ],
  women_shoes: [
    "Stiletto Heels", "Ballet Flats", "Ankle Boots", "Wedge Sandals", "Platform Sneakers",
    "Strappy Sandals", "Knee-High Boots", "Pointed Flats", "Espadrille Wedges", "Block Heels",
    "Mules", "Lace-Up Boots", "Slides", "Mary Janes", "Loafers",
  ],
  jewelry: [
    "Gold Chain Necklace", "Pearl Earrings", "Silver Bangle", "Diamond Ring", "Layered Necklace",
    "Hoop Earrings", "Leather Bracelet", "Statement Ring", "Pendant Necklace", "Cuff Bracelet",
    "Choker Necklace", "Stud Earrings", "Beaded Anklet", "Signet Ring", "Tennis Bracelet",
  ],
  hats: [
    "Baseball Cap", "Straw Sun Hat", "Fedora Hat", "Beanie", "Bucket Hat",
    "Visor", "Beret", "Panama Hat", "Trapper Hat", "Newsboy Cap",
    "Snapback", "Wide Brim Hat", "Trucker Cap", "Cloche Hat", "Boater Hat",
  ],
  watches: [
    "Classic Leather Watch", "Digital Sports Watch", "Smart Fitness Watch", "Luxury Gold Watch", "Minimalist Watch",
    "Chronograph Watch", "Diver Watch", "Fashion Quartz", "Military Field Watch", "Dress Watch",
    "Skeleton Watch", "Smart Watch Pro", "Vintage Mechanical", "Moon Phase Watch", "GPS Sport Watch",
  ],
};

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const allProducts = [];
let id = 1;

for (const [catKey, catInfo] of Object.entries(CATEGORIES)) {
  const names = CLOTHING_NAMES_BY_CATEGORY[catKey];
  const isClothing = ["men", "women", "kid"].includes(catKey);
  const isShoes = catKey.endsWith("_shoes");
  const sizes = isShoes ? SIZES_SHOES : isClothing ? SIZES_CLOTHING : SIZES_ONE;
  const numColors = randomInt(2, 5);

  for (const name of names) {
    const selectedColors = [...COLORS].sort(() => Math.random() - 0.5).slice(0, numColors);
    const basePrice = isShoes ? randomInt(89, 499) : isClothing ? randomInt(29, 299) : randomInt(19, 599);
    const hasSale = Math.random() > 0.6;
    const salePrice = hasSale ? Math.round(basePrice * (randomInt(50, 80) / 100)) : undefined;
    const rating = randomInt(30, 50) / 10;
    const tags = ["new"];
    if (hasSale) tags.push("sale");
    if (rating >= 4.5) tags.push("bestseller");

    const variants = [];
    for (const color of selectedColors) {
      for (const size of sizes) {
        if (Math.random() > 0.15) {
          variants.push({
            size,
            color: color.name,
            colorHex: color.hex,
            sku: `${catKey.slice(0, 3).toUpperCase()}-${String(id).padStart(3, "0")}-${size}-${color.name.slice(0, 3).toUpperCase()}`,
            stock: randomInt(0, 50),
          });
        }
      }
    }

    if (variants.length === 0) continue;

    const imgId = randomInt(1, 1000);
    const countImages = randomInt(2, 4);

    allProducts.push({
      id,
      name,
      category: catKey,
      subcategory: pick(catInfo.subcategories),
      description: `Premium quality ${name.toLowerCase()} – perfect for any occasion. Crafted with care for maximum comfort and style.`,
      images: Array.from({ length: countImages }, (_, i) =>
        `https://picsum.photos/seed/${catKey}${id}${i}/600/700`
      ),
      variants,
      basePrice,
      salePrice,
      rating,
      reviewsCount: randomInt(10, 500),
      tags,
      createdAt: new Date(
        Date.now() - randomInt(1, 90) * 86400000
      ).toISOString().split("T")[0],
    });

    id++;
  }
}

const db = {
  allproducts: allProducts,
  popularinwomen: allProducts.filter((p) => p.category === "women").slice(0, 8),
  newcollections: allProducts.slice(-12).reverse(),
};

fs.writeFileSync("db.json", JSON.stringify(db, null, 2));
console.log(`Generated ${allProducts.length} products → db.json`);
