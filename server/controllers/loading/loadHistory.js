const trackApiCalls = require('../spotify/callWindowController');
const sleep = require('../sleep');

const databaseController = require('./databaseAccess');
const spotifyController = require('../spotify/spotifyController');


async function addTrackToDatabase(track) {
  if (!track.spotify_track_uri) {
    return;
  }

  var updateJson = {
    $inc: {
      totalListeningCount: 1,
      totalListeningTime: track.ms_played,
      skippedCount: track.skipped ? 1 : 0
    }
  }

  const trackId = track.spotify_track_uri.split(':')[2];

  var trackJson = {
    spotifyId: trackId
  }

  var artistList = await databaseController.getArtistsFromTrackIfExists(trackId);

  if (!artistList) {
    trackJson.name = track.master_metadata_track_name;

    while(trackApiCalls.getApiCallsExceedsLimit()) {
      console.log(`[Spotify] Too many API calls in the past 30s
                    (${trackApiCalls.getApiCalls()})`);
      await sleep(5000);
    }

    trackData = await spotifyController.getTrack(trackId);
    if (trackData) {
      artistList = [];
      for (var artistData of trackData.artists) {
        artistList.push(artistData.id);

        var artistJson = {
          spotifyId: artistData.id,
          name: artistData.name
        }
        await databaseController.addOrUpdateArtist(artistJson, updateJson);
      }

      trackJson.artists = artistList;
      trackJson.albumId = trackData.album.id;
      trackJson.duration = trackData.duration_ms;
    } else {
      console.log('[Spotify] Nothing returned, exiting...');
      process.exit(1);
    }
  } else {
    console.log('[MongoDB] Track already in database');
    for (var artist of artistList) {
      await databaseController.addOrUpdateArtist({ spotifyId: artist }, updateJson);
    }
  }

  await databaseController.addOrUpdateTrack(trackJson, updateJson);
}


const listeningHistory = require('./exampledata.json')

loadHistory = async function() {

  await sleep(1000);

  console.log(listeningHistory.length, 'songs in list');

  for (var track of listeningHistory) {
    await addTrackToDatabase(track);
  }

  console.log('Done.')
}


// require('../spotify/getAccessToken')()
loadHistory();
