const express = require('express');
const route = express.Router();

const spotifyController = require('../controllers/api/apiController');


// API
route.get('/', (req, res) => {
  console.log('[Node.js] API connected');
  res.send('API connected');
});

route.get('/artist/:id', spotifyController.artist);
route.get('/track/:id', spotifyController.track);
route.get('/search/:type/:term', spotifyController.search);


// Export router
module.exports = route
