const express = require("express");
const router = express.Router();



module.exports = db => {
  router.get('/', (req, res) => {

    return db.query(`SELECT * FROM users;`)
      .then(data => {
        const items = data.rows;
        const templateVars = { items: items };
        res.render('auth/login', templateVars);
      })
      .catch();
  });
  router.post('/', (req, res) => {
    req.session = null;
  });
  return router;
};
