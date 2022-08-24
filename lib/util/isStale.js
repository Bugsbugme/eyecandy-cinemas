import { isWithinInterval, subDays } from "date-fns";

export function isStale(date) {
  const now = new Date();
  const dbDate = new Date(date);
  const stale = subDays(now, 1);
  const notStale = isWithinInterval(dbDate, { start: stale, end: now });
  // console.log(now);
  // console.log(dbDate);
  // console.log(stale);
  // console.log(notStale);
  return notStale;
}
