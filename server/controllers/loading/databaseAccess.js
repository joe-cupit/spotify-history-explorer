const models = require('../../models/models')


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
  findOneAndUpdate(models.Track, trackJson, updateJson);
}


exports.addOrUpdateArtist = async function(artistJson, updateJson) {
  findOneAndUpdate(models.Artist, artistJson, updateJson);
}


exports.getArtistsFromTrackIfExists = async function(trackId) {
  artistList = null;
  try {
    const response = await models.Track.findOne(
                    { spotifyId: trackId }, 'artists')
                    .exec();
    artistList = response['artists'];
  } catch (err) {
    artistList = null;
  }

  return artistList;
}

