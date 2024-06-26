const trackApiCalls = require('../spotify/callWindowController');
const sleep = require('../sleep');

const databaseController = require('./databaseAccess');
const spotifyController = require('../spotify/spotifyController');


async function addArtistsToDatabase(artists, updateJson) {
  idList = []
  for (const spotifyArtistData of artists) {
    var artistJson = {
      spotifyId: spotifyArtistData.id,
      name: spotifyArtistData.name,
      // imageURL: spotifyArtistData.images[0],
      // followers: spotifyArtistData.followers,
      // popularity: spotifyArtistData.popularity
    }
    await databaseController.addOrUpdateArtist(artistJson, updateJson);

    idList.push(spotifyArtistData.id);
  }

  return idList;
}


async function addTrackToDatabase(trackEntry) {
  const trackId = trackEntry.spotify_track_uri.split(':')[2];

  var historyJson = {
    trackId: trackId,
    name: trackEntry.master_metadata_track_name,
    artistName: trackEntry.master_metadata_album_artist_name,
    albumName: trackEntry.master_metadata_album_album_name,

    listenedOn: new Date(trackEntry.ts),
    listenedFor: trackEntry.ms_played,
    skipped: trackEntry.skipped,
    shuffle: trackEntry.shuffle,
    offline: trackEntry.offline
  }
  databaseController.addHistoryEntry(historyJson);

  var updateJson = {
    $inc: {
      totalListeningCount: 1,
      totalListeningTime: trackEntry.ms_played,
      skippedCount: trackEntry.skipped ? 1 : 0
    }
  }

  var trackJson = {
    spotifyId: trackId
  }

  var artistList = await databaseController.getArtistsFromTrackIfExists(trackId);

  if (artistList) {
    console.log('[MongoDB] Track info found in database');
    for (var artistId of artistList) {
      await databaseController.addOrUpdateArtist({ spotifyId: artistId }, updateJson);
    }
  }
  else {
    await trackApiCalls.callPermission();

    const spotifyTrackData = await spotifyController.getTrack(trackId);
    if (spotifyTrackData) {
      artistList = await addArtistsToDatabase(spotifyTrackData.artists, updateJson);

      trackJson.name = spotifyTrackData.name;
      trackJson.artists = artistList;
      trackJson.albumId = spotifyTrackData.album.id;
      trackJson.imageURL = spotifyTrackData.album.images[0].url;
      trackJson.duration = spotifyTrackData.duration_ms;
      trackJson.releaseDate = spotifyTrackData.album.release_date;
      trackJson.popularity = spotifyTrackData.popularity;
    }
  }

  await databaseController.addOrUpdateTrack(trackJson, updateJson);
}


async function addEpisodeToDatabase(episode) {
  console.log('[MongoDB] Podcast episode, not yet implemented.');
}


async function processHistoryItem(data) {
  if (data.spotify_track_uri) {
    await addTrackToDatabase(data);
  } else if (data.spotify_episode_uri) {
    await addEpisodeToDatabase(data);
  } else {
    console.log('[Server] Unknown Spotify history entry');
  }
}


const listeningHistory = require('./exampledata.json')

loadHistory = async function() {

  await sleep(1000);

  console.log(listeningHistory.length, 'songs in list');

  for (var track of listeningHistory) {
    await processHistoryItem(track);
  }

  console.log('Done.')
}


// require('../spotify/getAccessToken')()
loadHistory();
