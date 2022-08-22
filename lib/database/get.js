import { isWithinInterval, parseISO, subDays } from "date-fns";

import buildDatabase from "./build";
import fetchDatabase from "./fetch";
import readDatabase from "./read";

export default async function getDatabase() {
  let dbData = readDatabase();
  const now = new Date();
  const dbDate = parseISO(dbData.date_created);
  const staleDate = subDays(now, 1);
  const isStale = !isWithinInterval(dbDate, {
    start: staleDate,
    end: now,
  });

  if (isStale === true) {
    console.info("Database is stale, rebuilding...");
    const { data, error } = await fetchDatabase();

    if (error) {
      return { error };
    }

    buildDatabase(data);
    dbData = readDatabase();
    // console.log(appData);
    return { data: dbData };
  }
  console.info("Database is ready");

  return { data: dbData };
}
