var SpotifyWebApi = require("spotify-web-api-node");

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});
spotifyApi.setAccessToken(process.env.ACCESS_TOKEN);


module.exports = function(app) {

  app.get("/api/artist/:id", (req, res) => {
    var id = req.params.id;
  
    (async () => {
      console.log(`[Node.js] Finding artist with id '${id}'`);
  
      spotifyApi.getArtist(id).then(
        function(data) {
          console.log(`[Node.js] Matched id to '${data.body.name}'`);
          data.body.status = data.statusCode;
          res.send(data.body);
        },
        function(err) {
          console.error(err);
          res.send(err.body.error);
        }
      );
  
    })();
  });
  
  
  app.get("/api/track/:id", (req, res) => {
    var id = req.params.id;
  
    (async () => {
      console.log(`[Node.js] Finding track with id '${id}'`);
  
      spotifyApi.getTrack(id).then(
        function(data) {
          console.log(`[Node.js] Matched id to '${data.body.name} by ${data.body.artists[0].name}'`);
          data.body.status = data.statusCode;
          res.send(data.body);
        },
        function(err) {
          console.error(err);
          res.send(err.body.error);
        }
      );
  
    })();
  });
  
  
  app.get("/api/search/:type/:term", (req, res) => {
    var type = req.params.type;
    var term = req.params.term;
  
    const validSearchTypes = new Set(['artist', 'track', 'album', 'episode']);
  
    (async () => {
      if (validSearchTypes.has(type)) {
        console.log(`[Node.js] Searching ${type}s for '${term}'...`);
  
        spotifyApi.search(term, [type], { limit: 10 }).then(
          function(data) {
            res.send(data.body[type+'s'].items);
          },
          function(err) {
            console.error(err);
            res.send(err.body.error);
          }
        );
      } else {
        console.log(`[Node.js] Invalid search type: '${type}'`);
        res.json({ status: 400, message: `Invalid search type '${type}'`})
      }
    })();
  });
  
}
