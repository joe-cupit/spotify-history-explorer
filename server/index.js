// https://www.freecodecamp.org/news/how-to-create-a-react-app-with-a-node-backend-the-complete-guide/

require('dotenv').config();


// Server setup

const express = require("express");
const PORT = process.env.PORT || 3001;
const app = express();


// Spotify API

var SpotifyWebApi = require("spotify-web-api-node");

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});
spotifyApi.setAccessToken(process.env.ACCESS_TOKEN);


// Page API

app.get("/api/artist/:id", (req, res) => {
  var id = req.params.id;

  (async () => {
    console.log(`Finding artist with id ${id}`);

    spotifyApi.getArtist(id).then(
      function(data) {
        console.log(`Found info for '${data.body.name}'`);
        data.body.status = data.statusCode;
        res.send(data.body);
      },
      function(err) {
        console.error(err);
        res.send(err.body.error);
      }
    );

  })();
});


app.get("/api/track/:id", (req, res) => {
  var id = req.params.id;

  (async () => {
    console.log(`Finding track with id ${id}`);

    spotifyApi.getTrack(id).then(
      function(data) {
        console.log(`Found info for '${data.body.name}'`);
        data.body.status = data.statusCode;
        res.send(data.body);
      },
      function(err) {
        console.error(err);
        res.send(err.body.error);
      }
    );

  })();
});


app.get("/api/search/:type/:term", (req, res) => {
  var type = req.params.type;
  var term = req.params.term;

  const validSearchTypes = new Set(['artist', 'track', 'album', 'episode']);

  (async () => {
    if (validSearchTypes.has(type)) {
      console.log(`Searching ${type}s for '${term}'`);

      spotifyApi.search(term, [type], { limit: 10 }).then(
        function(data) {
          console.log('Search complete.');
          res.send(data.body[type+'s'].items);
        },
        function(err) {
          console.error(err);
          res.send(err.body.error);
        }
      );
    } else {
      console.log(`Invalid search type: '${type}'`);
      res.json({ status: 400, message: `Invalid search type '${type}'`})
    }
  })();
});


// Begin server

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
