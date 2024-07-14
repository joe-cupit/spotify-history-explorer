const mongoose = require('mongoose');
const types = require('./schemaTypes');


const albumSchema = mongoose.Schema({
  // album id and name
  spotifyId: types.Required(String),    // album spotify id
  name: String,                       // album name


  // meta data
  artistIds: [String],        // list of artist spotify ids
  artistNames: [String],      // list of artist names

  imageURL: String,      // url for album cover
  albumType: String,     // either "album", "single" or "compilation"
  totalTracks: Number,   // number of tracks in the album
  releaseDate: String,   // date of album release


  // historical data
  totalListeningCount: types.DefaultNumber,  // number of time listened
  totalListeningTime: types.DefaultNumber,   // total time listened (ms)
  skippedCount: types.DefaultNumber,         // number of time skipped
  
  firstListenedDate: Date,        // first time album was listened to
  firstListenedTrackId: String,   // spotify id of first track

  latestListenedDate: Date,       // most recent time album was listened to
  latestListenedTrackId: String,  // spotify id of recent track
});


module.exports = mongoose.model('albums', albumSchema);
