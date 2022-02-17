const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.get("/:id", (req, res) => {
    return db
      .query(
        `SELECT * , photo_urls, username FROM items JOIN users ON users.id = owner_id JOIN photo_urls ON item_id = items.id WHERE items.id = $1 GROUP BY items.id, photo_urls.id, users.id;`,
        [req.params.id]
      )
      .then((data) => {
        const users = data.rows[0];
        const templateVars = {
          id: users.item_id,
          cover: users.photo_url,
          Title: users.title,
          Description: users.description,
          Price: users.price,
          sold_status: users.sold_status,
          Genre: users.genre,
          Seller: users.username,
          itemId: users.id,
          username: req.session['name'],
          ownerId: users.owner_id
        };
        res.render("books/item_preview", templateVars);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  return router;
};
