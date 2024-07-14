const access = require('./actions/access');
const callcontrol = require('./actions/callcontrol');


module.exports = {
  connectToSpotifyApi: access.connectToSpotifyApi,
  getSpotifyApi: access.getSpotifyApi,

  callcontrol,
  access
}
