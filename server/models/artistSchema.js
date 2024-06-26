const mongoose = require('mongoose');

const RequiredString = {
  type: String,
  required: true
}


const artistSchema = mongoose.Schema({
  spotifyId: RequiredString,    // spotify id for the artist
  name: RequiredString,         // name of the artist

  totalListeningCount: Number,
  totalListeningTime:  {        // total time listened to track in ms
    type: Number,
     default: 0
  },

  skippedCount: Number,
  
  firstListenedDate: Date,      // date of first song listened by artist
  firstListenedSongId: String,  // spotify id of first song listened by artist

  lastListenedDate: Date,       // date of latest song listened by artist
  lastListenedSongId: String,   // spotify id of latest song listened by artist
})

module.exports = mongoose.model('artists', artistSchema);
