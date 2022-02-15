const express = require("express");
const router = express.Router();

module.exports = db => {
  router.get('/', (req, res) => {
    const userId = req.session.user_id;
    if (!userId) {
      res.render("index");
    } else {
      return db.query(`SELECT conversations.id, count(messages.*) as message_count, users_1.username as name1, users_2.username as name2, conversations.last_message_time
      FROM messages
      JOIN conversations ON messages.conversation_id = conversations.id
      JOIN users AS users_1 ON conversations.user1_id = users_1.id
      JOIN users AS users_2 ON conversations.user2_id = users_2.id
      WHERE conversations.user1_id = $1
      OR conversations.user2_id = $1
      GROUP BY conversations.id, users_1.username, users_2.username
      ORDER BY conversations.last_message_time;`, [userId])
        .then(data => {
          const messages = data.rows;
          console.log(messages[0]);
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
    return db.query(`SELECT messages.*, users.username as sender
    FROM messages
    JOIN conversations ON conversations.id = messages.conversation_id
    JOIN users ON messages.sender_id = users.id
    WHERE conversations.id = $1
    ORDER BY sent_at;`, [req.params.id])
      .then(data => {
        const messageThread = data.rows;
        const templateVars = { messageThread, user: req.session['user_id'] };
        res.render('conversations/thread', templateVars);
      });
  });

  router.post('/:id', (req, res) => {
    console.log(req.params, req.body);
    return db.query(`INSERT INTO messages (sender_id, conversation_id, message_body)
    VALUES ($1, $2, $3);`, [req.session['user_id'], parseFloat(req.params.id), req.body.message])
      .then(() => {
        db.query(`UPDATE conversations SET last_message_time = now() WHERE id = ${parseFloat(req.params.id)};`);
      })
      .then(() => {
        res.redirect(`/conversations/${req.params.id}`);
      });
  });

  return router;
};
