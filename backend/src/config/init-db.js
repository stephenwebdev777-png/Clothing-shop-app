
const { db, initDb } = require('./db');
const bcrypt = require('bcrypt');

const initDatabase = async () => {
  try {
    await initDb();

    const existingUser = db.data.users.find(u => u.email === 'owner@shop.com');
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash('owner123', 10);
      const newUser = {
        id: Date.now(),
        name: 'Shop Owner',
        email: 'owner@shop.com',
        password: hashedPassword,
        role: 'OWNER',
        createdAt: new Date().toISOString()
      };
      db.data.users.push(newUser);
      await db.write();
    }

    console.log('Database initialized successfully!');
    console.log('Default login:');
    console.log('Email: owner@shop.com');
    console.log('Password: owner123');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

initDatabase();
