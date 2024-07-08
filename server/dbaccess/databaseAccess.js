const models = require('../models/models')


findOneAndUpdate = async function(model, json, update) {
  try {
    await model.findOneAndUpdate(
      json,
      update,
      {
        new: true,
        upsert: true
      }
    );
  } catch (err) {
    console.log(`[MongoDB] Error adding to database`);
    console.log('[MongoDB]', err);
  }
}


exports.addOrUpdateTrack = async function(trackJson, updateJson) {
  await findOneAndUpdate(models.Track, trackJson, updateJson);
}


exports.addOrUpdateArtist = async function(artistJson, updateJson) {
  await findOneAndUpdate(models.Artist, artistJson, updateJson);
}


exports.addOrUpdateAlbum = async function(albumJson, updateJson) {
  await findOneAndUpdate(models.Album, albumJson, updateJson);
}


exports.addOrUpdateEpisode = async function(episodeJson, updateJson) {
  await findOneAndUpdate(models.Episode, episodeJson, updateJson);
}


exports.addOrUpdateShow = async function(showJson, updateJson) {
  await findOneAndUpdate(models.Show, showJson, updateJson);
}


exports.addHistoryEntry = async function(historyJson) {
  isNewEntry = false;
  try {
    newEntry = new models.History(historyJson);
    await newEntry.save();
    isNewEntry = true;
  } catch (err) {
    if (err.code === 11000) {
      console.log('[MongoDB] Skipping duplicate entry');
      isNewEntry = false;
    }
    else {
      console.log(`[MongoDB] Error adding history entry to database`);
      console.log('[MongoDB]', err);
    }
  }

  return isNewEntry;
}


exports.getArtistsAndAlbumFromTrackIfExists = async function(trackId) {
  var artistList = null;
  var albumId = null;
  try {
    const track = await models.Track.findOne({ spotifyId: trackId }, 'artists albumId');
    artistList = track.artists;
    albumId = track.albumId;
  } catch (err) {
    artistList = null;
  }

  return [ artistList, albumId ];
}


exports.getShowFromEpisodeIfExists = async function(episodeId) {
  var showId = null;
  try {
    const episode = await models.Episode.findOne({ spotifyId: episodeId }, 'showId');
    showId = episode.showId;
  } catch (err) {
    showId = null;
  }

  return showId;
}


exports.getArtistById = async function(artistId) {
  console.log('[MongoDB] Retrieving artist with id', artistId);
  try {
    const artistData = await models.Artist.findOne({ spotifyId: artistId });
    return artistData;
  } catch (err) {
    console.log('[MongoDB] Error finding artist');
    console.log('[MongoDB]', err);
    return null;
  }
}

exports.getAlbumById = async function(albumId) {
  console.log('[MongoDB] Retrieving album with id', albumId);
  try {
    const albumData = await models.Album.findOne({ spotifyId: albumId });
    return albumData;
  } catch (err) {
    console.log('[MongoDB] Error finding album');
    console.log('[MongoDB]', err);
    return null;
  }
}

exports.getTrackById = async function(trackId) {
  console.log('[MongoDB] Retrieving track with id', trackId);
  try {
    const trackData = await models.Track.findOne({ spotifyId: trackId });
    return trackData;
  } catch (err) {
    console.log('[MongoDB] Error finding track');
    console.log('[MongoDB]', err);
    return null;
  }
}

exports.getShowById = async function(showId) {
  console.log('[MongoDB] Retrieving show with id', showId);
  try {
    const showData = await models.Show.findOne({ spotifyId: showId });
    return showData;
  } catch (err) {
    console.log('[MongoDB] Error finding show');
    console.log('[MongoDB]', err);
    return null;
  }
}


exports.getTopTracksByArtist = async function(artistId, limit) {
  console.log('[MongoDB] Getting top songs for artist with id', artistId);
  var topTracks = null;
  try {
    if (limit) {
      topTracks = await models.Track.find({ artists: artistId })
        .sort({ totalListeningTime: -1 })
        .limit(limit);
    } else {
      topTracks = await models.Track.find({ artists: artistId })
        .sort({ totalListeningTime: -1 });
    }
    return topTracks;
  } catch (err) {
    console.log('[MongoDB] Error finding top songs');
    console.log('[MongoDB]', err);
    return null;
  }
}

