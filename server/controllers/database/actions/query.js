const tryCatchWrapper = require('./errorhandling');
const { Artist, Album, Track, Show, Episode, History } = require('../../../models/models')


/* Get one entry given its Spotify id */
getById = tryCatchWrapper(async (Model, id) => {
  console.log(`[MongoDB] Getting from ${Model.collection.collectionName} by id: '${id}'`);

  const result = await Model.findOne({ spotifyId: id });
  return result;
})

exports.getArtistById = async (artistId) => {
  return await getById(Artist, artistId);
}
exports.getAlbumById = async (albumId) => {
  return await getById(Album, albumId);
}
exports.getTrackById = async (trackId) => {
  return await getById(Track, trackId);
}
exports.getShowById = async (showId) => {
  return await getById(Show, showId);
}
exports.getEpisodeById = async (episodeId) => {
  return await getById(Episode, episodeId);
}


/* Get ordered list of different tables */
getOrderByTimeListened = tryCatchWrapper(async (Model, limit) => {
  console.log(`[MongoDB] Getting top ${Model.collection.collectionName}`);
  var result = null;
  if (limit) {
    result = await Model.find({})
                        .sort({ totalListeningTime: -1 })
                        .limit(limit);
  }
  else {
    result = await Model.find({})
                        .sort({ totalListeningTime: -1 });
  }
  return result;
})

exports.getArtistsOrderByTimeListened = async (limit=0) => {
  return await getOrderByTimeListened(Artist, limit);
}
exports.getAlbumsOrderByTimeListened = async (limit=0) => {
  return await getOrderByTimeListened(Album, limit);
}
exports.getTracksOrderByTimeListened = async (limit=0) => {
  return await getOrderByTimeListened(Track, limit);
}
exports.getShowsOrderByTimeListened = async (limit=0) => {
  return await getOrderByTimeListened(Show, limit);
}
exports.getEpisodesOrderByTimeListened = async (limit=0) => {
  return await getOrderByTimeListened(Episode, limit);
}



// ARTIST //
exports.getArtistRank = tryCatchWrapper(async (artistId) => {
  console.log(`[MongoDB] Getting rank of artist with id '${artistId}'`);
  const artistData = await Artist.findOne({ spotifyId: artistId }, 'totalListeningTime');
  const rank = await Artist.find({totalListeningTime: { "$gt": artistData.totalListeningTime }}).count();
  return rank+1;
})


// ALBUM //


// TRACK //
exports.getTrackArtistAndAlbum = tryCatchWrapper(async (trackId) => {
  const track = await Track.findOne({ spotifyId: trackId }, 'artistIds albumId');
  return [track.artistIds, track.albumId]
})

exports.getTracksByArtistOrderByListenTime = tryCatchWrapper(async (artistId, limit=0) => {
  console.log(`[MongoDB] Getting top tracks of artist with id '${artistId}'`);
  var topTracks = null;
  if (limit) {
    topTracks = await Track.find({ artists: artistId })
      .sort({ totalListeningTime: -1 })
      .limit(limit);
  } else {
    topTracks = await Track.find({ artists: artistId })
      .sort({ totalListeningTime: -1 });
  }
  return topTracks;
})


// SHOW //
exports.getShowRank = tryCatchWrapper(async (showId) => {
  console.log(`[MongoDB] Getting rank of show with id '${showId}'`);
  const artistData = await Show.findOne({ spotifyId: showId }, 'totalListeningTime');
  const rank = await Show.find({totalListeningTime: { "$gt": artistData.totalListeningTime }}).count();
  return rank+1;
})


// EPISODE //
exports.getEpisodeShow = tryCatchWrapper(async (episodeId) => {
  const episode = await Episode.findOne({ spotifyId: episodeId }, 'showId');
  return episode.showId;
})

exports.getEpisodesByShowOrderByListenTime = tryCatchWrapper(async (showId, limit=0) => {
  console.log(`[MongoDB] Getting top episodes of show with id '${showId}'`);
  var topTracks = null;
  if (limit) {
    topTracks = await Episode.find({ showId: showId })
      .sort({ totalListeningTime: -1 })
      .limit(limit);
  } else {
    topTracks = await Episode.find({ showId: showId })
      .sort({ totalListeningTime: -1 });
  }
  return topTracks;
})


// HISTORY //
exports.getTotalTime = tryCatchWrapper(async () => {
  timeData = await History.aggregate([{$group: {_id:null, sum:{$sum:"$listenedFor"}}}])
  return timeData[0].sum;
})

exports.getTrackHistory = tryCatchWrapper(async (trackId) => {
  const trackHistory = await History.find({spotifyId: trackId}, 'listenedOn listenedFor');

  var listenDurations = [];
  for (let track of trackHistory) {
    listenDurations.push(track.listenedFor);
  }
  return listenDurations;
})

