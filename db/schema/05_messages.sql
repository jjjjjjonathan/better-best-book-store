DROP TABLE IF EXISTS items CASCADE;

CREATE TABLE messages (
  id SERIAL PRIMARY KEY NOT NULL,
  item_id INTEGER REFERENCES items(id),
  sender_id INTEGER REFERENCES users(id),
  receiver_id INTEGER REFERENCES users(id),
  message_body TEXT NOT NULL,
  sent_at DATE DEFAULT now(),
  unread_status BOOLEAN DEFAULT true
);
