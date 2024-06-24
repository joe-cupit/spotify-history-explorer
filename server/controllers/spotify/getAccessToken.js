const getSpotifyAccessToken = function() {
  require('dotenv').config();

  // Create the api object with the credentials
  var SpotifyWebApi = require('spotify-web-api-node');
  var spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });

  // Retrieve an access token.
  spotifyApi.clientCredentialsGrant()
    .then(data => {
      console.log(`[Spotify] New access token is ${data.body['access_token']}`);
      console.log(`[Spotify] This token is valid for the next ${data.body['expires_in']}s`);
      return data.body['access_token'];
    })
    .catch(err => {
      console.log('[Spotify] Error retrieving access token');
      console.log('[Spotify]', err);
      return -1;
    });
}


module.exports = getSpotifyAccessToken;
