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
        `SELECT items.* , photo_urls.photo_url FROM items LEFT JOIN photo_urls ON item_id = items.id JOIN users ON users.id = items.owner_id WHERE users.id = $1 GROUP BY items.id, photo_urls.id, users.id;`,
        [req.session.user_id]
      )
      .then((data) => {
        const users = data.rows;
        console.log(users[1]);
        const templateVars = {
          username: req.session.name,
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
      res.redirect(`/listings/user`);
    });
  });

  router.get(`/user/item/edit/:id`, (req, res) => {
    const itemId = req.params.id;
    return db
      .query(
        `SELECT items.* , photo_urls.photo_url FROM items LEFT JOIN photo_urls ON item_id = items.id WHERE items.id = $1 GROUP BY items.id, photo_urls.id;`,
        [itemId]
      )
      .then((data) => {
        console.log(data.rows);
        const users = data.rows[0];
        const templateVars = {
          id: users.id,
          cover: users.photo_url,
          Title: users.title,
          Description: users.description,
          Price: users.price,
          sold_status: users.sold_status,
          Genre: users.genre,
          username: req.session.name,
        };
        res.render(`listings/edit`, templateVars);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.get("/new", (req, res) => {
    res.render("listings/new");
  });

  router.post("/new", (req, res) => {
    console.log(req.body);
    db.query(
      `INSERT INTO items (owner_id, title, description, price, genre) VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
      [
        req.session["user_id"],
        req.body.title,
        req.body.description,
        parseFloat(req.body.price),
        req.body.genre,
      ]
    ).then((data) => {
      console.log(data.rows);
      res.redirect("../");
    });
  });
  router.post("/user/item/edit/:id", (req, res) => {
    const itemId = req.params.id;
    const itemBody = req.body;
    console.log("This is item body", itemBody);
    console.log("This is itemID", itemId);
    console.log(res.rows);
    return db
      .query(
        `UPDATE items SET title = $1,description = $2, price = $3, genre = $4 WHERE items.id = $5 ;
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
          username: req.session.name,
        };
        console.log("what is this?", templateVars);
        res.render(`listings/edit`, templateVars);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  return router;
};
