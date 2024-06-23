const artistSchema = require('../database/models/artistSchema')
const trackSchema = require('../database/models/trackSchema')


exports.test = async (req, res) => {

  const artist = new artistSchema({
    spotifyId: '0epOFNiUfyON9EYx7Tpr6V',
    name: 'The Strokes',
    totalListeningTime: 231521316,
  })

  artist
    .save()
    .then(data => {
      console.log(`[MongoDB] Added '${data.name}' to database`);
      res.send(data);
    })
    .catch(err => {
      console.log('[MongoDB] Error adding to database');
      console.log(err);
      res.send(err);
    });

};
