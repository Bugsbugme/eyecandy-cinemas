import { addMonths, format, formatISO, parseISO, subMonths } from "date-fns";

export default async function fetchDatabase() {
  const apiKey = process.env.API_KEY;
  const baseUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}`;
  const date = new Date();
  const today = format(date, "yyyy-MM-dd");
  const timeStamp = formatISO(date, { format: "basic" }, { representation: "complete" });

  const past = format(subMonths(parseISO(today), 3), "yyyy-MM-dd");
  const nsUrl = `${baseUrl}&sort_by=popularity.desc&region=AU&include_adult=false&include_video=false&primary_release_date.gte=${past}&primary_release_date.lte=${today}&with_release_type=3%7C2&vote_average.gte=6&vote_count.gte=60&with_original_language=en`;
  // console.log(nsUrl);
  const future = format(addMonths(parseISO(today), 3), "yyyy-MM-dd");
  const csUrl = `${baseUrl}&sort_by=popularity.desc&region=AU&include_adult=false&include_video=false&primary_release_date.gte=${today}&primary_release_date.lte=${future}&with_release_type=3%7C2&with_original_language=en`;
  // console.log(csUrl);

  const now_showing = [];
  const coming_soon = [];
  let error = null;

  async function fetchNSMovieData(pageKey = 1) {
    const response = await fetch(`${nsUrl}&page=${pageKey}`);
    const data = await response.json();

    if (!response.ok) {
      error = {
        Status: response.status,
        Error: "An error has occured while fetching now showing movie list from TMDB",
        Cause: `${data.status_message} (Error Code: ${data.status_code})`,
      };
      return;
    }

    const totalPages = data.total_pages;

    data.results.flatMap((el) =>
      el.backdrop_path === null ? [] : el.poster_path === null ? [] : now_showing.push(Object.assign(el, { released: true }))
    );
    // console.debug(pageKey, "/", totalPages);

    // if current page isn't the last, call the fetch feature again, with page + 1
    if (pageKey < totalPages && pageKey < 3 /*(this is a test dev condition to limit result) */) {
      pageKey++;
      // setup a sleep depend your api request/second requirement.
      await new Promise((resolve) => setTimeout(resolve, 200));
      return await fetchNSMovieData(pageKey);
    }
  }

  async function fetchCSMovieData(pageKey = 1) {
    const response = await fetch(`${csUrl}&page=${pageKey}`);
    const data = await response.json();

    if (!response.ok) {
      error = {
        Status: response.status,
        Error: "An error has occured while fetching now showing movie list from TMDB",
        Cause: `${data.status_message} (Error Code: ${data.status_code})`,
      };
      return;
    }

    const totalPages = data.total_pages;

    data.results.flatMap((i) =>
      i.backdrop_path === null ? [] : i.poster_path === null ? [] : coming_soon.push(Object.assign(i, { released: false }))
    );
    // console.debug(pageKey, "/", totalPages);

    // if current page isn't the last, call the fetch feature again, with page + 1
    if (pageKey < totalPages && pageKey < 3 /*(this is a test dev condition to limit for 10 result) */) {
      pageKey++;
      // setup a sleep depend your api request/second requirement.
      await new Promise((resolve) => setTimeout(resolve, 200));
      return await fetchCSMovieData(pageKey);
    }
  }

  await fetchNSMovieData();
  await fetchCSMovieData();

  const data =
    (now_showing.length !== 0) & (coming_soon.length !== 0) ? { now_showing: now_showing, coming_soon: coming_soon } : null;

  return { data, error };
}
