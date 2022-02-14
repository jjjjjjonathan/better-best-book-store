const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.get("/user/:id", (req, res) => {
    return db
      .query(
        `SELECT * , photo_urls FROM items JOIN photo_urls ON item_id = items.id JOIN users ON users.id = items.owner_id WHERE users.id = $1 GROUP BY items.id, photo_urls.id, users.id;`,
        [req.params.id]
      )
      .then((data) => {
        console.log(data.rows);
        const users = data.rows;
        const templateVars = {
          items: users,
        };
        res.render("listings/listings", templateVars);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.post("/user/delete/:item_id/:id", (req, res) => {
    console.log(req.params);
    const userId = req.params.id;
    db.query(`DELETE FROM items WHERE items.id = $1`, [
      req.params.item_id,
    ]).then((data) => {
      console.log(data.rows);
      res.redirect(`/listings/user/${userId}`);
    });
  });
  return router;
};