exports.getTopEpisodesByShow = async function(showId, limit) {
  console.log('[MongoDB] Getting top episodes for show with id', showId);
  var topTracks = null;
  try {
    if (limit) {
      topTracks = await models.Episode.find({ showId: showId })
        .sort({ totalListeningTime: -1 })
        .limit(limit);
    } else {
      topTracks = await models.Episode.find({ showId: showId })
        .sort({ totalListeningTime: -1 });
    }
    return topTracks;
  } catch (err) {
    console.log('[MongoDB] Error finding top episodes');
    console.log('[MongoDB]', err);
    return null;
  }
}


exports.getArtistRank = async function(artistId) {
  console.log('[MongoDB] Getting rank for artist with id', artistId);

  try {
    const artistData = await models.Artist.findOne({ spotifyId: artistId }, 'totalListeningTime');
    const rank = await models.Artist.find({totalListeningTime: { "$gt": artistData.totalListeningTime }}).count();

    return rank+1;
  } catch (err) {
    console.log('[MongoDB] Error finding rank');
    console.log('[MongoDB]', err);
    return null;
  }
}

exports.getShowRank = async function(showId) {
  console.log('[MongoDB] Getting rank for show with id', showId);

  try {
    const artistData = await models.Show.findOne({ spotifyId: showId }, 'totalListeningTime');
    const rank = await models.Show.find({totalListeningTime: { "$gt": artistData.totalListeningTime }}).count();

    return rank+1;
  } catch (err) {
    console.log('[MongoDB] Error finding rank');
    console.log('[MongoDB]', err);
    return null;
  }
}


exports.getArtistsOrderByTimeListened = async function(limit) {
  console.log('[MongoDB] Getting top artists');
  var artistData = null;
  try {
    if (limit) {
      artistData = await models.Artist.find({})
        .sort({ totalListeningTime: -1 })
        .limit(limit);
    }
    else {
      artistData = await models.Artist.find({})
        .sort({ totalListeningTime: -1 });
    }
    return artistData;
  } catch (err) {
    console.log('[MongoDB] Error getting all artists');
    console.log('[MongoDB]', err);
    return null;
  }
}


exports.getTracksOrderByTimeListened = async function(limit) {
  console.log('[MongoDB] Getting top tracks');
  var trackData = null;
  try {
    if (limit) {
      trackData = await models.Track.find({})
        .sort({ totalListeningTime: -1 })
        .limit(limit);
    }
    else {
      trackData = await models.Track.find({})
        .sort({ totalListeningTime: -1 });
    }
    return trackData;
  } catch (err) {
    console.log('[MongoDB] Error getting top tracks');
    console.log('[MongoDB]', err);
    return null;
  }
}


exports.getAlbumsOrderByTimeListened = async function(limit) {
  console.log('[MongoDB] Getting top albums');
  var albumData = null;
  try {
    if (limit) {
      albumData = await models.Album.find({})
        .sort({ totalListeningTime: -1 })
        .limit(limit);
    }
    else {
      albumData = await models.Album.find({})
        .sort({ totalListeningTime: -1 });
    }
    return albumData;
  } catch (err) {
    console.log('[MongoDB] Error getting all albums');
    console.log('[MongoDB]', err);
    return null;
  }
}


exports.getShowsOrderByTimeListened = async function(limit) {
  console.log('[MongoDB] Getting top shows');
  var showData = null;
  try {
    if (limit) {
      showData = await models.Show.find({})
        .sort({ totalListeningTime: -1 })
        .limit(limit);
    }
    else {
      showData = await models.Show.find({})
        .sort({ totalListeningTime: -1 });
    }
    return showData;
  } catch (err) {
    console.log('[MongoDB] Error getting top shows');
    console.log('[MongoDB]', err);
    return null;
  }
}
