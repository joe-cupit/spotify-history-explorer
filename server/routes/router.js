const express = require('express');
const route = express.Router();

const spotifyController = require('../controllers/spotify/spotifyController');
const databaseController = require('../controllers/database/databaseController');


// API
route.get('/', (req, res) => {
  console.log('[Node.js] API connected');
  res.send('API connected');
});

route.get('/artist/:id', spotifyController.artist);
route.get('/track/:id', spotifyController.track);
route.get('/search/:type/:term', spotifyController.search);

route.get('/database', databaseController.test);


// Export router
module.exports = route
