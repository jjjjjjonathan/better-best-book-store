const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.get("/user", (req, res) => {
    const userId = req.session.user_id;
    if (!userId) {
      res.redirect("/");
    }
    return db
      .query(
        `SELECT * , photo_urls FROM items JOIN photo_urls ON item_id = items.id JOIN users ON users.id = items.owner_id WHERE users.id = $1 GROUP BY items.id, photo_urls.id, users.id;`,
        [req.session.user_id]
      )
      .then((data) => {
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

  router.post("/user/:item_id", (req, res) => {
    const userId = req.session.user_id;
    if (!userId) {
      res.redirect("/");
    }
    db.query(`DELETE FROM items WHERE items.id = $1`, [
      req.params.item_id,
    ]).then((data) => {
      console.log(data.rows);
      res.redirect(`/listings/user`);
    });
  });

  router.get("/user/item/:item_id", (req, res) => {
    console.log(req.params);
    return db
      .query(
        `SELECT * , photo_urls FROM items JOIN photo_urls ON item_id = items.id WHERE items.id = $1 GROUP BY items.id, photo_urls.id;`,
        [req.params.item_id]
      )
      .then((data) => {
        console.log(data.rows);
        const users = data.rows[0];
        const templateVars = {
          cover: users.photo_url,
          Title: users.title,
          Description: users.description,
          Price: users.price,
          sold_status: users.sold_status,
          Genre: users.genre,
        };
        res.render("books/item_preview", templateVars);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  return router;
};
