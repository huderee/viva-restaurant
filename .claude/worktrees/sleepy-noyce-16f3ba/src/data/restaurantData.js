// src/data/restaurantData.js

export const menuItems = [
  {
    id: 1,
    name: "Классик бургер",
    description: "Шинэхэн үхрийн мах, бяслаг, ногоотой амтат бургер",
    price: 12000,
    category: "Үндсэн хоол",
    isFeatured: true,
    isPopular: true,
    imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80",
    isVegetarian: false, isSpicy: false, prepTime: "15 мин", calories: "650 кал",
  },
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
    id: 3,
    name: "Дээд зэрэглэлийн стейк",
    description: "Дээд зэргийн чанартай үхрийн мах, төмсний нухаш, амтат соустай",
    price: 29000,
    category: "Үндсэн хоол",
    isFeatured: true,
    isPopular: true,
    imageUrl: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&q=80",
    isChefSpecial: true, isVegetarian: false, isSpicy: false, prepTime: "25 мин", calories: "750 кал",
  },
  {
  id: 4,
  name: "Карбонара паста",
  description: "Итали загварын өндөг, гахайн утсан мах (бекон), пармезан бяслагтай паста",
  price: 15000,
  category: "Үндсэн хоол",
  isFeatured: false,
  imageUrl: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=800&q=80",
  isVegetarian: false, isSpicy: false, prepTime: "18 мин", calories: "620 кал",
},
  {
    id: 5,
    name: "Цезарь салат",
    description: "Шинэхэн салат навч, тахианы мах, Пармезан бяслаг, Цезарь соустай",
    price: 10000,
    category: "Салат",
    isFeatured: false,
    imageUrl: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800&q=80",
    isHealthy: true, isVegetarian: false, isSpicy: false, prepTime: "10 мин", calories: "320 кал",
  },
  {
    id: 6,
    name: "Тирамису",
    description: "Италийн сонгодог амттан, кофе, маскарпоне бяслагтай",
    price: 9500,
    category: "Амттан",
    isFeatured: false,
    isNew: true,
    isPopular: true,
    imageUrl: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&q=80",
    isVegetarian: true, isSpicy: false, prepTime: "5 мин", calories: "450 кал",
  },
  {
    id: 7,
    name: "Суши сет",
    description: "12 ширхэг суши, васаби, имбирь, соустай",
    price: 35000,
    category: "Суши",
    isFeatured: false,
    imageUrl: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&q=80",
    isVegetarian: false, isSpicy: false, prepTime: "30 мин", calories: "580 кал",
  },
  {
    id: 8,
    name: "Өдрийн шөл",
    description: "Өдөр бүр шинээр бэлтгэсэн үхрийн махтай бүлээн шөл",
    price: 7000,
    category: "Шөл",
    isFeatured: false,
    imageUrl: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80",
    isHealthy: true, isVegetarian: false, isSpicy: false, prepTime: "12 мин", calories: "280 кал",
  },
  {
    id: 9,
    name: "Шинэ шүүс",
    description: "Шинээр шүүсэлсэн алим, лууван, жүржийн шүүс",
    price: 5000,
    category: "Ундаа",
    isFeatured: false,
    imageUrl: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=800&q=80",
    isHealthy: true, isVegetarian: true, isSpicy: false, prepTime: "5 мин", calories: "120 кал",
  },
  {
    id: 10,
    name: "Кофе латте",
    description: "Шинэхэн эспрессо кофе, сүүтэй",
    price: 6000,
    category: "Ундаа",
    isFeatured: false,
    imageUrl: "https://images.unsplash.com/photo-1561047029-3000c68339ca?w=800&q=80",
    isVegetarian: true, isSpicy: false, prepTime: "7 мин", calories: "150 кал",
  },
  {
    id: 11,
    name: "Монгол бууз",
    description: "Уламжлалт Монгол бууз (8 ширхэг)",
    price: 11000,
    category: "Үндсэн хоол",
    isFeatured: false,
    imageUrl: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&q=80",
    isLocalSpecial: true, isVegetarian: false, isSpicy: false, prepTime: "25 мин", calories: "480 кал",
  },
  {
    id: 12,
    name: "Чеддар чизкейк",
    description: "Америк загварын чеддар бяслагтай чизкейк",
    price: 8500,
    category: "Амттан",
    isFeatured: false,
    imageUrl: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=800&q=80",
    isVegetarian: true, isSpicy: false, prepTime: "5 мин", calories: "520 кал",
  },
];

export const categories = [
  { id: 1, name: "Бүгд",        icon: "🍲", color: "bg-amber-500/10",   iconColor: "text-amber-600",  description: "Цэсний бүх хоол" },
  { id: 2, name: "Үндсэн хоол", icon: "🥩", color: "bg-orange-500/10",  iconColor: "text-orange-500", description: "Үндсэн хоолны сонголтууд" },
  { id: 3, name: "Салат",       icon: "🥗", color: "bg-emerald-500/10", iconColor: "text-emerald-500",description: "Эрүүл, шинэхэн салатууд" },
  { id: 4, name: "Амттан",      icon: "🍰", color: "bg-pink-500/10",    iconColor: "text-pink-500",   isNew: true, description: "Төрөл бүрийн амттан" },
  { id: 5, name: "Шөл",         icon: "🥣", color: "bg-red-500/10",     iconColor: "text-red-500",    description: "Халуун, бүлээн шөл" },
  { id: 6, name: "Пицца",       icon: "🍕", color: "bg-amber-500/10",   iconColor: "text-amber-500",  description: "Итали, Америк пицца" },
  { id: 7, name: "Суши",        icon: "🍣", color: "bg-blue-500/10",    iconColor: "text-blue-500",   description: "Японы уламжлалт суши" },
  { id: 8, name: "Ундаа",       icon: "🥤", color: "bg-purple-500/10",  iconColor: "text-purple-500", description: "Халуун, хүйтэн ундаа" },
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

export const calculateTotal = (cart) => cart.reduce((sum, it) => sum + it.price * (it.quantity || 0), 0);

export const restaurantInfo = {
  name: "HuuK Restaurant",
  slogan: "Танд зориулсан дээд зэрэглэлийн амт",
  description: "Монголын шилдэг амттай хоолнууд таныг хүлээж байна. Дэлхийн соёлыг нэгтгэсэн онцгой амт, үйлчилгээгээрээ та бүхэнд хүргэдэг.",
  address: "Ховд аймаг, Жаргалант сум, Жаргалан баг",
  phone: "+976 8529-2577",
  email: "info@huukool.mn",
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
  { question: "Хэрхэн ширээ захиалах вэ?",   answer: "Манай вэбсайтаар онлайн захиалга хийх эсвэл утсаар холбогдон захиалга өгч болно." },
  { question: "Төлбөр төлөх аргууд?",         answer: "Бэлэн мөнгө, бүх төрлийн картаар, болон банкны шилжүүлгээр төлбөр хийх боломжтой." },
  { question: "Тусгай хоолны сонголт байгаа юу?", answer: "Тийм ээ, веган, вегетариан, глютенгүй зэрэг тусгай хоолны дэглэмийг хангаж болно." },
  { question: "Хөнгөлөлттэй багц бий юу?",   answer: "Тийм ээ, 5-аас дээш хүний захиалгад 10%, 10-аас дээш хүнд 15% хөнгөлөлт үзүүлнэ." },
];