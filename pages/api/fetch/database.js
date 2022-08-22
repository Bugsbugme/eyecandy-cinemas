import getDatabase from "../../../lib/database/get";

export default async function handler(req, res) {
  const { data, error } = await getDatabase();

  error && res.status(error.Status).json(error);

  data && res.status(200).json(data);
}
