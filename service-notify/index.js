//: ----------------------------------------------------------------------------
"use strict";

const express = require("express");
const createSubscriber = require("pg-listen");

//: ----------------------------------------------------------------------------

(async () => {

  const server = express();
  const port = 8081;

  const DATABASE_HOST = process.env.DB_HOST;
  const DATABASE_USER = process.env.DB_USER;
  const DATABASE_PASS = process.env.DB_PASSWORD;
  const DATABASE_PORT = process.env.DB_PORT;
  const DATABASE = process.env.DB_NAME;

  const eventName = "db_event";

  //: Create Listener
  const subscriber = createSubscriber({
    connectionString: `postgres://${DATABASE_USER}:${DATABASE_PASS}@${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE}`
  });

  await subscriber.connect();
  await subscriber.listenTo(eventName);

  //: Event Notification
  subscriber.notifications.on(eventName, async (data) => {
    console.log("✧ NOTIFY");
    console.log(data);
  });
    
  server.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
  });

})();
