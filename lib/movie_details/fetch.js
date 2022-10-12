export default async function fetchMovieDetails(movieID) {
  const timeStamp = new Date();
  const apiKey = process.env.TMDB_API_KEY;

  // console.log(req.query);
  const baseUrl = `https://api.themoviedb.org/3/movie/${movieID}`;

  console.info(`API: Fetching data for movies/${movieID}...`);
  const response = await fetch(
    `${baseUrl}?api_key=${apiKey}&language=en-US&append_to_response=videos,release_dates,videos,credits`
  );
  const data = await response.json();

  if (!response.ok) {
    const error = JSON.stringify({
      Status: response.status,
      Error: "An error has occured while fetching now showing movie details from TMDB",
      Cause: `${data.status_message} (Error Code: ${data.status_code})`,
    });
    return { data: null, error };
  }

  // console.log(data);

  const releases = [];
  const trailer = [];

  const genres =
    data.genres !== 0
      ? data.genres.map((i) => {
          return i.name;
        })
      : null;
  // console.log(genres);

  data.release_dates.results.length !== 0 &&
    data.release_dates.results.filter((el) => {
      (el.iso_3166_1 === "NZ") & (el.release_dates[0].certification !== "") &&
        releases.push(Object.assign(el, { priority: 1 }));
      (el.iso_3166_1 === "AU") & (el.release_dates[0].certification !== "") &&
        releases.push(Object.assign(el, { priority: 2 }));
      (el.iso_3166_1 === "US") & (el.release_dates[0].certification !== "") &&
        releases.push(Object.assign(el, { priority: 3 }));
    });
  // console.log(...releases);
  // console.log(releases[0]);

  const certification =
    releases.length !== 0
      ? releases.sort((a, b) => {
          if (a.priority > b.priority) return 1;
          if (a.priority < b.priority) return -1;
          return 0;
        })[0].release_dates[0].certification
      : "TBD";
  // console.log(certification[0]);

  data.videos.results.length !== 0 &&
    data.videos.results.filter((el) => {
      (el.iso_639_1 === "en" &&
        el.name === "Official Trailer" &&
        el.type === "Trailer" &&
        el.official === true &&
        trailer.push(Object.assign(el, { priority: 1 }))) ||
        (el.iso_639_1 === "en" &&
          el.name === "Official Trailer" &&
          el.type === "Trailer" &&
          trailer.push(Object.assign(el, { priority: 2 }))) ||
        (el.iso_639_1 === "en" &&
          el.name === "Trailer" &&
          el.type === "Trailer" &&
          trailer.push(Object.assign(el, { priority: 3 })));
    });
  // console.log(trailer);

  const director =
    data.credits.crew.length !== 0
      ? data.credits.crew.filter((el) => {
          return el.job === "Director";
        })[0].name
      : null;

  const actors =
    data.credits.cast.length !== 0
      ? data.credits.cast.sort((a, b) => {
          if (a.popularity < b.popularity) return 1;
          if (a.popularity > b.popularity) return -1;
          return 0;
        })
      : null;

  const movieData = JSON.stringify({
    tmdb_id: data.id,
    imdb_id: data.imdb_id,
    title: data.title,
    tagline: data.tagline,
    release_date: data.release_date,
    certification: certification,
    runtime: data.runtime,
    director: director,
    actors: actors,
    overview: data.overview,
    genres: genres,
    backdrop: data.backdrop_path,
    poster: data.poster_path,
    trailer: trailer[0] ? trailer[0] : null,
    created: timeStamp,
  });

  return { data: movieData, error: null };
}
