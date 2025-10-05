const fs = require('fs');
const ITEMS_FILE = './items.json';

let items = [];
if (fs.existsSync(ITEMS_FILE)) {
  items = JSON.parse(fs.readFileSync(ITEMS_FILE));
}

function saveItems() {
  fs.writeFileSync(ITEMS_FILE, JSON.stringify(items, null, 2));
}

function addItem(name, emoji, price, description) {
  items.push({ name, emoji, price, description });
  saveItems();
}

function removeItem(name) {
  items = items.filter(i => i.name.toLowerCase() !== name.toLowerCase());
  saveItems();
}

function getItems() {
  return items;
}

function editItem(name, field, newValue) {
  const item = items.find(i => i.name.toLowerCase() === name.toLowerCase());
  if (!item) return false;

  if (field === 'price') {
    const parsed = parseInt(newValue);
    if (isNaN(parsed)) return false;
    item.price = parsed;
  } else {
    item[field] = newValue;
  }

  saveItems();
  return true;
}

module.exports = { addItem, removeItem, getItems, editItem };
