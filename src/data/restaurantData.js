// src/data/restaurantData.js
// Зургийн эх сурвалж: unsplash.com (нээлттэй лиценз)

export const menuItems = [
  // ── Бургер ──────────────────────────────────────────────────────────────────
  {
    id: 1,
    name: "Классик бургер",
    description: "Шинэхэн үхрийн мах, бяслаг, ногоотой амтат бургер",
    price: 12000,
    category: "Бургер",
    isFeatured: true,
    isPopular: true,
    imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80",
    isVegetarian: false, isSpicy: false, prepTime: "15 мин", calories: "650 кал",
  },
  {
    id: 15,
    name: "Давхар бургер",
    description: "Хоёр давхар үхрийн мах, бяслаг, бекон, шинэхэн ногоотой тусгай бургер",
    price: 16500,
    category: "Бургер",
    isFeatured: true,
    isNew: true,
    isChefSpecial: true,
    imageUrl: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=800&q=80",
    isVegetarian: false, isSpicy: false, prepTime: "18 мин", calories: "820 кал",
  },

  // ── Үндсэн хоол ─────────────────────────────────────────────────────────────
  {
    id: 3,
    name: "Дээд зэрэглэлийн стейк",
    description: "Дээд зэргийн чанартай үхрийн мах, төмсний нухаш, амтат соустай",
    price: 29000,
    category: "Үндсэн хоол",
    isFeatured: true,
    isPopular: true,
    isChefSpecial: true,
    imageUrl: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&q=80",
    isVegetarian: false, isSpicy: false, prepTime: "25 мин", calories: "750 кал",
  },
  {
    id: 4,
    name: "Карбонара паста",
    description: "Итали загварын өндөг, гахайн утсан мах, пармезан бяслагтай паста",
    price: 15000,
    category: "Үндсэн хоол",
    imageUrl: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=800&q=80",
    isVegetarian: false, isSpicy: false, prepTime: "18 мин", calories: "620 кал",
  },
  {
    id: 11,
    name: "Монгол бууз",
    description: "Уламжлалт Монгол бууз (8 ширхэг), шарсан сонгинотой",
    price: 11000,
    category: "Үндсэн хоол",
    isPopular: true,
    imageUrl: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&q=80",
    isLocalSpecial: true, isVegetarian: false, isSpicy: false, prepTime: "25 мин", calories: "480 кал",
  },
  {
    id: 13,
    name: "Цуйван",
    description: "Гар нооделтой уламжлалт монгол цуйван, шарсан мах, ногоотой",
    price: 15000,
    category: "Үндсэн хоол",
    isFeatured: true,
    isPopular: true,
    imageUrl: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&q=80",
    isLocalSpecial: true, isVegetarian: false, isSpicy: false, prepTime: "20 мин", calories: "520 кал",
  },
  {
    id: 14,
    name: "Хуурга",
    description: "Шинэхэн мах, хүнс ногооны шарсан хуурга, будаатай",
    price: 14000,
    category: "Үндсэн хоол",
    isPopular: true,
    imageUrl: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&q=80",
    isLocalSpecial: true, isVegetarian: false, isSpicy: false, prepTime: "15 мин", calories: "490 кал",
  },
  {
    id: 24,
    name: "Тахианы стейк",
    description: "Шарсан тахианы стейк, нухаш, ногоотой хажуу хоолтой",
    price: 19000,
    category: "Үндсэн хоол",
    isPopular: true,
    imageUrl: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=800&q=80",
    isVegetarian: false, isSpicy: false, prepTime: "20 мин", calories: "540 кал",
  },

  // ── Пицца ───────────────────────────────────────────────────────────────────
  {
    id: 2,
    name: "Итали пицца",
    description: "Гар хийцийн пицца, моцарелла бяслаг, шинэхэн орцтой",
    price: 18000,
    category: "Пицца",
    isFeatured: true,
    imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80",
    isVegetarian: true, isSpicy: false, prepTime: "20 мин", calories: "850 кал",
  },
  {
    id: 18,
    name: "Пицца Маргарита",
    description: "Класик итали пицца — помидорын соус, моцарелла бяслаг, шинэ базилик",
    price: 18000,
    category: "Пицца",
    isPopular: true,
    imageUrl: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80",
    isVegetarian: true, isSpicy: false, prepTime: "22 мин", calories: "780 кал",
  },
  {
    id: 25,
    name: "Пицца Пепперони",
    description: "Пепперони хиам, моцарелла бяслаг, помидорын соустай хурц пицца",
    price: 21000,
    category: "Пицца",
    isPopular: true,
    imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80",
    isVegetarian: false, isSpicy: true, prepTime: "22 мин", calories: "890 кал",
  },

  // ── Салат ───────────────────────────────────────────────────────────────────
  {
    id: 5,
    name: "Цезарь салат",
    description: "Шинэхэн салат навч, тахианы мах, Пармезан бяслаг, Цезарь соустай",
    price: 10000,
    category: "Салат",
    imageUrl: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800&q=80",
    isHealthy: true, isVegetarian: false, isSpicy: false, prepTime: "10 мин", calories: "320 кал",
  },
  {
    id: 16,
    name: "Ногооны салат",
    description: "Свежий ногооны салат — помидор, өргөст хэмх, чинжүү, ногооны соустай",
    price: 8000,
    category: "Салат",
    imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80",
    isHealthy: true, isVegetarian: true, isSpicy: false, prepTime: "8 мин", calories: "180 кал",
  },
  {
    id: 21,
    name: "Хүлэмжийн салат",
    description: "Руккола, авокадо, чинжүү, лимоны соус, хатаасан жүрж",
    price: 11000,
    category: "Салат",
    isNew: true,
    isHealthy: true,
    imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&q=80",
    isVegetarian: true, isSpicy: false, prepTime: "10 мин", calories: "210 кал",
  },

  // ── Суши ────────────────────────────────────────────────────────────────────
  {
    id: 7,
    name: "Суши сет",
    description: "12 ширхэг суши, васаби, имбирь, соустай",
    price: 35000,
    category: "Суши",
    imageUrl: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&q=80",
    isVegetarian: false, isSpicy: false, prepTime: "30 мин", calories: "580 кал",
  },
  {
    id: 22,
    name: "Том суши сет",
    description: "24 ширхэг суши — лосось, тун, хэсэг, васаби, имбирь",
    price: 48000,
    category: "Суши",
    isFeatured: true,
    isChefSpecial: true,
    imageUrl: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=800&q=80",
    isVegetarian: false, isSpicy: false, prepTime: "35 мин", calories: "680 кал",
  },

  // ── Шөл ─────────────────────────────────────────────────────────────────────
  {
    id: 8,
    name: "Өдрийн шөл",
    description: "Өдөр бүр шинээр бэлтгэсэн үхрийн махтай бүлээн шөл",
    price: 7000,
    category: "Шөл",
    imageUrl: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80",
    isHealthy: true, isVegetarian: false, isSpicy: false, prepTime: "12 мин", calories: "280 кал",
  },
  {
    id: 17,
    name: "Өвлийн шөл",
    description: "Гурилтай, хоолойтой, нарийн ногоотой дулаан шөл",
    price: 9000,
    category: "Шөл",
    isPopular: true,
    imageUrl: "https://images.unsplash.com/photo-1548943487-a2e4e43b4853?w=800&q=80",
    isHealthy: true, isVegetarian: false, isSpicy: false, prepTime: "15 мин", calories: "310 кал",
  },

  // ── Амттан ──────────────────────────────────────────────────────────────────
  {
    id: 6,
    name: "Тирамису",
    description: "Италийн сонгодог амттан, кофе, маскарпоне бяслагтай",
    price: 9500,
    category: "Амттан",
    isNew: true,
    isPopular: true,
    imageUrl: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&q=80",
    isVegetarian: true, isSpicy: false, prepTime: "5 мин", calories: "450 кал",
  },
  {
    id: 12,
    name: "Чеддар чизкейк",
    description: "Америк загварын чеддар бяслагтай чизкейк",
    price: 8500,
    category: "Амттан",
    imageUrl: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=800&q=80",
    isVegetarian: true, isSpicy: false, prepTime: "5 мин", calories: "520 кал",
  },
  {
    id: 19,
    name: "Шоколадны бялуу",
    description: "Зөөлөн шоколадны бялуу, ванилийн мороженоетой",
    price: 7000,
    category: "Амттан",
    isNew: true,
    imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80",
    isVegetarian: true, isSpicy: false, prepTime: "5 мин", calories: "480 кал",
  },

  // ── Ундаа ───────────────────────────────────────────────────────────────────
  {
    id: 9,
    name: "Шинэ шүүс",
    description: "Шинээр шүүсэлсэн жүрж, алим, лимоны шүүс",
    price: 5000,
    category: "Ундаа",
    imageUrl: "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=800&q=80",
    isHealthy: true, isVegetarian: true, isSpicy: false, prepTime: "5 мин", calories: "120 кал",
  },
  {
    id: 10,
    name: "Кофе латте",
    description: "Шинэхэн эспрессо кофе, хөөсөрсөн сүүтэй",
    price: 6000,
    category: "Ундаа",
    imageUrl: "https://images.unsplash.com/photo-1561047029-3000c68339ca?w=800&q=80",
    isVegetarian: true, isSpicy: false, prepTime: "7 мин", calories: "150 кал",
  },
  {
    id: 20,
    name: "Кока-Кола",
    description: "Хүйтэн Coca-Cola 500мл, мөс, лимонтой",
    price: 3500,
    category: "Ундаа",
    imageUrl: "https://images.unsplash.com/photo-1567103472667-6898f3a79cf2?w=800&q=80",
    isVegetarian: true, isSpicy: false, prepTime: "2 мин", calories: "210 кал",
  },
  {
    id: 23,
    name: "Капучино",
    description: "Хоёр давхар эспрессо, хөөсөрсөн сүүтэй сонгодог капучино",
    price: 6500,
    category: "Ундаа",
    imageUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80",
    isVegetarian: true, isSpicy: false, prepTime: "7 мин", calories: "130 кал",
  },
  {
    id: 26,
    name: "Манго шейк",
    description: "Тропик манго, тос, бал, ванилийн мороженоетой зузаан шейк",
    price: 7500,
    category: "Ундаа",
    isNew: true,
    imageUrl: "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=800&q=80",
    isVegetarian: true, isSpicy: false, prepTime: "5 мин", calories: "340 кал",
  },
];

