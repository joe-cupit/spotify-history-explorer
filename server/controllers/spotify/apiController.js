const SpotifyWebApi = require('spotify-web-api-node');

var spotifyApi = null;

connectToSpotifyApi = function() {
  const newSpotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  newSpotifyApi.setAccessToken(process.env.ACCESS_TOKEN);

  spotifyApi = newSpotifyApi;
}

getSpotifyApi = function() {
  return spotifyApi;
}

validateConnection = async function() {
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

getAccessToken = async function() {
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



// Spotify API limits the number of calls that can be made
// within a 30s window
// This keeps track of API calls in an attempt to avoid
// making too many requests

var apiCallWindowSize = 0;
const MAX_API_CALLS = 30;

addApiCalls = function(n) {
  apiCallWindowSize += n;
  setTimeout(() => {apiCallWindowSize -= n;}, 30000);
}

setRetryIn = function(retryIn) {
  apiCallWindowSize += MAX_API_CALLS;
  setTimeout(() => {apiCallWindowSize -= MAX_API_CALLS;}, retryIn*1000);
}

callPermission = async function() {
  while(apiCallWindowSize >= MAX_API_CALLS) {
    console.log(`[Spotify] Too many API calls in the past 30s
                  (${apiCallWindowSize})`);
    await sleep(5000);
  }
}


// module exports

module.exports = {
  connectToSpotifyApi,
  getSpotifyApi,
  validateConnection,
  getAccessToken,

  addApiCalls,
  setRetryIn,
  callPermission
}
