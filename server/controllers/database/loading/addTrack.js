const dbModify = require('../actions/modify');
const dbQuery = require('../actions/query');
const spotifyAccess = require('../../spotify/spotifyController').access;


const addTrackToDatabase = async function(trackEntry) {
  // extract the track's id
  const trackId = trackEntry.spotify_track_uri.split(':')[2];

  // add a history entry to the database
  var historyJson = {
    type: 'track',

    spotifyId: trackId,
    name: trackEntry.master_metadata_track_name,
    artistIds: [],
    artistNames: [trackEntry.master_metadata_album_artist_name],
    albumId: '',
    albumName: trackEntry.master_metadata_album_album_name,

    listenedOn: new Date(trackEntry.ts),
    listenedFor: trackEntry.ms_played,
    skipped: trackEntry.skipped,
    shuffle: trackEntry.shuffle,
    offline: trackEntry.offline
  }
  if (!(await dbModify.addHistoryEntry(historyJson))) {
    return -1;
  }

  // json to update other tables
  var updateJson = {
    $inc: {
      totalListeningCount: 1,
      totalListeningTime: trackEntry.ms_played,
      skippedCount: trackEntry.skipped ? 1 : 0
    }
  }

  var trackJson = {spotifyId: trackId};
  var artistJsonList = [];
  var albumJson = null;

  // get artist and album ids if track already in database
  const [ artistIds, albumId ] = await dbQuery.getTrackArtistAndAlbum(trackId);

  if (artistIds && albumId) {
    console.log('[MongoDB] Track info found in database');

    for (let artistId of artistIds) {
      artistJsonList.push({spotifyId: artistId})
    }
    albumJson = {spotifyId: albumId}
  }
  else {
    const spotifyTrackData = await spotifyAccess.getTrackExtended(trackId);

    if (!spotifyTrackData) {
      console.log('[MongoDB] Removing from history');
      await dbModify.removeHistoryEntry(historyJson);
      return;
    }

    for (let artistData of spotifyTrackData.artistData) {
      artistJson = {
        spotifyId: artistData.id,
        name: artistData.name,
      }
      artistJsonList.push(artistJson);
    }

    const albumData = spotifyTrackData.albumData;
    albumJson = {
      spotifyId: albumData.id,
      name: albumData.name,
      artistIds: albumData.artists.map(a => a.id),
      artistNames: albumData.artists.map(a => a.name),

      imageURL: albumData.images[0].url,
      albumType: albumData.album_type,
      totalTracks: albumData.total_tracks,
      releaseDate: albumData.release_date,
    }

    trackJson = spotifyTrackData.trackJson;
  }

  // update relevant database tables
  for (let artistJson of artistJsonList) {
    await dbModify.addOrUpdateArtist(artistJson, updateJson);
  }
  await dbModify.addOrUpdateAlbum(albumJson, updateJson);
  await dbModify.addOrUpdateTrack(trackJson, updateJson);
}


module.exports = addTrackToDatabase;
