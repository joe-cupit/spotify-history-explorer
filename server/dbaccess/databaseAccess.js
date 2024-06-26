const models = require('../models/models')


findOneAndUpdate = async function(model, json, update) {
  try {
    await model.findOneAndUpdate(
      json,
      update,
      {
        new: true,
        upsert: true
      }
    );
  } catch (err) {
    console.log(`[MongoDB] Error adding to database`);
    console.log('[MongoDB]', err);
  }
}


exports.addOrUpdateTrack = async function(trackJson, updateJson) {
  await findOneAndUpdate(models.Track, trackJson, updateJson);
}


exports.addOrUpdateArtist = async function(artistJson, updateJson) {
  await findOneAndUpdate(models.Artist, artistJson, updateJson);
}


exports.addOrUpdateAlbum = async function(albumJson, updateJson) {
  await findOneAndUpdate(models.Album, albumJson, updateJson);
}


exports.addHistoryEntry = async function(historyJson) {
  isNewEntry = false;
  try {
    newEntry = new models.History(historyJson);
    await newEntry.save();
    isNewEntry = true;
  } catch (err) {
    if (err.code === 11000) {
      console.log('[MongoDB] Duplicate entry, skipping track');
      isNewEntry = false;
    }
    else {
      console.log(`[MongoDB] Error adding history entry to database`);
      console.log('[MongoDB]', err);
    }
  }

  return isNewEntry;
}


exports.getArtistsAndAlbumFromTrackIfExists = async function(trackId) {
  var artistList = null;
  var albumId = null;
  try {
    const track = await models.Track.findOne({ spotifyId: trackId }, 'artists albumId')
    artistList = track.artists;
    albumId = track.albumId;
  } catch (err) {
    artistList = null;
  }

  return [ artistList, albumId ];
}

