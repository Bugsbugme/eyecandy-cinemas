import fetchDatabase from "../../lib/database/fetch";
import fetchMovieDetails from "../../lib/movie_details/fetch";

export default async function handler(req, res) {
  const fetch = req.query.fetch;
  let fetchError = null;
  let freshData = {};
  // console.log(req.query);
  // Check for secret to confirm this is a valid request
  if (req.query.reval_token !== process.env.NEXT_PUBLIC_REVAL_TOKEN) {
    return res.status(401).json({ message: "Invalid token" });
  }

  if (fetch === "db") {
    const { data, error } = await fetchDatabase();
    fetchError = error;
    freshData = data;
  }
  if (fetch === "movie") {
    const { data, error } = await fetchMovieDetails();
    fetchError = error;
    freshData = data;
  }

  if (fetchError) {
    return res.status(fetchError.Status).json(JSON.parse(fetchError));
  }

  try {
    // this should be the actual path not a rewritten path
    // e.g. for "/blog/[slug]" this should be "/blog/post-1"
    console.info(`ISR: Revalidating data for "${req.query.path}"...`);
    await res.revalidate(req.query.path);
    return res.status(200).json({ revalidated: true, fresh_data: JSON.parse(freshData) });
  } catch (err) {
    // If there was an error, Next.js will continue
    // to show the last successfully generated page
    return res.status(500).send("Error revalidating");
  }
}
