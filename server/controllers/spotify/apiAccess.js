const sleep = require('../sleep');

const spotifyController = require('./apiController');
const spotifyApi = spotifyController.getSpotifyApi();


getArtist = async function(artistId) {
  console.log('[Spotify] Finding artist with id', artistId);
  try {
    response = await spotifyApi.getArtist(artistId);
    return response.body;
  } catch (err) {
    processError(err);
    return null;
  } finally {
    spotifyController.addApiCalls(1);
    await sleep(200);
  }
}

getTrack = async function(trackId) {
  console.log('[Spotify] Finding track with id', trackId);
  try {
    response = await spotifyApi.getTrack(trackId);
    return response.body;
  } catch (err) {
    processError(err);
    return null;
  } finally {
    spotifyController.addApiCalls(1);
    await sleep(200);
  }
}

getEpisode = async function(episodeId) {
  console.log('[Spotify] Finding episode with id', episodeId);
  try {
    response = await spotifyApi.getEpisode(episodeId, { market: 'GB'});
    return response.body;
  } catch (err) {
    processError(err);
    return null;
  } finally {
    spotifyController.addApiCalls(1);
    await sleep(200);
  }
}


searchFor = async function(term, types, limit) {
  console.log(`[Spotify] Searching for '${term}'`);

  try {
    response = await spotifyApi.search(term, types, { limit: limit , market: 'GB' });
    return response.body;
  } catch (err) {
    processError(err);
    return null;
  } finally {
    spotifyController.addApiCalls(1);
    await sleep(200);
  }
}


module.exports = {
  getArtist,
  getTrack,
  getEpisode,
  
  searchFor
}


// helper functions

processError = function(err) {
  try{
    switch(err.body.statusCode) {
    case 429:
      console.log('[Spotify] Error 429: Too many requests');
      const retryIn = err.body.headers['retry-after'];
      console.log(`[Spotify] Retry again in ${retryIn}`)
      spotifyController.setRetryIn(retryIn);
      break;
    case 502:
      console.log('[Spotify] Error 502: Bad gateway');
      // TODO: retry again
      break;
    default:
      console.log('[Spotify] Encountered an error');
  }
  } catch (err) {
    console.log('[Spotify] Encountered an unknown error');
  }
  
  console.log('[Spotify]', err);
}
