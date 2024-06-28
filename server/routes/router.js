const express = require('express');
const route = express.Router();

const apiController = require('../controllers/api/apiController');


// API
route.get('/', (req, res) => {
  console.log('[Node.js] API connected');
  res.send('API connected');
});


route.get('/artist/:id', apiController.artist);
route.get('/artist/:id/toptracks/:limit', apiController.getTopTracksByArtist)

route.get('/track/:id', apiController.track);
route.get('/search/:type/:term', apiController.search);


// Export router
module.exports = route
