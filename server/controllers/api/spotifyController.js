const spotifyAccess = require('../spotify/apiAccess');


exports.artist = async (req, res) => {
  var id = req.params.id;

  const spotifyArtistData = await spotifyAccess.getArtist(id);
  res.send(spotifyArtistData);

};


exports.track = async (req, res) => {
  var id = req.params.id;

  const spotifyTrackData = await spotifyAccess.getTrack(id);
  res.send(spotifyTrackData);

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
