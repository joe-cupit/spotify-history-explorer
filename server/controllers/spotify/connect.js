const SpotifyWebApi = require('spotify-web-api-node');

var spotifyApi = null;


exports.connectToSpotifyApi = function() {
  const newSpotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  newSpotifyApi.setAccessToken(process.env.ACCESS_TOKEN);

  spotifyApi = newSpotifyApi;
}


exports.getSpotifyApi = function() {
  return spotifyApi;
}


exports.validateConnection = async function() {
  try {
    await spotifyApi.getArtist('4Z8W4fKeB5YxbusRsdQVPb');
    console.log('[Spotify] Connection validated');
    return true;
  } catch (err) {
    console.log('[Spotify] Connection failed');
    console.log('[Spotify]', err);
    return false;
  }
}


exports.getAccessToken = async function() {
  try {
    response = await spotifyApi.clientCredentialsGrant();
    console.log(`[Spotify] New access token is ${data.body['access_token']}`);
    spotifyApi.setAccessToken(data.body['access_token']);
  } catch (err) {
    console.log('[Spotify] Failed to retrieve new access token');
    console.log('[Spotify]', err);
    process.exit(1);
  }
}
