const dbController = require('../database/databaseController');
const spotifyAccess = require('../spotify/spotifyController').access;


exports.artist = async (req, res) => {
  const id = req.params.id;

  let resultJson = await dbController.query.getArtistById(id);

  const requiredParams = ['name', 'imageURL', 'followers', 'popularity'];
  if (!resultJson || !!requiredParams.every( k => resultJson.hasOwnProperty(k))) {
    const spotifyData = await spotifyAccess.getArtist(id);

    resultJson = await dbController.modify.addOrUpdateArtist({spotifyId: id}, spotifyData);
  }

  resultJson = JSON.parse(JSON.stringify(resultJson));

  resultJson.topTracks = await dbController.query.getTracksByArtistOrderByListenTime(id);
  resultJson.rank = await dbController.query.getArtistRank(id);

  const historyData = await dbController.query.getHistoryByArtist(id);
  resultJson.firstListenDate = historyData.firstListen.date;
  resultJson.firstListenTrack = await getTrack(historyData.firstListen.trackId);

  resultJson.mostListen = {
    date: historyData.mostDate,
    count: historyData.mostCount,
    time: historyData.mostTime
  };

  res.send(resultJson);
}

exports.album = async (req, res) => {
  const id = req.params.id;

  let resultJson = await dbController.query.getAlbumById(id);

  const requiredParams = ['name', 'artistIds', 'artistNames', 'trackIds',
                          'imageURL', 'albumType', 'totalTracks', 'releaseDate'];
  if (!resultJson || !!requiredParams.every( (k) => resultJson.hasOwnProperty(k) )) {
    const spotifyData = await spotifyAccess.getAlbum(id);

    resultJson = await dbController.modify.addOrUpdateAlbum({spotifyId: id}, spotifyData);
  }

  resultJson = JSON.parse(JSON.stringify(resultJson));

  let tracksData = [];
  for (let trackId of resultJson.trackIds) {
    var trackData = await getTrack(trackId);
    tracksData.push(trackData);
  }
  resultJson.tracks = tracksData

  const historyData = await dbController.query.getHistoryByAlbum(id);
  resultJson.firstListenDate = historyData.firstListen.date;
  resultJson.firstListenTrack = await getTrack(historyData.firstListen.trackId);

  resultJson.mostListen = {
    date: historyData.mostDate,
    count: historyData.mostCount,
    time: historyData.mostTime
  };

  res.send(resultJson);
}


const getTrack = async function(id) {
  let resultJson = await dbController.query.getTrackById(id);

  const requiredParams = ['name', 'artistIds', 'artistNames', 'albumId',
                          'imageURL', 'duration', 'releaseDate', 'popularity'];
  if (!resultJson || !!requiredParams.every( (k) => resultJson.hasOwnProperty(k) )) {
    console.log('a;skldfjaw;oeih')
    const spotifyData = await spotifyAccess.getTrack(id);

    resultJson = await dbController.modify.addOrUpdateTrack({spotifyId: id}, spotifyData);
  }

  resultJson = JSON.parse(JSON.stringify(resultJson));

  const historyData = await dbController.query.getHistoryByTrack(id);
  resultJson.firstListenDate = historyData.firstListen.date;

  resultJson.mostListen = {
    date: historyData.mostDate,
    count: historyData.mostCount,
    time: historyData.mostTime
  };

  return resultJson;
}

exports.track = async (req, res) => {
  const id = req.params.id;
  const resultJson = await getTrack(id);
  res.send(resultJson);
}


exports.show = async (req, res) => {
  const id = req.params.id;

  let resultJson = await dbController.query.getShowById(id);

  const requiredParams = ['name', 'imageURL', 'totalEpisodes'];
  if (!resultJson || !!requiredParams.every( (k) => resultJson.hasOwnProperty(k) )) {
    const spotifyData = await spotifyAccess.getShow(id);

    resultJson = await dbController.modify.addOrUpdateShow({spotifyId: id}, spotifyData);
  }

  resultJson = JSON.parse(JSON.stringify(resultJson));

  resultJson.topEpisodes = await dbController.query.getEpisodesByShowOrderByListenTime(id);
  resultJson.rank = await dbController.query.getShowRank(id);

  const historyData = await dbController.query.getHistoryByShow(id);
  resultJson.firstListenDate = historyData.firstListen.date;
  resultJson.firstListenEpisode = await dbController.query.getEpisodeById(historyData.firstListen.trackId);

  resultJson.mostListen = {
    date: historyData.mostDate,
    count: historyData.mostCount,
    time: historyData.mostTime
  };

  res.send(resultJson);
}


exports.toplist = async (req, res) => {
  const type = req.params.type;
  const limit = req.params.limit;

  var mongoTopList = null;
  switch (type) {
    case "artist":
      mongoTopList = await dbController.query.getArtistsOrderByTimeListened(limit);
      break;
    case "track":
      mongoTopList = await dbController.query.getTracksOrderByTimeListened(limit);
      break;
    case "album":
      mongoTopList = await dbController.query.getAlbumsOrderByTimeListened(limit);
      break;
    case "show":
      mongoTopList = await dbController.query.getShowsOrderByTimeListened(limit);
      break;
    default:
      mongoTopList = null;
  }

  res.send(mongoTopList);
}


exports.search = async (req, res) => {
  var types = req.params.types.split("+");
  var term = req.params.term;
  var limit = req.params.limit;

  const spotifySearchResult = await spotifyAccess.searchFor(term, types, limit);
  res.json(spotifySearchResult);
};


exports.homepage = async (req, res) => {
  const totalTime = await dbController.query.getTotalTime();
  
  res.send({totalTime: totalTime});
}

exports.getTrackChartData = async (req, res) => {
  const trackId = req.params.id;
  const trackDuration = req.params.maxlen;

  var listenDurations = await dbController.query.getTrackHistory(trackId);

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
