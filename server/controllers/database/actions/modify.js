const tryCatchWrapper = require('./errorhandling');
const { Artist, Album, Track, Show, Episode, History } = require('../../../models/models')


findOneAndUpdate = tryCatchWrapper(async (Model, json, update) => {
  if (!json) {
    return null;
  }
  
  newData = await Model.findOneAndUpdate(
    json,
    update,
    {
      new: true,
      upsert: true
    }
  );

  return newData;
})

exports.addOrUpdateArtist = async (artistJson, updateJson) => {
  return await findOneAndUpdate(Artist, artistJson, updateJson);
}
exports.addOrUpdateAlbum = async (albumJson, updateJson) => {
  return await findOneAndUpdate(Album, albumJson, updateJson);
}
exports.addOrUpdateTrack = async (trackJson, updateJson) => {
  return await findOneAndUpdate(Track, trackJson, updateJson);
}
exports.addOrUpdateShow = async (showJson, updateJson) => {
  return await findOneAndUpdate(Show, showJson, updateJson);
}
exports.addOrUpdateEpisode = async (episodeJson, updateJson) => {
  return await findOneAndUpdate(Episode, episodeJson, updateJson);
}


exports.addHistoryEntry = async function(historyJson) {
  isNewEntry = false;
  try {
    newEntry = new History(historyJson);
    await newEntry.save();
    isNewEntry = true;
  } catch (err) {
    if (err.code === 11000) {
      console.log('[MongoDB] Skipping duplicate entry');
      isNewEntry = false;
    }
    else {
      console.log(`[MongoDB] Error adding history entry to database`);
      console.log('[MongoDB]', err);
    }
  }

  return isNewEntry;
}
