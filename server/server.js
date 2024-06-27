
// Server setup

const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();


// Database connection

const connectToMongoDB = require('./dbaccess/connect.js');
connectToMongoDB();


// Spotify API

const spotifyApi = require('./controllers/spotify/apiController');
spotifyApi.connectToSpotifyApi();
spotifyApi.validateConnection();


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
