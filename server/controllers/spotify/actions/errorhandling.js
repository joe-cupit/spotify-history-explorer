exports.tryCatchWrapper = (func) => async (...args) => {
  try {
    return await func(...args);
  } catch (err) {
    console.log('[Spotify] Encountered an error');
    console.log('[Spotify]', err);
    return null;
  }
}


exports.processError = function(err) {
  try{
    switch(err.body.statusCode) {
    case 429:
      console.log('[Spotify] Error 429: Too many requests');
      const retryIn = err.body.headers['retry-after'];
      console.log(`[Spotify] Retry again in ${retryIn}`)
      spotifyController.setRetryIn(retryIn);
      break;
    case 502:
      console.log('[Spotify] Error 502: Bad gateway');
      // TODO: retry again
      break;
    default:
      console.log('[Spotify] Encountered an error');
  }
  } catch (err) {
    console.log('[Spotify] Encountered an unknown error');
  }
  
  console.log('[Spotify]', err);
}
