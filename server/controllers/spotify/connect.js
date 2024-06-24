const SpotifyWebApi = require('spotify-web-api-node');


const connectToSpotifyApi = async () => {
  const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  spotifyApi.setAccessToken(process.env.ACCESS_TOKEN);
  
  spotifyApi.getArtist('4Z8W4fKeB5YxbusRsdQVPb')
    .then(data => {
      console.log('[Spotify] Connection established');
      return spotifyApi;
    })
    .catch(err => {
      console.log('[Spotify] Failed to connect');
      console.log('[Spotify]', err);
      process.exit(1);
    });
}


module.exports = connectToSpotifyApi
