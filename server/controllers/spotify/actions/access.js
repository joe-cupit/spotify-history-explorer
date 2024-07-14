require('dotenv').config();
const SpotifyWebApi = require('spotify-web-api-node');

const sleep = require('../../sleep');
const spotifyCall = require('./callcontrol');
const spotifyError = require('./errorhandling');


// api connection

var spotifyApi = null;

exports.connectToSpotifyApi = async function() {
  const newSpotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  spotifyApi = newSpotifyApi;

  await setNewAccessToken();
  await validateConnection();
}

exports.getSpotifyApi = function() {
  return spotifyApi;
}

const setNewAccessToken = spotifyError.tryCatchWrapper(async () => {
  const spotifyCredentials = await spotifyApi.clientCredentialsGrant();
  const accessToken = spotifyCredentials.body['access_token'];
  spotifyApi.setAccessToken(accessToken);

  console.log(`[Spotify] Set new access token: '${accessToken}'`);
  return accessToken;
})

const validateConnection = async function() {
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


// api calls

const makeApiCall = (func) => async (...args) => {
  try {
    return await func(...args);
  } catch (err) {
    spotifyError.processError(err);
    return null;
  } finally {
    spotifyCall.addApiCalls(1);
    await sleep(200);
  }
}


exports.getArtist = makeApiCall(async (artistId) => {
  console.log(`[Spotify] Finding artist with id '${artistId}'`);
  const response = await spotifyApi.getArtist(artistId);
  const artistData = response.body;
  return {
    spotifyId: artistData.id,
    name: artistData.name,

    imageURL: artistData.images[0].url,
    followers: artistData.followers.total,
    popularity: artistData.popularity
  };
})

exports.getAlbum = makeApiCall(async (albumId) => {
  console.log(`[Spotify] Finding album with id '${albumId}'`);
  const response = await spotifyApi.getAlbum(albumId);
  const albumData = response.body;

  let artistIds = []; let artistNames = [];
  for (var artist of albumData.artists) {
    artistIds.push(artist.id);
    artistNames.push(artist.name);
  }
  let trackIds = [];
  for (var track of albumData.tracks.items) {
    trackIds.push(track.id)
  }

  return {
    spotifyId: albumData.id,
    name: albumData.name,

    artistIds: artistIds,
    artistNames: artistNames,

    imageURL: albumData.images[0].url,
    albumType: albumData.album_type,
    totalTracks: albumData.total_tracks,
    releaseDate: albumData.release_date,

    trackIds: trackIds
  };
})

exports.getTrack = makeApiCall(async (trackId) => {
  console.log(`[Spotify] Finding track with id '${trackId}'`);
  const response = await spotifyApi.getTrack(trackId);
  const trackData = response.body;

  let artistIds = []; let artistNames = [];
  for (var artist of trackData.artists) {
    artistIds.push(artist.id);
    artistNames.push(artist.name);
  }

  return {
    spotifyId: trackData.id,
    name: trackData.name,

    artistIds: artistIds,
    artistNames: artistNames,
    albumId: trackData.album.id,

    imageURL: trackData.album.images[0].url,
    duration: trackData.duration_ms,
    releaseDate: trackData.album.release_date,
    popularity: trackData.popularity,
  };
})

exports.getShow = makeApiCall(async (showId) => {
  console.log(`[Spotify] Finding show with id '${showId}'`);
  const response = await spotifyApi.getShow(showId);
  const showData = response.body;

  return {
    spotifyId: showData.id,
    name: showData.name,

    imageURL: showData.images[0].url,
    totalEpisodes: showData.total_episodes
  };
})

exports.getEpisode = makeApiCall(async (episodeId) => {
  console.log(`[Spotify] Finding episode with id '${episodeId}'`);
  const response = await spotifyApi.getEpisode(episodeId, { market: 'GB'});
  const episodeData = response.body;

  return {
    spotifyId: episodeData.id,
    name: episodeData.name,

    showId: episodeData.show.id,
    imageURL: episodeData.images[0].url,
    duration: episodeData.duration_ms,
    releaseDate: episodeData.release_date
  };
})


exports.searchFor = makeApiCall(async (term, types, limit) => {
  console.log(`[Spotify] Searching for '${term}'`);
  const response = await spotifyApi.search(term, types, { limit: limit , market: 'GB' });
  return response.body;
})
