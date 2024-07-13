const express = require('express');
const route = express.Router();

const apiController = require('../controllers/api/apiController');


// API
route.get('/', (req, res) => {
  console.log('[Node.js] API connected');
  res.send('API connected');
});


route.get('/toplist/:type/:limit', apiController.toplist);
route.get('/artist/:id', apiController.artist);
route.get('/artist/:id/rank', apiController.getArtistRank);
route.get('/artist/:id/toptracks/:limit', apiController.getTopTracksByArtist)

route.get('/album/:id', apiController.album);
route.get('/track/:id', apiController.track);
route.get('/track/:id/chart/:maxlen', apiController.getTrackChartData);

route.get('/show/:id', apiController.show);

route.get('/search/:types/:term/:limit', apiController.search);

route.get('/homepage', apiController.homepage);


// Export router
module.exports = route
