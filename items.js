const fs = require('fs');
const ITEMS_FILE = './items.json';

let items = [];
if (fs.existsSync(ITEMS_FILE)) {
  items = JSON.parse(fs.readFileSync(ITEMS_FILE));
}

function saveItems() {
  fs.writeFileSync(ITEMS_FILE, JSON.stringify(items, null, 2));
}

function addItem(name, price, description) {
  items.push({ name, price, description });
  saveItems();
}

function removeItem(name) {
  items = items.filter(i => i.name.toLowerCase() !== name.toLowerCase());
  saveItems();
}

function getItems() {
  return items;
}

module.exports = { addItem, removeItem, getItems };
