const mongoose = require('mongoose');

const historySchema = mongoose.Schema({
  trackId: String,       // spotify id for the track
  name: String,          // name of the track

  albumId: String,       // spotify id for the album
  albumName: String,     // name of the album

  artists: [String],     // list of spotify ids for track artists

  listenedOn: Date,      // date of first song listened by track
  listenedFor: Number,   // time played in ms

  skipped: Boolean,      // true if track was skipped
  shuffle: Boolean,      // true if shuffle was on while listening
  offline: Boolean,      // true if it was listened to offline
})

module.exports = mongoose.model('history', historySchema);
