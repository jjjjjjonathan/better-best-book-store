// Client facing scripts here
const express = require("express");
const router = express.Router();
const { randomFeaturedItems } = require('./helpers');
const timeago = require('timeago.js');

module.exports = (db) => {
  router.get("/", (req, res) => {
    return db.query(`SELECT items.id AS item_id, items.title AS item_title, items.price AS item_price, users.username AS seller, items.created_at AS post_date, photo_urls.photo_url AS item_photo
    FROM items
    JOIN users ON users.id = items.owner_id
    JOIN photo_urls ON photo_urls.item_id = items.id
    WHERE users.super_seller = true
    AND items.sold_status = false;`)
      .then((data) => {
        const items = data.rows;
        for (const item of items) {
          item['post_date'] = timeago.format(item['post_date']);
        }
        const i = randomFeaturedItems(items.length);
        const templateVars = {
          username: req.session["name"],
          feature0: items[i[0]],
          feature1: items[i[1]],
          feature2: items[i[2]],
          feature3: items[i[3]],
          feature4: items[i[4]]
        };
        res.render("index", templateVars);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  return router;
};
