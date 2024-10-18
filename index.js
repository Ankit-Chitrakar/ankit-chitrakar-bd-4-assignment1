const express = require('express');
const { resolve } = require('path');
const cors = require('cors');
const connectDB = require('./connectDB.js');

const app = express();
const port = 3000;

app.use(express.static('static'));
app.use(cors());
app.use(express.json());

let db;

(async () => {
  db = await connectDB();
})();

// Exercise 1: Get All Restaurants
app.get('/restaurants', async (req, res) => {
  try {
    let query = 'SELECT * FROM restaurants';
    let restaurants = await db.all(query, []);

    if (restaurants.length === 0) {
      return res.status(404).json({ restaurants: `No resturants found!` });
    }

    res.status(200).json({ restaurants: restaurants });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Exercise 2: Get Restaurant by ID
app.get('/restaurants/details/:id', async (req, res) => {
  let id = parseInt(req.params.id);
  try {
    let query = 'SELECT * FROM restaurants WHERE id = ?';
    let restaurants = await db.all(query, [id]);

    if (restaurants.length === 0) {
      return res
        .status(404)
        .json({ restaurants: `No resturants found with id ${id}!` });
    }

    res.status(200).json({ restaurants: restaurants });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Exercise 3: Get Restaurants by Cuisine
app.get('/restaurants/cuisine/:cuisine', async (req, res) => {
  let cuisine = req.params.cuisine;
  try {
    let query = 'SELECT * FROM restaurants WHERE cuisine = ?';
    let restaurants = await db.all(query, [cuisine]);

    if (restaurants.length === 0) {
      return res
        .status(404)
        .json({ restaurants: `No resturants found of ${cuisine} cuisine!` });
    }

    res.status(200).json({ restaurants: restaurants });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Exercise 4: Get Restaurants by Filter
app.get('/restaurants/filter', async (req, res) => {
  let isVeg = req.query.isVeg;
  let hasOutdoorSeating = req.query.hasOutdoorSeating;
  let isLuxury = req.query.isLuxury;

  try {
    let query = 'SELECT * FROM restaurants WHERE 1=1';
    let params = [];

    // veg or non veg
    if (isVeg === 'true') {
      query += ' AND isVeg = ?';
      params.push('true');
    } else if (isVeg === 'false') {
      query += ' AND isVeg = ?';
      params.push('false');
    }

    // outdoor seating
    if (hasOutdoorSeating === 'true') {
      query += ' AND hasOutdoorSeating = ?';
      params.push('true');
    } else if (hasOutdoorSeating === 'false') {
      query += ' AND hasOutdoorSeating = ?';
      params.push('false');
    }

    // luxery or non luxery
    if (isLuxury === 'true') {
      query += ' AND isLuxury = ?';
      params.push('true');
    } else if (isLuxury === 'false') {
      query += ' AND isLuxury = ?';
      params.push('false');
    }

    let restaurants = await db.all(query, params);

    if (restaurants.length === 0) {
      return res.status(404).json({
        restaurants: `No restaurants found matching the selected filters.`,
      });
    }

    res.status(200).json({ restaurants: restaurants });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Exercise 5: Get Restaurants Sorted by Rating
app.get('/restaurants/sort-by-rating', async (req, res) => {
  try {
    let query = 'SELECT * FROM restaurants ORDER BY rating DESC';
    let restaurants = await db.all(query);

    if (restaurants.length === 0) {
      return res.status(404).json({ restaurants: `No resturants found!` });
    }

    res.status(200).json({ restaurants: restaurants });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Exercise 6: Get All Dishes
app.get('/dishes', async (req, res) => {
  try {
    let query = 'SELECT * FROM dishes';
    let dishes = await db.all(query, []);

    if (dishes.length === 0) {
      return res.status(404).json({ dishes: `No dishes found!` });
    }

    res.status(200).json({ dishes: dishes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Exercise 7: Get Dish by ID
app.get('/dishes/details/:id', async (req, res) => {
  let id = parseInt(req.params.id);
  try {
    let query = 'SELECT * FROM dishes WHERE id = ?';
    let dishes = await db.all(query, [id]);

    if (dishes.length === 0) {
      return res.status(404).json({ dishes: `No dishes found with id ${id}!` });
    }

    res.status(200).json({ dishes: dishes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
