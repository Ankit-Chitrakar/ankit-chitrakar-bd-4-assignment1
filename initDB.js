const connectDB = require('./connectDB');
const restaurants = require('./restaurants');
const dishes = require('./dishes');

async function initDB() {
  const db = await connectDB();

  // Create restaurants table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS restaurants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      cuisine TEXT,
      isVeg TEXT,
      rating REAL,
      priceForTwo INTEGER,
      location TEXT,
      hasOutdoorSeating TEXT,
      isLuxury TEXT
    )
  `);

  // Create dishes table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS dishes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      isVeg TEXT,
      rating REAL,
      price INTEGER
    )
  `);

  // Prepare to insert restaurants
  const stmt1 = await db.prepare(
    'INSERT INTO restaurants (name, cuisine, isVeg, rating, priceForTwo, location, hasOutdoorSeating, isLuxury) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  );

  // Prepare to insert dishes
  const stmt2 = await db.prepare(
    'INSERT INTO dishes (name, isVeg, rating, price) VALUES (?, ?, ?, ?)'
  );

  // Insert restaurant data
  for (let restaurant of restaurants) {
    await stmt1.run(
      restaurant.name,
      restaurant.cuisine,
      restaurant.isVeg,
      restaurant.rating,
      restaurant.priceForTwo,
      restaurant.location,
      restaurant.hasOutdoorSeating,
      restaurant.isLuxury
    );
  }

  // Insert dish data
  for (let dish of dishes) {
    await stmt2.run(dish.name, dish.isVeg, dish.rating, dish.price);
  }

  await stmt1.finalize();
  await stmt2.finalize();
  console.log('Inserted restaurants and dishes into the database.');
  await db.close();
}

// Initialize the database
initDB().catch((err) => {
  console.error('Error initializing the database:', err.message);
});
