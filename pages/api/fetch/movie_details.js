import fetchDetails from "../../../lib/movie/fetch";

export default async function handler(req, res) {
  const movieID = req.query.movie_id;
  const { data, error } = await fetchDetails(movieID);

  error && res.status(error.Status).json(error);
  data && res.status(200).json(data);
}
