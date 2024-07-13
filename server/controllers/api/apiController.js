const spotifyAccess = require('../spotify/apiAccess');
const databaseAccesss = require('../../dbaccess/databaseAccess');


exports.toplist = async (req, res) => {
  const type = req.params.type;
  const limit = req.params.limit;

  var mongoTopList = null;
  switch (type) {
    case "artist":
      mongoTopList = await databaseAccesss.getArtistsOrderByTimeListened(limit);
      break;
    case "track":
      mongoTopList = await databaseAccesss.getTracksOrderByTimeListened(limit);
      break;
    case "album":
      mongoTopList = await databaseAccesss.getAlbumsOrderByTimeListened(limit);
      break;
    case "show":
      mongoTopList = await databaseAccesss.getShowsOrderByTimeListened(limit);
      break;
  }

  res.send(mongoTopList);
}


exports.artist = async (req, res) => {
  const id = req.params.id;

  const mongoArtistData = await databaseAccesss.getArtistById(id);

  if (!mongoArtistData) {
    // deal with never listened to.
    res.send({});
    return;
  }

  var resultJson = {};

  if (mongoArtistData.name && mongoArtistData.imageURL
      && mongoArtistData.followers && mongoArtistData.popularity) {
    resultJson = JSON.parse(JSON.stringify(mongoArtistData));
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

    resultJson = Object.assign({}, spotifyJson, databaseJson);
  }

  const mongoTopTracks = await databaseAccesss.getTopTracksByArtist(id, 5);
  resultJson.topTracks = mongoTopTracks;

  const artistRank = await databaseAccesss.getArtistRank(id);
  resultJson.rank = artistRank;

  res.send(resultJson);  
};


exports.album = async (req, res) => {
  const id = req.params.id;

  const mongoAlbumData = await databaseAccesss.getAlbumById(id);

  if (!mongoAlbumData) {
    // deal with never listened to.
    res.send({});
    return;
  }

  const spotifyAlbumData = await spotifyAccess.getAlbum(id);

  if (!(mongoAlbumData.name && mongoAlbumData.artists
      && mongoAlbumData.imageURL && mongoAlbumData.totalTracks
      && mongoAlbumData.releaseDate && mongoAlbumData.albumType)) {
    const spotifyJson = {
      name: spotifyAlbumData.name,
      artists: [spotifyAlbumData.artists[0].id],
      imageURL: spotifyAlbumData.images[0].url,
      totalTracks: spotifyAlbumData.total_tracks,
      releaseDate: spotifyAlbumData.release_date,
      albumType: spotifyAlbumData.album_type
    };
    databaseAccesss.addOrUpdateAlbum({ spotifyId: id }, spotifyJson);

    const databaseJson = {
      spotifyId: id,
      totalListeningCount: mongoAlbumData.totalListeningCount,
      totalListeningTime: mongoAlbumData.totalListeningTime,
      skippedCount: mongoAlbumData.skippedCount
    };
  
    albumJson = Object.assign({}, spotifyJson, databaseJson);
  } else {
    albumJson = JSON.parse(JSON.stringify(mongoAlbumData));
  }

  albumJson.tracks = []
  for (let track of spotifyAlbumData.tracks.items) {
    let mongoTrackData = await databaseAccesss.getTrackById(track.id);
    albumJson.tracks.push(mongoTrackData);
  }
  
  albumJson.artistNames = [spotifyAlbumData.artists[0].name];
  res.send(albumJson);
};


