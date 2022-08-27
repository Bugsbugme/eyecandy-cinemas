import { isWithinInterval, subDays, subSeconds } from "date-fns";

export function isStale(date) {
  const now = new Date();
  const dbDate = new Date(date);
  // const stale = subDays(now, 1);
  const stale = subSeconds(now, 30);
  const notStale = isWithinInterval(dbDate, { start: stale, end: now });
  // console.log(now);
  // console.log(dbDate);
  // console.log(stale);
  // console.log(notStale);
  // notStale ? console.info("data is not stale") : console.info("data is stale");
  return notStale ? false : true;
}
