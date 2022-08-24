import fetchDatabase from "../../../lib/database/fetch";

export default async function handler(req, res) {
  const { data, error } = await fetchDatabase();

  error && res.status(error.Status).json(JSON.parse(error));
  data && res.status(200).json(JSON.parse(data));
}
