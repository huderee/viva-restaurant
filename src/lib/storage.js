// src/lib/storage.js

/**
 * LocalStorage-аас JSON өгөгдөл аюулгүй унших
 */
export const loadJSON = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    if (item === null) return defaultValue;
    return JSON.parse(item);
  } catch (error) {
    console.error(`loadJSON алдаа [${key}]:`, error);
    return defaultValue;
  }
};

/**
 * LocalStorage-д JSON өгөгдөл аюулгүй хадгалах.
 * Зай дүүрсэн (QuotaExceededError) үед console-д мэдэгдэнэ.
 */
export const saveJSON = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      console.warn(`saveJSON: localStorage дүүрсэн [${key}]. Хуучин өгөгдлийг цэвэрлэнэ үү.`);
    } else {
      console.error(`saveJSON алдаа [${key}]:`, error);
    }
  }
};

/**
 * LocalStorage-оос өгөгдөл устгах
 */
export const removeJSON = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`removeJSON алдаа [${key}]:`, error);
  }
};
