const express = require('express');
const route = express.Router();

const spotifyController = require('../controllers/spotifyController');
const databaseController = require('../controllers/databaseController');


// API
route.get('/', (req, res) => {
  console.log('[Node.js] API successfully called');
  res.send('API working');
});

route.get('/artist/:id', spotifyController.artist);
route.get('/track/:id', spotifyController.track);
route.get('/search/:type/:term', spotifyController.search);

route.get('/database', databaseController.test);


// Export router
module.exports = route
