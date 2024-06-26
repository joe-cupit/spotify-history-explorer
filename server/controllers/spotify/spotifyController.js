const spotifyApi = require('./connect').getSpotifyApi();

spotifyApiWindow = require('./callWindowController');

const sleep = require('../sleep');


processError = function(err) {
  try{
    switch(err.body.statusCode) {
    case 429:
      console.log('[Spotify] Error 429: Too many requests');
      const retryIn = err.body.headers['retry-after'];
      console.log(`[Spotify] Retry again in ${retryIn}`)
      spotifyApiWindow.setRetryAgain(retryIn);
      break;
    case 502:
      console.log('[Spotify] Error 502: Bad gateway');
      // retry again
      break;
    default:
      console.log('[Spotify] Encountered an error');
  }
  } catch (err) {
    console.log('[Spotify] Encountered an unknown error');
  }
  
  console.log('[Spotify]', err);
}


makeRequest = async function(spotifyFunc, params) {
  try {
    response = await spotifyFunc(params);
    return response.body;
  } catch (err) {
    console.log(err);
    processError(err);
    return null;
  } finally {
    spotifyApiWindow.addApiCalls(1);
    await sleep(200);
  }
}


exports.getArtist = async function(artistId) {
  console.log('[Spotify] Finding artist with id', artistId);
  try {
    response = await spotifyApi.getArtist(artistId);
    return response.body;
  } catch (err) {
    processError(err);
    return null;
  } finally {
    spotifyApiWindow.addApiCalls(1);
    await sleep(200);
  }
}


exports.getTrack = async function(trackId) {
  console.log('[Spotify] Finding track with id', trackId);
  try {
    response = await spotifyApi.getTrack(trackId);
    return response.body;
  } catch (err) {
    processError(err);
    return null;
  } finally {
    spotifyApiWindow.addApiCalls(1);
    await sleep(200);
  }
}


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


exports.track = (req, res) => {
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
