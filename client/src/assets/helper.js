
export function millisecondsToReadableTime(ms) {
  var timeParts = [];

  const hours = Math.trunc(ms / (1000*60*60));
  if (hours > 0) {
    timeParts.push(hours + 'h');
    ms = ms - (hours * (1000*60*60));
  }

  const mins = Math.trunc(ms / (1000*60));
  if (hours > 0 || mins > 0) {
    timeParts.push(mins + 'm');
    ms = ms - (mins * (1000*60));
  }

  const seconds = Math.trunc(ms / 1000);
  timeParts.push(seconds + 's');

  return timeParts.join(' ');
}

