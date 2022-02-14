const express = require("express");
const { searchQueryGenerator } = require('../public/scripts/helpers');
const router = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    return db.query(searchQueryGenerator(req.query)[0], searchQueryGenerator(req.query)[1])
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
