const express = require("express");
const { searchQueryGenerator } = require("../public/scripts/helpers");
const router = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    console.log(req.query);
    return db
      .query(
        searchQueryGenerator(req.query)[0],
        searchQueryGenerator(req.query)[1]
      )
      .then((data) => {
        const items = data.rows;
        if (items.length === 0) {
          const templateVars = { items: null, username: req.session['name']};
          res.render("books/books", templateVars);
        } else {
          const templateVars = {
            items: items,
            username:req.session['name'],
          };
          res.render("books/books", templateVars);
        }
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  router.get('/search', (req, res) => {
    const templateVars = {
      username: req.session['name']
    };
    res.render('books/search', templateVars);
  });
  return router;
};
