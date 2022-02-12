const express = require('express');
const router = express.Router();

module.exports = () => {
  router.get('/', (req, res) => {
    res.render('books/books');
  });
  router.get('/search', (req, res) => {
    res.render('books/search');
  });
  return router;
};
