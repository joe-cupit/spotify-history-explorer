const mongoose = require('mongoose');
const types = require('./schemaTypes');


const episodeSchema = mongoose.Schema({
  // episode id and name
  spotifyId: types.Required(String),
  name: String,


  // meta data
  showId: String,        // show spotify id

  imageURL: String,      // url for album cover
  duration: Number,      // duration of episode (ms)
  releaseDate: String,   // date of episode release


  // historical data
  totalListeningCount: types.DefaultNumber,  // number of time listened
  totalListeningTime: types.DefaultNumber,   // total time listened (ms)
  skippedCount: types.DefaultNumber,         // number of time skipped
  
  firstListenedDate: Date,        // first time episode was listened to
  latestListenedDate: Date,       // most recent time episode was listened to
})


module.exports = mongoose.model('episodes', episodeSchema);
