// Client facing scripts here
const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    return db
      .query(
        `SELECT * FROM items JOIN users ON owner_id = users.id
        JOIN photo_urls ON item_id = items.id
        WHERE users.super_seller = $1 AND items.sold_status = $2
        GROUP BY items.id,users.id,photo_urls.id;`,
        ["TRUE", "FALSE"]
      )
      .then((data) => {
        const items = data.rows;
        console.log(items);
        const templateVars = {
          items: items,
          username: req.session["name"],
        };
        res.render("index", templateVars);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  return router;
};
