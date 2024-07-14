const get = require('./get');

const express = require('express');
const route = express.Router();


// API
route.get('/', (req, res) => {
  console.log('[Node.js] API connected');
  res.send('API connected');
});

route.get('/artist/:id', get.artist);
route.get('/album/:id', get.album);
route.get('/track/:id', get.track);
route.get('/show/:id', get.show);

route.get('/:type/toplist/:limit', get.toplist);

route.get('/search/:types/:term/:limit', get.search);

route.get('/homepage', get.homepage);

route.get('/track/:id/chart/:maxlen', get.getTrackChartData);


module.exports = route
