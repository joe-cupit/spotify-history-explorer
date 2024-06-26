const spotifyApi = require('../spotify/apiController').getSpotifyApi();



exports.artist = (req, res) => {
  var id = req.params.id;

  (async () => {
    console.log(`[Spotify] Finding artist with id '${id}'`);

    spotifyApi.getArtist(id).then(
      function(data) {
        console.log(`[Spotify] Matched id to '${data.body.name}'`);
        data.body.status = data.statusCode;
        res.send(data.body);
      },
      function(err) {
        console.error(err);
        res.send(err.body.error);
      }
    );

  })();
};


exports.track = async (req, res) => {
  var id = req.params.id;

  (async () => {
    console.log(`[Spotify] Finding track with id '${id}'`);

    spotifyApi.getTrack(id).then(
      function(data) {
        console.log(`[Spotify] Matched id to '${data.body.name} by ${data.body.artists[0].name}'`);
        data.body.status = data.statusCode;
        res.send(data.body);
      },
      function(err) {
        console.error(err);
        res.send(err.body.error);
      }
    );

  })();
};


exports.search = (req, res) => {
  var type = req.params.type;
  var term = req.params.term;

  const validSearchTypes = new Set(['artist', 'track', 'album', 'episode']);

  (async () => {
    if (validSearchTypes.has(type)) {
      console.log(`[Spotify] Searching ${type}s for '${term}'...`);

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
      console.log(`[Spotify] Invalid search type: '${type}'`);
      res.json({ status: 400, message: `Invalid search type '${type}'`})
    }
  })();
};
