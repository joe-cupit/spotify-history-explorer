const mongoose = require('mongoose');
const types = require('./schemaTypes');


const artistSchema = mongoose.Schema({
  // artist id and name
  spotifyId: types.Required(String),
  name: String,


  // meta data
  imageURL: String,     // url for artist photo
  followers: Number,    // number of followers
  popularity: Number,   // artist popularity (0-100)


  // historical data
  totalListeningCount: types.DefaultNumber,  // number of time listened
  totalListeningTime: types.DefaultNumber,   // total time listened (ms)
  skippedCount: types.DefaultNumber,         // number of time skipped
  
  firstListenedDate: Date,        // first time artist was listened to
  firstListenedTrackId: String,   // spotify id of first track

  latestListenedDate: Date,       // most recent time artist was listened to
  latestListenedTrackId: String,  // spotify id of recent track
})

module.exports = mongoose.model('artists', artistSchema);
