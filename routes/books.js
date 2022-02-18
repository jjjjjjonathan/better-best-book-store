const express = require("express");
const { searchQueryGenerator } = require("../public/scripts/helpers");
const router = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    console.log(req.query);
    return db
      .query(
        searchQueryGenerator(req.query)[0],
        searchQueryGenerator(req.query)[1]
      )
      .then((data) => {
        const items = data.rows;
        if (items.length === 0) {
          const templateVars = { items: null, username: req.session['name']};
          res.render("books/books", templateVars);
        } else {
          const templateVars = {
            items: items,
            username:req.session['name'],
          };
          res.render("books/books", templateVars);
        }
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  router.get('/search', (req, res) => {
    const templateVars = {
      username: req.session['name']
    };
    res.render('books/search', templateVars);
  });

  router.get("/:id", (req, res) => {

    // let favoriteId
    // let values = [req.params.id,req.session["user_id"]];
    // let checkQueryString = `
    //     SELECT * FROM favorites
    //     WHERE item_id = $1 AND user_id =$2;`;
    //   db.query(checkQueryString,values)
    //   .then(res => {
    //     if (res.rows.length) {
    //       console.log(res.rows)
    //     return favoriteId= res.rows[0].id
    //     }});

    return db.query(`SELECT * , photo_urls, username FROM items JOIN users ON users.id = owner_id JOIN photo_urls ON item_id = items.id WHERE items.id = $1 GROUP BY items.id, photo_urls.id, users.id;`, [req.params.id])
      .then((data) => {
        const users = data.rows[0];
        if (users['owner_id'] === req.session['user_id']) {
          res.redirect(`../../listings/user/item/edit/${users['item_id']}`);
        } else {
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
            ownerId: users.owner_id,
            favoriteId: favoriteId
          };
          res.render("books/item_preview", templateVars);
        }
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  return router;
};
