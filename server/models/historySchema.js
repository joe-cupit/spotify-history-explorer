const mongoose = require('mongoose');
const types = require('./schemaTypes');


const historySchema = mongoose.Schema({
  // spotify id and name
  spotifyId: types.Required(String),
  name: String,


  type: types.Required(String),   // either 'track' or 'episode'

  // track data
  artistName: String,
  albumName: String,

  // episode data
  showName: String,


  // historical data
  listenedOn: types.Required(Date),      // date and time of listen
  listenedFor: types.Required(Number),   // time played in ms

  skipped: types.DefaultBoolean,  // true if track was skipped
  shuffle: types.DefaultBoolean,  // true if shuffle was on while listening
  offline: types.DefaultBoolean,  // true if it was listened to offline
})


module.exports = mongoose.model('history', historySchema, 'history');
