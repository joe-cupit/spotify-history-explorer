// https://www.freecodecamp.org/news/how-to-create-a-react-app-with-a-node-backend-the-complete-guide/

// Modules

require('dotenv').config();


// Server setup

const express = require("express");
const PORT = process.env.PORT || 3001;
const app = express();


// API exports

require("./api/spotify")(app);
require("./api/database")(app);


// Begin server

app.listen(PORT, () => {
  console.log('[Server] Server started');
  console.log(`[Server] Server listening on ${PORT}`);
});
