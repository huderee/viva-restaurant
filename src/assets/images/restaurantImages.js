export { default as chef } from './chef.png';
export { default as diningArea1 } from './dining-area-1.jpg';
export { default as diningArea2 } from './dining-area-2.png';
export { default as english } from './english.png';
export { default as heroBg } from './hero-bg.jpg';
export { default as logo } from './logo.png';
export { default as mongolia } from './mongolia.jpg';
export { default as wineGlasses } from './wine-glasses.jpg';

export { default as diningHall } from './dining-area-2.png';
export { default as barLounge } from './dining-area-1.jpg';
export { default as loungeGarden } from './dining-area-2.png';
export { default as chefKitchen } from './chef.png';


import chef from './chef.png';
import diningArea1 from './dining-area-1.jpg';
import diningArea2 from './dining-area-2.png';
import heroBg from './hero-bg.jpg';
import logo from './logo.png';
import mongolia from './mongolia.jpg';
import wineGlasses from './wine-glasses.jpg';

export const RESTAURANT_IMAGES = {
  chef,
  diningArea1,
  diningArea2,
  heroBg,
  logo,
  mongolia,
  wineGlasses,
  // Aliases
  diningHall: diningArea2,
  barLounge: diningArea1,
  loungeGarden: diningArea2,
  chefKitchen: chef,
};