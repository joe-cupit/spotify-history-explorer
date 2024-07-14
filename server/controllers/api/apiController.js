const spotifyAccess = require('../spotify/spotifyController').access;
const databaseController = require('../database/databaseController');
const databaseAccess = databaseController.query;
const databaseModify = databaseController.modify;


exports.toplist = async (req, res) => {
  const type = req.params.type;
  const limit = req.params.limit;

  var mongoTopList = null;
  switch (type) {
    case "artist":
      mongoTopList = await databaseAccess.getArtistsOrderByTimeListened(limit);
      break;
    case "track":
      mongoTopList = await databaseAccess.getTracksOrderByTimeListened(limit);
      break;
    case "album":
      mongoTopList = await databaseAccess.getAlbumsOrderByTimeListened(limit);
      break;
    case "show":
      mongoTopList = await databaseAccess.getShowsOrderByTimeListened(limit);
      break;
  }

  res.send(mongoTopList);
}


exports.artist = async (req, res) => {
  const id = req.params.id;

  const mongoArtistData = await databaseAccess.getArtistById(id);

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

    databaseModify.addOrUpdateArtist({ spotifyId: id }, spotifyArtistData);

    const databaseJson = {
      totalListeningCount: mongoArtistData.totalListeningCount,
      totalListeningTime: mongoArtistData.totalListeningTime,
      skippedCount: mongoArtistData.skippedCount
    };

    resultJson = Object.assign({}, spotifyArtistData, databaseJson);
  }

  const mongoTopTracks = await databaseAccess.getTracksByArtistOrderByListenTime(id, limit=5);
  resultJson.topTracks = mongoTopTracks;

  const artistRank = await databaseAccess.getArtistRank(id);
  resultJson.rank = artistRank;

  res.send(resultJson);  
};


exports.album = async (req, res) => {
  const id = req.params.id;

  const mongoAlbumData = await databaseAccess.getAlbumById(id);

  if (!mongoAlbumData) {
    // deal with never listened to.
    res.send({});
    return;
  }

  const spotifyAlbumData = await spotifyAccess.getAlbum(id);

  if (!(mongoAlbumData.name
      && mongoAlbumData.artistIds && mongoAlbumData.artistNames
      && mongoAlbumData.imageURL && mongoAlbumData.totalTracks
      && mongoAlbumData.releaseDate && mongoAlbumData.albumType)) {

    databaseModify.addOrUpdateAlbum({ spotifyId: id }, spotifyAlbumData);

    const databaseJson = {
      totalListeningCount: mongoAlbumData.totalListeningCount,
      totalListeningTime: mongoAlbumData.totalListeningTime,
      skippedCount: mongoAlbumData.skippedCount
    };
  
    albumJson = Object.assign({}, spotifyAlbumData, databaseJson);
  } else {
    albumJson = JSON.parse(JSON.stringify(mongoAlbumData));
  }

  albumJson.tracks = []
  for (let trackId of spotifyAlbumData.trackIds) {
    let mongoTrackData = await databaseAccess.getTrackById(trackId);
    albumJson.tracks.push(mongoTrackData);
  }
  
  res.send(albumJson);
};


exports.track = async (req, res) => {
  const id = req.params.id;

  const mongoTrackData = await databaseAccess.getTrackById(id);

  if (!mongoTrackData) {
    const spotifyTrackData = await spotifyAccess.getTrack(id);

    spotifyTrackData.totalListeningCount = 0;
    spotifyTrackData.totalListeningTime = 0;
    spotifyTrackData.skippedCount = 0;

    databaseModify.addOrUpdateTrack({ spotifyId: id }, spotifyTrackData);
    res.send(spotifyTrackData);
    return;
  }


  if (mongoTrackData.name && mongoTrackData.albumId
      && mongoTrackData.artistIds[0]  && mongoTrackData.artistNames[0]
      && mongoTrackData.imageURL && mongoTrackData.duration
      && mongoTrackData.releaseDate && mongoTrackData.popularity) {
    
    res.send(mongoTrackData);
  } else {
    const spotifyTrackData = await spotifyAccess.getTrack(id);

    databaseModify.addOrUpdateTrack({ spotifyId: id }, spotifyTrackData);

    const databaseJson = {
      totalListeningCount: mongoTrackData.totalListeningCount,
      totalListeningTime: mongoTrackData.totalListeningTime,
      skippedCount: mongoTrackData.skippedCount
    };

    res.send(Object.assign({}, spotifyTrackData, databaseJson));
  }

};

exports.show = async (req, res) => {
  const id = req.params.id;

  const mongoShowData = await databaseAccess.getShowById(id);

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
    const spotifyShowData = await spotifyAccess.getShow(id);

    databaseModify.addOrUpdateArtist({ spotifyId: id }, spotifyShowData);

    const databaseJson = {
      totalListeningCount: mongoShowData.totalListeningCount,
      totalListeningTime: mongoShowData.totalListeningTime,
      skippedCount: mongoShowData.skippedCount
    };

    resultJson = Object.assign({}, spotifyShowData, databaseJson);
  }

  const mongoTopEpisodes = await databaseAccess.getEpisodesByShowOrderByListenTime(id, limit=5);
  resultJson.topTracks = mongoTopEpisodes;

  const showRank = await databaseAccess.getShowRank(id);
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

  const mongoTopTracks = await databaseAccess.getTopTracksByArtist(artistId, limit);
  res.send(mongoTopTracks);
}


exports.getArtistRank = async (req, res) => {
  const artistId = req.params.id;

  const artistRank = await databaseAccess.getArtistRank(artistId);
  res.send({ artistRank: artistRank });
}




exports.homepage = async (req, res) => {
  const totalTime = await databaseAccess.getTotalTime();
  
  res.send({totalTime: totalTime});
}


exports.getTrackChartData = async (req, res) => {
  const trackId = req.params.id;
  const trackDuration = req.params.maxlen;

  var listenDurations = await databaseAccess.getTrackHistory(trackId);

  const listenCount = listenDurations.length;

  var xData = []; var yData = [];
  for (let t=0; t<=trackDuration; t+=1000) {
    listenDurations = listenDurations.filter(n => n>=t);

    xData.push(t);
    yData.push(listenDurations.length / listenCount);
  }

  res.send({
    xData: xData,
    yData: yData,
  })
}
