const mongoose = require('mongoose');

const trackSchema = mongoose.Schema({
  spotifyId: String,            // spotify id for the track
  name: String,                 // name of the track
  artists: [String],            // list of spotify ids for track artists

  totalListeningTime: Number,   // total time listened to track in ms
  
  firstListenedDate: Date,      // date of first song listened by track
  firstListenedSongId: String,  // spotify id of first song listened by track

  lastListenedDate: Date,       // date of latest song listened by track
  lastListenedSongId: String,   // spotify id of latest song listened by track
})

module.exports = mongoose.model('tracks', trackSchema);
