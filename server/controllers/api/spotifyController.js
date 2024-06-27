const spotifyAccess = require('../spotify/apiAccess');
const databaseAccesss = require('../../dbaccess/databaseAccess');


exports.artist = async (req, res) => {
  var id = req.params.id;

  const spotifyArtistData = await spotifyAccess.getArtist(id);
  const mongoArtistData = await databaseAccesss.getArtistById(id);

  res.json({
    spotify: spotifyArtistData,
    mongodb: mongoArtistData
  });

};


exports.track = async (req, res) => {
  var id = req.params.id;

  const spotifyTrackData = await spotifyAccess.getTrack(id);
  const mongoTrackData = await databaseAccesss.getTrackById(id);
  // TODO: If never listened to sort that out.
  
  res.json({
    spotify: spotifyTrackData,
    mongodb: mongoTrackData
  });

};


exports.search = async (req, res) => {
  var type = req.params.type;
  var term = req.params.term;

  const validSearchTypes = new Set(['artist', 'track', 'album', 'episode']);

  if (validSearchTypes.has(type)) {
    const spotifySearchResult = await spotifyAccess.searchFor(term, [type]);
    res.json(spotifySearchResult);
  } else {
    console.log(`[Spotify] Invalid search type: '${type}'`);
    res.send({});
  }
};
