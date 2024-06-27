const mongoose = require('mongoose');
const types = require('./schemaTypes');


const showSchema = mongoose.Schema({
  // show id and name
  spotifyId: types.Required(String),
  name: String,


  // meta data
  imageURL: String,        // url for artist photo
  totalEpisodes: Number,   // number of episodes for the show


  // historical data
  totalListeningCount: types.DefaultNumber,  // number of time listened
  totalListeningTime: types.DefaultNumber,   // total time listened (ms)
  skippedCount: types.DefaultNumber,         // number of time skipped
  
  firstListenedDate: Date,        // first time show was listened to
  firstListenedTrackId: String,   // spotify id of first episode

  latestListenedDate: Date,       // most recent time show was listened to
  latestListenedTrackId: String,  // spotify id of recent episode
})

module.exports = mongoose.model('shows', showSchema);
