require('dotenv').config();
const mongoose = require('mongoose');


// Server setup

const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();


// Database connection

const connectToMongoDB = require('./controllers/database/connect');
connectToMongoDB();


// Spotify API

const connectToSpotifyApi = require('./controllers/spotify/connect');
const spotifyApi = connectToSpotifyApi();


// API routes

app.use('/api', require('./routes/router'));


// Begin server

app.listen(PORT, () => {
  console.log('[Server] Server started');
  console.log(`[Server] Listening on ${PORT}`);
});


// Closing server

process.on('SIGINT', async () => {
  console.log('[Server] Keyboard interrupt');

  await mongoose.connection.close()
    .then(console.log('[MongoDB] Connection closed'));

  console.log('[Server] Shutting down');
  process.exit();
});
