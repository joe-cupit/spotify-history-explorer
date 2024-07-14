
// Server setup

const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();


// Database connection

const dbController = require('./controllers/database/databaseController');
dbController.connect();

console.log(dbController)


// Spotify API

const spotifyApi = require('./controllers/spotify/spotifyController');
spotifyApi.connectToSpotifyApi();

console.log(spotifyApi)


// API routes

app.use('/api', require('./routes/router'));


// JSON stuff

// require('./controllers/loading/loadHistory.js');


// Begin server

app.listen(PORT, () => {
  console.log('[Server] Server started');
  console.log(`[Server] Listening on ${PORT}`);
});


// Closing server
const mongoose = require('mongoose');

process.on('SIGINT', async () => {
  console.log('[Server] Keyboard interrupt');

  await mongoose.connection.close()
    .then(console.log('[MongoDB] Connection closed'));

  console.log('[Server] Shutting down');
  process.exit();
});
