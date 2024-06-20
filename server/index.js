// https://www.freecodecamp.org/news/how-to-create-a-react-app-with-a-node-backend-the-complete-guide/

require('dotenv').config();

const express = require("express");
const PORT = process.env.PORT || 3001;
const app = express();

var SpotifyWebApi = require("spotify-web-api-node");


//// GET ACCESS TOKEN ////
/*
// Create the api object with the credentials
var spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant().then(
  function(data) {
    console.log('The access token expires in ' + data.body['expires_in']);
    console.log('The access token is ' + data.body['access_token']);

    // Save the access token so that it's used in future calls
    spotifyApi.setAccessToken(data.body['access_token']);
  },
  function(err) {
    console.log('Something went wrong when retrieving an access token', err);
  }
);
*/
//// ////



const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});
spotifyApi.setAccessToken(process.env.ACCESS_TOKEN);


// API

app.get("/api/artist/:id", (req, res) => {
  var id = req.params.id;

  (async () => {
    console.log(`Finding artist with id ${id}`);

    spotifyApi.getArtist(id)
    .then(function(data) {
      console.log(`Found info for '${data.body.name}'`);
      data.body.status = data.statusCode;
      res.send(data.body);
    }, function(err) {
      console.error(err);
      res.send(err.body.error);
    });

  })();
});


app.get("/api/track/:id", (req, res) => {
  var id = req.params.id;

  (async () => {
    console.log(`Finding track with id ${id}`);

    spotifyApi.getTrack(id)
    .then(function(data) {
      console.log(`Found info for '${data.body.name}'`);
      data.body.status = data.statusCode;
      res.send(data.body);
    }, function(err) {
      console.error(err);
      res.send(err.body.error);
    });

  })();
});


// BEGIN

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
