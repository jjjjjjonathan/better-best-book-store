const express = require('express');
const router = express.Router();

module.exports = () => {
  router.get('/', (req, res) => {
    res.render('listings/listings');
  });
  router.get('/new', (req, res) => {
    res.render('listings/new');
  });
  return router;
};
