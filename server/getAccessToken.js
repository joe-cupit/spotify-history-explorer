require('dotenv').config();


// Create the api object with the credentials
var SpotifyWebApi = require("spotify-web-api-node");
var spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant().then(
  function(data) {
    console.log('The access token is ' + data.body['access_token']);
    console.log('It will expires in ' + data.body['expires_in'] + 's');
  },
  function(err) {
    console.log('Something went wrong when retrieving an access token', err);
  }
);