export const categories = [
  { id: 1, name: "Бүгд",        icon: "🍲", color: "bg-amber-500/10",   iconColor: "text-amber-600",  description: "Цэсний бүх хоол" },
  { id: 2, name: "Үндсэн хоол", icon: "🥩", color: "bg-orange-500/10",  iconColor: "text-orange-500", description: "Үндсэн хоолны сонголтууд" },
  { id: 3, name: "Бургер",      icon: "🍔", color: "bg-yellow-500/10",  iconColor: "text-yellow-600", description: "Бургер, сэндвич" },
  { id: 4, name: "Салат",       icon: "🥗", color: "bg-emerald-500/10", iconColor: "text-emerald-500",description: "Эрүүл, шинэхэн салатууд" },
  { id: 5, name: "Амттан",      icon: "🍰", color: "bg-pink-500/10",    iconColor: "text-pink-500",   description: "Төрөл бүрийн амттан" },
  { id: 6, name: "Шөл",         icon: "🥣", color: "bg-red-500/10",     iconColor: "text-red-500",    description: "Халуун, бүлээн шөл" },
  { id: 7, name: "Пицца",       icon: "🍕", color: "bg-amber-500/10",   iconColor: "text-amber-500",  description: "Итали, Америк пицца" },
  { id: 8, name: "Суши",        icon: "🍣", color: "bg-blue-500/10",    iconColor: "text-blue-500",   description: "Японы уламжлалт суши" },
  { id: 9, name: "Ундаа",       icon: "🥤", color: "bg-purple-500/10",  iconColor: "text-purple-500", description: "Халуун, хүйтэн ундаа" },
];

