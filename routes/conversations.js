const express = require("express");
const router = express.Router();

module.exports = db => {
  router.get('/', (req, res) => {
    const userId = req.session.user_id;
    if (!userId) {
      res.render("index");
    } else {
      return db.query(`SELECT conversations.id, count(messages.*) as message_count, users_1.name as name1, users_2.name as name2
      FROM messages
      JOIN conversations ON messages.conversation_id = conversations.id
      JOIN users AS users_1 ON conversations.user1_id = users_1.id
      JOIN users AS users_2 ON conversations.user2_id = users_2.id
      WHERE conversations.user1_id = ${userId}
      OR conversations.user2_id = ${userId}
      GROUP BY conversations.id, users_1.name, users_2.name;`)
        .then(data => {
          const messages = data.rows;
          if (messages.length > 0) {
            const templateVars = { messages: messages };
            res.render('conversations/conversations', templateVars);
          } else {
            const templateVars = { messages: null };
            res.render('conversations/conversations', templateVars);
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  });

  router.get('/:id', (req, res) => {
    console.log("yes");
  });

  return router;
};
