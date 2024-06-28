const spotifyAccess = require('../spotify/apiAccess');
const databaseAccesss = require('../../dbaccess/databaseAccess');


exports.artist = async (req, res) => {
  const id = req.params.id;

  const mongoArtistData = await databaseAccesss.getArtistById(id);

  if (!mongoArtistData) {
    // deal with never listened to.
    res.send({});
    return;
  }


  if (mongoArtistData.name && mongoArtistData.imageURL
      && mongoArtistData.followers && mongoArtistData.popularity) {
    res.send(mongoArtistData);
  } else {
    const spotifyArtistData = await spotifyAccess.getArtist(id);

    const spotifyJson = {
      name: spotifyArtistData.name,
      imageURL: spotifyArtistData.images[1].url,
      followers: spotifyArtistData.followers.total,
      popularity: spotifyArtistData.popularity
    };
    databaseAccesss.addOrUpdateArtist({ spotifyId: id }, spotifyJson);

    const databaseJson = {
      spotifyId: id,
      totalListeningCount: mongoArtistData.totalListeningCount,
      totalListeningTime: mongoArtistData.totalListeningTime,
      skippedCount: mongoArtistData.skippedCount
    };

    res.send(Object.assign({}, spotifyJson, databaseJson));
  }

};


exports.track = async (req, res) => {
  const id = req.params.id;

  const mongoTrackData = await databaseAccesss.getTrackById(id);

  if (!mongoTrackData) {
    // deal with never listened to.
    res.send({});
    return;
  }


  if (mongoTrackData.name && mongoTrackData.artists && mongoTrackData.albumId
      && mongoTrackData.imageURL && mongoTrackData.duration
      && mongoTrackData.releaseDate && mongoTrackData.popularity) {
    
    res.send(mongoTrackData);
  } else {
    const spotifyTrackData = await spotifyAccess.getTrack(id);

    const spotifyJson = {
      name: spotifyTrackData.name,
      artists: spotifyTrackData.artists,
      albumId: spotifyTrackData.album.id,
      imageURL: spotifyTrackData.album.images[0].url,
      duration: spotifyTrackData.duration_ms,
      releaseDate: spotifyTrackData.album.release_date,
      popularity: spotifyTrackData.popularity
    };
    databaseAccesss.addOrUpdateTrack({ spotifyId: id }, spotifyJson);

    const databaseJson = {
      spotifyId: id,
      listenCount: mongoTrackData.totalListeningCount,
      listenTime: mongoTrackData.totalListeningTime,
      skippedCount: mongoTrackData.skippedCount
    };

    res.send(Object.assign({}, spotifyJson, databaseJson));
  }

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


exports.getTopTracksByArtist = async (req, res) => {
  const artistId = req.params.id;
  const limit = req.params.limit;

  const mongoTopTracks = await databaseAccesss.getTopTracksByArtist(artistId, limit);
  res.send(mongoTopTracks);
}


exports.getArtistRank = async (req, res) => {
  const artistId = req.params.id;

  const artistRank = await databaseAccesss.getArtistRank(artistId);
  res.send({ artistRank: artistRank });
}
