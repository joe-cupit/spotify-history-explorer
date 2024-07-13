export function formatTrackTime(ms) {
  var timeParts = [];

  const mins = Math.floor(ms / (1000*60));
  timeParts.push(mins);
  ms = ms - (mins * (1000*60));

  const seconds = Math.trunc(ms / 1000).toString();
  timeParts.push(seconds.padStart(2, '0'));

  return timeParts.join(':');
}