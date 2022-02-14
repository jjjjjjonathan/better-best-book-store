
// const express = require("express");
// const router = express.Router();

// module.exports = db => {
// router.get('/', (req, res) => {
// const userId = req.session['user_id']
//   return db.query(`SELECT username FROM users WHERE id = $1 ;`, [userId])
//     .then(data => {
//       const username = data.rows[0];
//       const templateVars = { username: username };
//       res.render('/', templateVars);
//     })
//     .catch(error => {
//       console.log(error);
//     });
// });
// return router;
// };
