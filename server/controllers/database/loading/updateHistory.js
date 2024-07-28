const { History } = require('../../../models/models');
const { getTrackById, getEpisodeById } = require('../actions/query');


updateHistory = async function() {
  for await (const entry of History.find()) {
    const type = entry.type;
    const id = entry.spotifyId;

    if (type === 'track') {
      if (!entry.artistIds || entry.artistIds.length === 0
          || !entry.albumId || entry.albumId === '') {
        const track = await getTrackById(id);
        if (track) {
          entry.name = track.name;
          entry.artistIds = track.artistIds;
          entry.artistNames = track.artistNames;
          entry.albumId = track.albumId;
          entry.albumName = track.albumName;
        }
      }
    } else if (type === 'episode') {
      if (!entry.showId || entry.showId === '') {
        const episode = await getEpisodeById(id);
        if (episode) {
          entry.name = episode.name;
          entry.showId = episode.showId;
          entry.showName = episode.showName;          
        }
      }
    }

    await entry.save();
  }
}

module.exports = updateHistory;
