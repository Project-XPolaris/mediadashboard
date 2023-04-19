export function formatTimeToHuman(milliseconds: number): string {
  let seconds = Math.floor(milliseconds / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);
  let days = Math.floor(hours / 24);

  hours %= 24;
  minutes %= 60;
  seconds %= 60;

  const timeArr = [];
  if (days) {
    timeArr.push(`${days}d`);
  }
  if (hours) {
    timeArr.push(`${hours}h`);
  }
  if (minutes) {
    timeArr.push(`${minutes}m`);
  }
  if (seconds) {
    timeArr.push(`${seconds}s`);
  }
  if (seconds === 0 && minutes === 0 && hours === 0 && days === 0) {
    timeArr.push(`${milliseconds}ms`);
  }

  return timeArr.join(" ");
}
