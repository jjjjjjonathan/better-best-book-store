const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    // should turn queryString generator into a function
    const search = req.query;
    console.log(search);
    const queryParams = [];
    let queryString = `
    SELECT items.*, photo_urls.photo_url FROM items JOIN photo_urls ON item_id = items.id`;
    let whereConditions = [];
    if (!!search.title) {
      queryParams.push(`%${search.title}%`);
      whereConditions.push(`items.title ILIKE $${queryParams.length}`);
    }
    if (!!search.genre) {
      queryParams.push(`%${search.genre}%`);
      whereConditions.push(`items.genre ILIKE $${queryParams.length}`);
    }

    if (queryParams.length > 0) {
      queryString += ` WHERE ${whereConditions.join(' AND ')}`;
    }
    queryString += ";";
    return db
      .query(queryString, queryParams)
      .then((data) => {
        const items = data.rows;
        const templateVars = {
          items: items,
        };
        res.render("books/books", templateVars);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  router.get('/search', (req, res) => {
    res.render('books/search');
  });
  return router;
};
