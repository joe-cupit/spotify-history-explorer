const Artist = require('../../models/artistSchema')
const Track = require('../../models/trackSchema')


function saveToDB(item) {
  item.save()
    .then(data => {
      console.log(`[MongoDB] Added '${data.name}' to database`);
      return data;
    })
    .catch(err => {
      console.log('[MongoDB] Error adding to database');
      console.log('[MongoDB]', err);
      return err;
    });
}


async function addArtist(artistJson) {
  try {
    const artist = new Artist(artistJson);
    await artist.save();
    return {};
  } catch (err) {
    console.log('[MongoDB] Failed to add artist to database');
    console.log('[MongoDB]', err);
    return err;
  }
}

function addArtists(artistList) {
  for (var artist of artistList) {
    addArtist(artist);
  }
  console.log('[MongoDB] Successfully added list of artists to database');
}


async function addTrack(trackJson) {
  try {
    const track = new Track(trackJson);
    await track.save();
    return {};
  } catch (err) {
    console.log(`[MongoDB] Failed to add track to database`);
    console.log('[MongoDB]', err);
    return err;
  }
}

function addTrack(trackList) {
  for (var track of trackList) {
    addTrack(track);
  }
  console.log('[MongoDB] Successfully added list of tracks to database');
}


exports.test = async (req, res) => {

  const artistJson = {
    spotifyId: '0epOFNiUfyON9EYx7Tpr6V',
    name: 'The Strokes',
    totalListeningTime: 231521316,
  };

  const data = addArtist(artistJson);
  res.send(data);

};
