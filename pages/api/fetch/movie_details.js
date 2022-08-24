import fetchDetails from "../../../lib/movie_details/fetch";

export default async function handler(req, res) {
  const movieID = req.query.movie_id;
  const { data, error } = await fetchDetails(movieID);

  error && res.status(error.Status).json(JSON.parse(error));
  data && res.status(200).json(JSON.parse(data));
}
