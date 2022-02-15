const express = require("express");
const { searchQueryGenerator } = require('../public/scripts/helpers');
const router = express.Router();


// module.exports = (db) => {
  router.get("/", (req, res) => {
let queryString = `SELECT * FROM favorites WHERE user_id = $1;`;
let values = [req.session['user_id']];
    return db.query(queryString, values)
      .then((data) => {
        console.log(data.rows)
        // const items = data.rows;
        // const templateVars = {
        //   items: items,
        // };
        res.render("books/favorites");
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  // router.get('/search', (req, res) => {
  //   res.render('books/search');
  // });
  // return router;
// };