exports.track = async (req, res) => {
  const id = req.params.id;

  const mongoTrackData = await databaseAccesss.getTrackById(id);

  if (!mongoTrackData) {
    const spotifyTrackData = await spotifyAccess.getTrack(id);

    var artistIds = []; var artistNames = [];
    for (let artist of spotifyTrackData.artists) {
      artistIds.push(artist.id);
      artistNames.push(artist.name);
    }

    const trackJson = {
      name: spotifyTrackData.name,
      artistIds: artistIds,
      artistNames: artistNames,
      albumId: spotifyTrackData.album.id,
      imageURL: spotifyTrackData.album.images[0].url,
      duration: spotifyTrackData.duration_ms,
      releaseDate: spotifyTrackData.album.release_date,
      popularity: spotifyTrackData.popularity,

      spotifyId: id,
      totalListeningCount: 0,
      totalListeningTime: 0,
      skippedCount: 0
    };
    databaseAccesss.addOrUpdateTrack({ spotifyId: id }, trackJson);

    res.send(trackJson);
    return;
  }


  if (mongoTrackData.name && mongoTrackData.albumId
      && mongoTrackData.artistIds[0]  && mongoTrackData.artistNames[0]
      && mongoTrackData.imageURL && mongoTrackData.duration
      && mongoTrackData.releaseDate && mongoTrackData.popularity) {
    
    res.send(mongoTrackData);
  } else {
    const spotifyTrackData = await spotifyAccess.getTrack(id);

    var artistIds = []; var artistNames = [];
    for (let artist of spotifyTrackData.artists) {
      artistIds.push(artist.id);
      artistNames.push(artist.name);
    }

    const spotifyJson = {
      name: spotifyTrackData.name,
      artistIds: artistIds,
      artistNames: artistNames,
      albumId: spotifyTrackData.album.id,
      imageURL: spotifyTrackData.album.images[0].url,
      duration: spotifyTrackData.duration_ms,
      releaseDate: spotifyTrackData.album.release_date,
      popularity: spotifyTrackData.popularity
    };
    databaseAccesss.addOrUpdateTrack({ spotifyId: id }, spotifyJson);

    const databaseJson = {
      spotifyId: id,
      totalListeningCount: mongoTrackData.totalListeningCount,
      totalListeningTime: mongoTrackData.totalListeningTime,
      skippedCount: mongoTrackData.skippedCount
    };

    res.send(Object.assign({}, spotifyJson, databaseJson));
  }

};

exports.show = async (req, res) => {
  const id = req.params.id;

  const mongoShowData = await databaseAccesss.getShowById(id);

  if (!mongoShowData) {
    // deal with never listened to.
    res.send({});
    return;
  }

  var resultJson = {};

  if (mongoShowData.name && mongoShowData.imageURL
      && mongoShowData.totalEpisodes) {
    resultJson = JSON.parse(JSON.stringify(mongoShowData));
  } else {
    const spotifyArtistData = await spotifyAccess.getArtist(id);

    const spotifyJson = {
      name: spotifyArtistData.name,
      imageURL: spotifyArtistData.images[1].url,
      totalEpisodes: spotifyArtistData.total_episodes,
    };
    databaseAccesss.addOrUpdateArtist({ spotifyId: id }, spotifyJson);

    const databaseJson = {
      spotifyId: id,
      totalListeningCount: mongoShowData.totalListeningCount,
      totalListeningTime: mongoShowData.totalListeningTime,
      skippedCount: mongoShowData.skippedCount
    };

    resultJson = Object.assign({}, spotifyJson, databaseJson);
  }

  const mongoTopEpisodes = await databaseAccesss.getTopEpisodesByShow(id, 5);
  resultJson.topTracks = mongoTopEpisodes;

  const showRank = await databaseAccesss.getShowRank(id);
  resultJson.rank = showRank;

  res.send(resultJson);  
};


exports.search = async (req, res) => {
  var types = req.params.types.split("+");
  var term = req.params.term;
  var limit = req.params.limit;

  const spotifySearchResult = await spotifyAccess.searchFor(term, types, limit);
  res.json(spotifySearchResult);
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




exports.homepage = async (req, res) => {
  const totalTime = await databaseAccesss.getTotalTime();
  
  res.send({totalTime: totalTime});
}


exports.getTrackChartData = async (req, res) => {
  const trackId = req.params.id;

  const trackChartData = await databaseAccesss.getTrackHistory(trackId);

  res.send(trackChartData);
}
