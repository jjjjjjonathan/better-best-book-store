const express = require("express");
const router = express.Router();

module.exports = db => {
  router.get('/', (req, res) => {
    // res.render('conversations/conversations');
    const userId = req.session.user_id;
    if (!userId) {
      res.render("index");
    } else {
      return db.query(`SELECT count(messages.*) as message_count, conversations.user1_id as user1, conversations.user2_id as user2
      FROM messages
      JOIN conversations ON messages.conversation_id = conversations.id
      WHERE conversations.user1_id = ${userId}
      OR conversations.user2_id = ${userId}
      GROUP BY conversations.id;`)
        .then(data => {
          const messages = data.rows;
          const templateVars = { messages: messages };
          res.render('conversations/conversations', templateVars);
        })
        .catch(error => {
          console.log(error);
        });
    }
  });
  return router;
};
