const sleep = require('../sleep');

const databaseController = require('../../dbaccess/databaseAccess');
const spotifyController = require('../spotify/apiController');
const spotifyAccess = require('../spotify/apiAccess');


async function addArtistsToDatabase(artists, updateJson) {
  idList = []
  for (const spotifyArtistData of artists) {
    var artistJson = {
      spotifyId: spotifyArtistData.id,
      name: spotifyArtistData.name,
      // imageURL: spotifyArtistData.images[0].src,
      // followers: spotifyArtistData.followers,
      // popularity: spotifyArtistData.popularity
    }
    await databaseController.addOrUpdateArtist(artistJson, updateJson);

    idList.push(spotifyArtistData.id);
  }

  return idList;
}


async function addAlbumToDatabase(spotifyAlbumData, updateJson) {
  var albumJson = {
    spotifyId: spotifyAlbumData.id,
    name: spotifyAlbumData.name,
    artists: spotifyAlbumData.artists.map(a => a.id),

    imageURL: spotifyAlbumData.images[0].url,
    albumType: spotifyAlbumData.album_type,
    totalTracks: spotifyAlbumData.total_tracks,
    releaseDate: spotifyAlbumData.release_date,
  }

  await databaseController.addOrUpdateAlbum(albumJson, updateJson);
}


async function addTrackToDatabase(trackEntry) {
  const trackId = trackEntry.spotify_track_uri.split(':')[2];

  var historyJson = {
    spotifyId: trackId,
    name: trackEntry.master_metadata_track_name,
    type: 'track',

    artistName: trackEntry.master_metadata_album_artist_name,
    albumName: trackEntry.master_metadata_album_album_name,

    listenedOn: new Date(trackEntry.ts),
    listenedFor: trackEntry.ms_played,
    skipped: trackEntry.skipped,
    shuffle: trackEntry.shuffle,
    offline: trackEntry.offline
  }
  
  const isNew = await databaseController.addHistoryEntry(historyJson);
  if (!isNew) {
    return -1;
  }

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

  var [ artistList, albumId ] = await databaseController.getArtistsAndAlbumFromTrackIfExists(trackId);

  if (artistList && albumId) {
    console.log('[MongoDB] Track info found in database');
    for (var artistId of artistList) {
      await databaseController.addOrUpdateArtist({ spotifyId: artistId }, updateJson);
    }

    await databaseController.addOrUpdateAlbum({ spotifyId: albumId }, updateJson);
  }
  else {
    await spotifyController.callPermission();

    const spotifyTrackData = await spotifyAccess.getTrack(trackId);
    if (spotifyTrackData) {
      artistList = await addArtistsToDatabase(spotifyTrackData.artists, updateJson);

      trackJson.name = spotifyTrackData.name;
      trackJson.artists = artistList;
      trackJson.albumId = spotifyTrackData.album.id;
      trackJson.imageURL = spotifyTrackData.album.images[0].url;
      trackJson.duration = spotifyTrackData.duration_ms;
      trackJson.releaseDate = spotifyTrackData.album.release_date;
      trackJson.popularity = spotifyTrackData.popularity;

      await addAlbumToDatabase(spotifyTrackData.album, updateJson);
    }
  }

  await databaseController.addOrUpdateTrack(trackJson, updateJson);
}


async function addShowToDatabase(spotifyShowData, updateJson) {
  var showJson = {
    spotifyId: spotifyShowData.id,
    name: spotifyShowData.name,

    imageURL: spotifyShowData.images[0].url,
    totalEpisodes: spotifyShowData.total_episodes,
  }

  await databaseController.addOrUpdateShow(showJson, updateJson);
}


async function addEpisodeToDatabase(episodeEntry) {
  const episodeId = episodeEntry.spotify_episode_uri.split(':')[2];

  var historyJson = {
    spotifyId: episodeId,
    name: episodeEntry.episode_name,
    type: 'episode',

    showName: episodeEntry.episode_show_name,

    listenedOn: new Date(episodeEntry.ts),
    listenedFor: episodeEntry.ms_played,
    skipped: episodeEntry.skipped,
    shuffle: episodeEntry.shuffle,
    offline: episodeEntry.offline
  }
  
  const isNew = await databaseController.addHistoryEntry(historyJson);
  if (!isNew) {
    return -1;
  }

  var updateJson = {
    $inc: {
      totalListeningCount: 1,
      totalListeningTime: episodeEntry.ms_played,
      skippedCount: episodeEntry.skipped ? 1 : 0
    }
  }

  var episodeJson = {
    spotifyId: episodeId
  }

  var showId = await databaseController.getShowFromEpisodeIfExists(episodeId);
  if (showId) {
    console.log('[MongoDB] Episode info found in database');
    await databaseController.addOrUpdateShow({ spotifyId: showId }, updateJson);
  }
  else {
    await spotifyController.callPermission();

    const spotifyEpisodeData = await spotifyAccess.getEpisode(episodeId);
    if (spotifyEpisodeData) {

      episodeJson.name = spotifyEpisodeData.name;
      episodeJson.showId = spotifyEpisodeData.show.id;

      episodeJson.imageURL = spotifyEpisodeData.images[0].url;
      episodeJson.duration = spotifyEpisodeData.duration_ms;
      episodeJson.releaseDate = spotifyEpisodeData.release_date;

      await addShowToDatabase(spotifyEpisodeData.show, updateJson);
    }
  }

  await databaseController.addOrUpdateEpisode(episodeJson, updateJson);
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
