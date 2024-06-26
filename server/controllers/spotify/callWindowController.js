// Spotify API limits the number of calls that can be made
// within a 30s window
// This keeps track of API calls in an attempt to avoid
// making too many requests


var apiCallWindowSize = 0;
const MAX_API_CALLS = 30;


exports.addApiCalls = function(n) {
  apiCallWindowSize += n;
  setTimeout(() => {apiCallWindowSize -= n;}, 30000);
}


exports.getApiCalls = function() {
  return apiCallWindowSize;
}


exports.setRetryAgain = function(retryIn) {
  apiCallWindowSize += MAX_API_CALLS;
  setTimeout(() => {apiCallWindowSize -= MAX_API_CALLS;}, retryIn*1000);
}


exports.getApiCallsExceedsLimit = function() {
  return (apiCallWindowSize >= MAX_API_CALLS);
}


exports.callPermission = async function() {
  while(apiCallWindowSize >= MAX_API_CALLS) {
    console.log(`[Spotify] Too many API calls in the past 30s
                  (${apiCallWindowSize})`);
    await sleep(5000);
  }
}
