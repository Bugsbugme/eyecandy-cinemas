import { useEffect, useState } from "react";

import Head from "next/head";
import Layout from "../../components/layout/Layout";
import MovieCard from "../../components/moviespage/MovieCard";
import commonStyles from "../../styles/Common.module.css";
import fetchDatabase from "../../lib/database/fetch";
import isStale from "../../lib/util/StaleDataCheck";
import moduleStyles from "../../styles/Movies.module.css";

const styles = { ...commonStyles, ...moduleStyles };

export const getStaticProps = async () => {
  console.info("ISR: Building page - Home...");
  const { data, error } = await fetchDatabase();

  if (error) {
    const appError = JSON.parse(error);
    const err = new Error("An error has occured while fetching data.");
    err.status = appError.Status;
    err.name = "Fetch Error";
    err.info = appError;
    throw err;
  }

  return {
    props: {
      data: JSON.parse(data),
    },
  };
};

export default function Movies(props) {
  const revalToken = process.env.NEXT_PUBLIC_REVAL_TOKEN;
  const dataDate = props.data.created;
  const [data, setData] = useState(props.data);

  useEffect(() => {
    if (isStale(new Date(dataDate), 1800)) {
      fetch(`/api/revalidate?reval_token=${revalToken}&fetch=db&path=/movies`)
        .then((res) => res.json())
        .then((data) => setData(data.fresh_data));
    }
  }, [dataDate, revalToken]);

  const movieList = [...data.now_showing, ...data.coming_soon];

  return (
    <>
      <Head>
        <title>EyeCandy Cinemas: Movies</title>
        <meta property="og:title" content="EyeCandy Cinemas: Movies" key="title" />
      </Head>
      <main id="main_content">
        <section className={[styles.content, styles.flex_container].join(" ")}>
          <div className={[styles.movie_list, styles.flex_container].join(" ")}>
            {movieList.map((movie, index) => (
              <MovieCard
                key={index}
                movie={{
                  id: movie.id,
                  released: movie.released,
                  title: movie.title,
                  release_date: movie.release_date,
                  poster_path: movie.poster_path,
                }}
              />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
Movies.getLayout = function getLayout(page) {
  return (
    <Layout
      navProps={[
        { link: "/", title: "Return to the Home page", label: "Home" },
        { link: "/cinemas", title: "Cinema Locations", label: "Cinemas" },
      ]}>
      {page}
    </Layout>
  );
};
