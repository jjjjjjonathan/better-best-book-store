const express = require('express');
const router = express.Router();

module.exports = db => {
  router.get('/', (req, res) => {
    // res.render('books/books');
    console.log(req.params);
    db.query(`SELECT * FROM items;`)
      .then(data => {
        const books = data.rows;
        res.json({ books });
      })
      .catch(err => {
        res.status(500).json({ error: err.message });
      });
  });
  router.get('/search', (req, res) => {
    res.render('books/search');
  });
  return router;
};
