import { isWithinInterval, subSeconds } from "date-fns";

export default function isStale(dataDate, seconds) {
  const now = new Date();
  const stale = subSeconds(now, seconds);
  const notStale = isWithinInterval(dataDate, { start: stale, end: now });
  // console.log(now);
  // console.log(dataDate);
  // console.log(stale);
  // console.log(notStale);
  // notStale ? console.info("Data is not stale") : console.info("Data is stale");
  return notStale ? false : true;
}
