const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    return db
      .query(
        `SELECT * , photo_urls FROM items JOIN photo_urls ON item_id = items.id  GROUP BY items.id, photo_urls.id;`
      )
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
