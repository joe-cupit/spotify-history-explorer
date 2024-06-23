const mongoose = require('mongoose');

const artistSchema = mongoose.Schema({
  spotifyId: String,            // spotify id for the artist
  name: String,                 // name of the artist

  totalListeningTime: Number,   // total time listened to artist in ms
  
  firstListenedDate: Date,      // date of first song listened by artist
  firstListenedSongId: String,  // spotify id of first song listened by artist

  lastListenedDate: Date,       // date of latest song listened by artist
  lastListenedSongId: String,   // spotify id of latest song listened by artist
})

module.exports = mongoose.model('artists', artistSchema);
