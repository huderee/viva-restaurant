// src/lib/storage.js

/**
 * LocalStorage-аас JSON өгөгдөл унших
 * @param {string} key - localStorage түлхүүр
 * @param {*} defaultValue - өгөгдөл олдохгүй үед буцаах утга
 */
export const loadJSON = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    if (item === null) return defaultValue;
    return JSON.parse(item);
  } catch (error) {
    console.error(`loadJSON error [${key}]:`, error);
    return defaultValue;
  }
};

/**
 * LocalStorage-д JSON өгөгдөл хадгалах
 * @param {string} key - localStorage түлхүүр
 * @param {*} value - хадгалах утга
 */
export const saveJSON = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`saveJSON error [${key}]:`, error);
  }
};

/**
 * LocalStorage-оос өгөгдөл устгах
 * @param {string} key - localStorage түлхүүр
 */
export const removeJSON = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`removeJSON error [${key}]:`, error);
  }
};