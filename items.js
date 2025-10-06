const { db, ref, get, set, update } = require("./firebase");

const ITEMS_REF = ref(db, "shop/items");

async function getItems() {
  const snapshot = await get(ITEMS_REF);
  if (snapshot.exists()) {
    return Object.values(snapshot.val());
  }
  return [];
}

async function addItem(name, emoji, price, description) {
  const newItem = { name, emoji, price, description };
  const itemRef = ref(db, `shop/items/${name.toLowerCase()}`);
  await set(itemRef, newItem);
}

async function removeItem(name) {
  const itemRef = ref(db, `shop/items/${name.toLowerCase()}`);
  await set(itemRef, null);
}

async function editItem(name, field, newValue) {
  const itemRef = ref(db, `shop/items/${name.toLowerCase()}`);
  const snapshot = await get(itemRef);
  if (!snapshot.exists()) return false;

  const item = snapshot.val();

  if (field === "price") {
    const parsed = parseInt(newValue);
    if (isNaN(parsed)) return false;
    item.price = parsed;
  } else {
    item[field] = newValue;
  }

  await update(itemRef, item);
  return true;
}

module.exports = { addItem, removeItem, getItems, editItem };
