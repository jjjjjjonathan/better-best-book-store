const express = require("express");
const router = express.Router();



module.exports = db => {
  router.get('/', (req, res) => {

    return db.query(`SELECT * FROM users;`)
      .then(data => {
        const users = data.rows;
        const templateVars = { users: users };
        res.render('auth/login', templateVars);
      })
      .catch(error => {
        console.log(error);
      });
  });
  router.post('/', (req, res) => {
    req.session['user_id'] = req.body['user_id'];
    console.log('Logged in as: ', req.session['user_id']);
    res.redirect('../');
  });
  router.post('/logout', (req, res) => {
    console.log('Logging out as: ', req.session['user_id']);
    req.session = null;
    res.redirect('../');
  });
  return router;
};