export const featuredItems     = menuItems.filter((item) => item.isFeatured);
export const newItems          = menuItems.filter((item) => item.isNew);
export const healthyItems      = menuItems.filter((item) => item.isHealthy);
export const chefSpecialItems  = menuItems.filter((item) => item.isChefSpecial);
export const localSpecialItems = menuItems.filter((item) => item.isLocalSpecial);

export const getItemsByCategory = (categoryName) =>
  categoryName === "Бүгд" ? menuItems : menuItems.filter((item) => item.category === categoryName);

export const sortItemsByPrice = (items, order = "asc") =>
  [...items].sort((a, b) => (order === "asc" ? a.price - b.price : b.price - a.price));

export const filterItems = ({ category, minPrice, maxPrice, isVegetarian, isSpicy }) => {
  let filtered = menuItems;
  if (category && category !== "Бүгд") filtered = filtered.filter((i) => i.category === category);
  if (minPrice !== undefined && minPrice !== null && minPrice !== "") filtered = filtered.filter((i) => i.price >= Number(minPrice));
  if (maxPrice !== undefined && maxPrice !== null && maxPrice !== "") filtered = filtered.filter((i) => i.price <= Number(maxPrice));
  if (isVegetarian) filtered = filtered.filter((i) => i.isVegetarian);
  if (isSpicy)      filtered = filtered.filter((i) => i.isSpicy);
  return filtered;
};

