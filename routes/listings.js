const express = require("express");
const router = express.Router();

module.exports = (db) => {
  //router for to show all items that user sell
  router.get("/user", (req, res) => {
    const userId = req.session.user_id;
    if (!userId) {
      res.redirect("/");
    } else {
      return db
        .query(
          `SELECT * , photo_urls FROM items JOIN photo_urls ON item_id = items.id JOIN users ON users.id = items.owner_id WHERE users.id = $1 GROUP BY items.id, photo_urls.id, users.id;`,
          [req.session.user_id]
        )
        .then((data) => {
          const users = data.rows;
          const templateVars = {
            items: users,
            username: req.session.name,
          };
          res.render("listings/listings", templateVars);
        })
        .catch((err) => {
          res.status(500).json({ error: err.message });
        });
    }
  });

  //route for user to mark sold the item,
  // so will not be able to show up in all selling books lists
  router.post("/user/sold/:item_id", (req, res) => {
    const userId = req.session.user_id;
    if (!userId) {
      res.redirect("/");
    } else {
      db.query(`UPDATE items SET sold_status = $1 WHERE items.id = $2`, [
        true,
        req.params.item_id,
      ]).then((data) => {
        console.log(data.rows);
        res.redirect(`/listings/user`);
      });
    }
  });

  //route for user to delete their items from selling list
  router.post("/user/:item_id", (req, res) => {
    const userId = req.session.user_id;
    if (!userId) {
      res.redirect("/");
    } else {
      db.query(`DELETE FROM items WHERE items.id = $1 RETURNING *`, [
        req.params.item_id,
      ]).then(() => {
        const itemId = req.params.item_id;
        const templateVars = {
          id: itemId,
          username: userId,
          cover: itemBody.photo_url,
          Title: itemBody.Title,
          Description: itemBody.Description,
          Price: itemBody.Price,
          sold_status: itemBody.Sold_status,
          Genre: itemBody.Genre,
        };

        res.redirect(`/listings/user`, templateVars);
      });
    }
  });

  router.get(`/user/item/edit/:item_id`, (req, res) => {
    const userId = req.session.user_id;
    const itemId = req.params.item_id;
    if (!userId) {
      res.redirect("/");
    }
    return db
      .query(
        `SELECT * , photo_urls FROM items JOIN photo_urls ON item_id = items.id WHERE items.id = $1 GROUP BY items.id, photo_urls.id;`,
        [itemId]
      )
      .then((data) => {
        console.log(data.rows);
        const users = data.rows[0];
        const templateVars = {
          id: users.item_id,
          cover: users.photo_url,
          Title: users.title,
          Description: users.description,
          Price: users.price,
          sold_status: users.sold_status,
          Genre: users.genre,
        };
        res.render(`listings/edit`, templateVars);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.post("/user/item/edit/:item_id", (req, res) => {
    const itemId = req.params.item_id;
    const itemBody = req.body;
    console.log("This is item body", itemBody);
    console.log("This is itemID", itemId);
    console.log(res.rows);
    return db
      .query(
        `UPDATE items
         SET title = $1,description = $2, price = $3,
        genre = $4 WHERE items.id = $5 RETURNING *;
         `,
        [
          itemBody.Title,
          itemBody.Description,
          itemBody.Price,
          itemBody.Genre,
          itemId,
        ]
      )
      .then(() => {
        return db.query(
          `UPDATE photo_urls SET photo_url = $1 WHERE item_id = $2;`,
          [itemBody.photo_url, itemId]
        );
      })
      .then(() => {
        const templateVars = {
          id: itemId,
          cover: itemBody.photo_url,
          Title: itemBody.Title,
          Description: itemBody.Description,
          Price: itemBody.Price,
          sold_status: itemBody.Sold_status,
          Genre: itemBody.Genre,
        };
        console.log(templateVars);
        res.render(`listings/edit`, templateVars);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  return router;
};
