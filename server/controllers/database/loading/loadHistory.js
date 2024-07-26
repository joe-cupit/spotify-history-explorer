const sleep = require('../../sleep');

const addTrackToDatabase = require('./addTrack');
const addEpisodeToDatabase = require('./addEpisode');


loadHistory = async function(dir) {

  const listeningHistory = require(dir);
  console.log(`[Server] Loading ${listeningHistory.length} songs...`);
  await sleep(1000);

  for (let item of listeningHistory.reverse()) {
    if (item.spotify_track_uri) {
      await addTrackToDatabase(item);
    }
    else if (item.spotify_episode_uri) {
      await addEpisodeToDatabase(item);
    }
    else {
      console.log('[Server] Unknown Spotify history entry');
    }
  }

  console.log('[Server] Finished loading history.')
}

module.exports = loadHistory;
