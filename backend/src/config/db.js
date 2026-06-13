
const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');
const path = require('path');

const file = path.join(__dirname, '../../db.json');
const adapter = new JSONFile(file);
const db = new Low(adapter, {
  users: [],
  products: [],
  bills: [],
  billItems: [],
  stockMovements: []
});

const initDb = async () => {
  await db.read();
  if (!db.data) {
    db.data = {
      users: [],
      products: [],
      bills: [],
      billItems: [],
      stockMovements: []
    };
    await db.write();
  }
  return db;
};

module.exports = { db, initDb };
