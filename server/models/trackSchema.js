const mongoose = require('mongoose');
const types = require('./schemaTypes');


const trackSchema = mongoose.Schema({
  // track id and name
  spotifyId: types.Required(String),
  name: String,


  // meta data
  artists: [String],     // list of artist spotify ids
  albumId: String,       // album spotify id

  imageURL: String,      // url for album cover
  duration: Number,      // duration of song (ms)
  releaseDate: String,   // date of track's album release
  popularity: Number,    // track popularity (0-100)


  // historical data
  totalListeningCount: types.DefaultNumber,  // number of time listened
  totalListeningTime: types.DefaultNumber,   // total time listened (ms)
  skippedCount: types.DefaultNumber,         // number of time skipped
  
  firstListenedDate: Date,        // first time track was listened to
  latestListenedDate: Date,       // most recent time track was listened to
})


module.exports = mongoose.model('tracks', trackSchema);
