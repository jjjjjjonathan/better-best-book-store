// load .env data into process.env
require("dotenv").config();

// Web server config
const PORT = process.env.PORT || 8080;
const sassMiddleware = require("./lib/sass-middleware");
const express = require("express");
const app = express();
const cookieSession = require("cookie-session");
const morgan = require("morgan");

// PG database client/connection setup
const { Pool } = require("pg");
const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);
db.connect();

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan("dev"));

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use(
  "/styles",
  sassMiddleware({
    source: __dirname + "/styles",
    destination: __dirname + "/public/styles",
    isSass: false, // false => scss, true => sass
  })
);

app.use(express.static("public"));

app.use(
  cookieSession({
    name: "session",
    keys: [
      "40ed1e00-25ea-4136-bc6b-e7451fb3d11a",
      "f92c5252-5913-4bfa-82a6-1cffe026956f",
    ],
    maxAge: 24 * 60 * 60 * 1000,
  })
);

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const usersRoutes = require("./routes/users");
const widgetsRoutes = require("./routes/widgets");
const widgetsPageRoutes = require("./routes/widgetsPage");
const bookRoutes = require("./routes/books");
const listingsRoutes = require("./routes/listings");
const itemPreviewRoutes = require("./routes/item_preview");
const authRoutes = require("./routes/auth");
const conversationRoutes = require("./routes/conversations");


// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("/api/users", usersRoutes(db));
app.use("/api/widgets", widgetsRoutes(db));
app.use("/books/item", itemPreviewRoutes(db));
app.use("/widgets", widgetsPageRoutes(db));
app.use("/books", bookRoutes(db));
app.use("/listings", listingsRoutes(db));
app.use("/auth", authRoutes(db));
app.use("/conversations", conversationRoutes(db));

// Note: mount other resources here, using the same pattern above

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

app.get("/", (req, res) => {
  const templateVars = {username: req.session.name};
  res.render("index", templateVars);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});


app.post("/:itemId/addfavorite", (req, res) => {
  let queryString = `
  INSERT INTO favorites(item_id,user_id)
  VALUES ($1, $2)
  RETURNING *;`;
  let values = [req.params["itemId"],req.session["user_id"]];
  // ==> Need to write a function helper for checking if the favorite (item / user pair) already exists
  // in the db and return true or false -- with a db query
  return db.query(queryString, values)
  .then(res => res.rows[0])
  .catch(err => console.log(err));
});



