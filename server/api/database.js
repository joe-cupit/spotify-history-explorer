const mongo = require('./database/mongo');

const artistSchema = require('./database/schemas/artistSchema')
const trackSchema = require('./database/schemas/trackSchema')


module.exports = function(app) {

  app.get("/api/database", (req, res) => {

    (async () => {
      await mongo().then( async (mongoose) => {
        try {
          console.log('[MongoDB] Connection established');

          const artist = {
            spotifyId: '0epOFNiUfyON9EYx7Tpr6V',
            name: 'The Strokes',
            totalListeningTime: 231521316,
          }
          const result = await new artistSchema(artist).save();

          console.log(`[MongoDB] Added '${result.name}' to database`);
          res.send(result);
        } finally {
          mongoose.connection.close();
          console.log('[MongoDB] Disconnected');
        }
      })
    })();

  });

}
