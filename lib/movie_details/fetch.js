export default async function fetchDetails(movieID) {
  const apiKey = process.env.API_KEY;

  // console.log(req.query);
  const baseUrl = `https://api.themoviedb.org/3/movie/${movieID}`;

  const response = await fetch(
    `${baseUrl}?api_key=${apiKey}&language=en-US&append_to_response=videos,release_dates,videos,credits`
  );
  const data = await response.json();

  if (!response.ok) {
    const error = {
      Error: "Database Fetch Error",
      Cause: "An error has occured while fetching movie details from TMDB",
      HTTP_Status: response.status,
      TMDB_Fetch_State: data.success,
      TMDB_Response_Message: data.status_message,
      TMDB_Status_Code: data.status_code,
    };

    return { data: null, error };
  }
  // console.log(data);

  const releases = [];
  const trailers = [];

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
      (el.iso_639_1 === "en") & (el.name == "Official Trailer") & (el.type === "Trailer") & (el.official === true) &&
        trailers.push(Object.assign(el, { priority: 1 }));
      (el.iso_639_1 === "en") & (el.name == "Official Trailer") & (el.type === "Trailer") &&
        trailers.push(Object.assign(el, { priority: 2 }));
      (el.iso_639_1 === "en") & (el.name == "Trailer") & (el.type === "Trailer") &&
        trailers.push(Object.assign(el, { priority: 3 }));
      (el.iso_639_1 === "en") & (el.type === "Trailer") && trailers.push(Object.assign(el, { priority: 4 }));
    });
  // console.log(trailers);

  const trailer =
    trailers.length !== 0
      ? trailers.sort((a, b) => {
          if (a.priority > b.priority) return 1;
          if (a.priority < b.priority) return -1;
          return 0;
        })[0]
      : null;
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

  const movieDetails = {
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
    trailer: trailer,
  };

  return { data: movieDetails, error: null };
}