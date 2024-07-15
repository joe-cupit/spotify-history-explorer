const dbModify = require('../actions/modify');
const dbQuery = require('../actions/query');
const spotifyAccess = require('../../spotify/spotifyController').access;


const addEpisodeToDatabase = async function(episodeEntry) {
  // extract the track's id
  const episodeId = episodeEntry.spotify_episode_uri.split(':')[2];

  // add a history entry to the database
  var historyJson = {
    spotifyId: episodeId,
    name: episodeEntry.episode_name,
    type: 'episode',

    showName: episodeEntry.episode_show_name,

    listenedOn: new Date(episodeEntry.ts),
    listenedFor: episodeEntry.ms_played,
    skipped: episodeEntry.skipped,
    shuffle: episodeEntry.shuffle,
    offline: episodeEntry.offline
  }
  if (!(await dbModify.addHistoryEntry(historyJson))) {
    return -1;
  }

  // json to update other tables
  var updateJson = {
    $inc: {
      totalListeningCount: 1,
      totalListeningTime: episodeEntry.ms_played,
      skippedCount: episodeEntry.skipped ? 1 : 0
    }
  }

  var episodeJson = {spotifyId: episodeId};
  var showJson = null;

  // get show id if episode already in database
  const showId = await dbQuery.getEpisodeShow(episodeId);

  if (showId) {
    console.log('[MongoDB] Episode info found in database');
    showJson = {spotifyId: showId}
  }
  else {
    const spotifyEpisodeData = await spotifyAccess.getEpisodeExtended(episodeId);

    const showData = spotifyEpisodeData.showData;
    showJson = {
      spotifyId: showData.id,
      name: showData.name,
  
      imageURL: showData.images[0].url,
      totalEpisodes: showData.total_episodes,
    }

    episodeJson = spotifyEpisodeData.episodeJson;
  }

  // update relevant database tables
  await dbModify.addOrUpdateShow(showJson, updateJson);
  await dbModify.addOrUpdateEpisode(episodeJson, updateJson);
}


module.exports = addEpisodeToDatabase;