export const addToCart = (cart, item) => {
  const existing = cart.find((c) => c.id === item.id);
  if (existing) return cart.map((c) => c.id === item.id ? { ...c, quantity: (c.quantity || 0) + 1 } : c);
  return [...cart, { ...item, quantity: 1 }];
};

export const removeFromCart = (cart, itemId) => cart.filter((c) => c.id !== itemId);
export const calculateTotal  = (cart) => cart.reduce((sum, it) => sum + it.price * (it.quantity || 0), 0);

export const restaurantInfo = {
  name: "Viva Restaurant",
  slogan: "Танд зориулсан дээд зэрэглэлийн амт",
  description: "Монголын шилдэг амттай хоолнууд таныг хүлээж байна. Дэлхийн соёлыг нэгтгэсэн онцгой амт, үйлчилгээгээрээ та бүхэнд хүргэдэг.",
  address: "Ховд аймаг, Жаргалант сум, Жаргалан баг",
  phone: "+976 8529-2577",
  email: "info@vivarestaurant.mn",
  openingHours: { weekday: "10:00 - 23:00", weekend: "10:00 - 00:00" },
  socialMedia: {
    facebook:  "https://www.facebook.com/huderee0211",
    instagram: "https://www.instagram.com/huderree/",
    twitter:   "https://twitter.com/huukrestaurant",
    youtube:   "https://www.youtube.com/@Huuhdeereeboy",
  },
  features: ["Мэргэжлийн тогооч", "Шинэхэн, чанартай орц", "Шагналт ресторан", "Хурдан, чанартай үйлчилгээ", "Тав тухтай орчин", "Эрүүл ахуйн стандарт", "Эко-найрсаг", "Олон улсын хоолны цэс"],
  stats: { years: "4+", customers: "50,000+", dishes: "100+" },
};

export const reservationRules = [
  "10-аас дээш хүний бүлгийн захиалгад урьдчилан холбогдоно уу.",
  "Захиалгыг 24 цагийн өмнө цуцлах боломжтой.",
  "Захиалсан цагаас хойш 15 минут хүлээх бөгөөд дараа нь захиалга цуцлагдана.",
  "Бага насны хүүхэдтэй бол урьдчилан мэдэгдэнэ үү.",
  "Тусгай хоолны дэглэм эсвэл харшилтай бол захиалгын тайлбарт бичнэ үү.",
];

export const workingHours = [
  { day: "Даваа – Баасан", hours: "10:00 – 23:00" },
  { day: "Бямба – Ням",    hours: "10:00 – 00:00" },
];

export const faqs = [
  { question: "Хэрхэн ширээ захиалах вэ?",        answer: "Манай вэбсайтаар онлайн захиалга хийх эсвэл утсаар холбогдон захиалга өгч болно." },
  { question: "Төлбөр төлөх аргууд?",              answer: "Бэлэн мөнгө, бүх төрлийн картаар, болон банкны шилжүүлгээр төлбөр хийх боломжтой." },
  { question: "Тусгай хоолны сонголт байгаа юу?",  answer: "Тийм ээ, веган, вегетариан, глютенгүй зэрэг тусгай хоолны дэглэмийг хангаж болно." },
  { question: "Хөнгөлөлттэй багц бий юу?",         answer: "Тийм ээ, 5-аас дээш хүний захиалгад 10%, 10-аас дээш хүнд 15% хөнгөлөлт үзүүлнэ." },
];
