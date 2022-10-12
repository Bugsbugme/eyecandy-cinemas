import { format, parseISO } from "date-fns";
import { useEffect, useState } from "react";

import Head from "next/head";
import Image from "next/future/image";
import Layout from "../../components/layout/Layout";
import Link from "next/link";
import Trailer from "../../components/popups/Trailer";
import commonStyles from "../../styles/Common.module.css";
import fetchDatabase from "../../lib/database/fetch";
import fetchDetails from "../../lib/movie_details/fetch";
import isStale from "../../lib/util/StaleDataCheck";
import pageStyles from "../../styles/MovieDetails.module.css";

const styles = { ...commonStyles, ...pageStyles };

export const getStaticPaths = async () => {
  const { data, error } = await fetchDatabase();

  if (error) {
    const appError = JSON.parse(error);
    const err = new Error("An error has occured while fetching data.");
    err.status = appError.Status;
    err.name = "Fetch Error";
    err.info = appError;
    throw err;
  }

  const movies = [];
  JSON.parse(data).now_showing.map((i) => {
    movies.push(i);
  });
  JSON.parse(data).coming_soon.map((i) => {
    movies.push(i);
  });

  const paths = movies.map((movie) => ({
    params: { movieID: JSON.stringify(movie.id) },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async (context) => {
  const { params } = context;
  console.info(`ISR: Building page - movies/${params.movieID}...`);
  const { data, error } = await fetchDetails(params.movieID);

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

export default function MovieDetails(props) {
  const revalToken = process.env.NEXT_PUBLIC_REVAL_TOKEN;
  const dataDate = props.data.created;
  const [data, setData] = useState(props.data);

  useEffect(() => {
    if (isStale(new Date(dataDate), 1800)) {
      fetch(`/api/revalidate?reval_token=${revalToken}&fetch=movie&path=/movies/${props.data.tmdb_id}`)
        .then((res) => res.json())
        .then((data) => setData(data.fresh_data));
    }
  }, [dataDate, revalToken, props.data.tmdb_id]);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalHidden, setModalHidden] = useState(true);

  const title = `EyeCandy Cinemas: ${data.title}`;

  const actors = data.actors
    ? data.actors
        .map((i) => {
          return i.name;
        })
        .slice(0, 3)
        .join(", ")
    : null;

  const openModal = () => {
    setModalOpen(true);
    setTimeout(() => {
      setModalHidden(false);
    }, 20);
  };

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta property="og:title" content={title} key="title" />
      </Head>
      {data.trailer && (
        <Trailer
          {...{ isOpen: modalOpen, isHidden: modalHidden, movieTitle: data.title, youtubeID: data.trailer.key }}
          closeModal={() => {
            setModalHidden(true);
            setTimeout(() => {
              setModalOpen(false);
            }, 300);
          }}
        />
      )}
      <main id="main_content">
        <div className={styles.backdrop_container}>
          <div className={styles.backdrop}>
            <Image
              className={styles.backdrop_image}
              src={`https://image.tmdb.org/t/p/original${data.backdrop}`}
              width={3840}
              height={2160}
              sizes="100vw"
              quality={90}
              priority
              alt="Movie Backdrop"
            />
            <div className={styles.backdrop_overlay} />
          </div>
        </div>
        <article className={[commonStyles.content, styles.details_container, styles.flex_container].join(" ")}>
          <Image
            className={[styles.poster, styles.border_gradient_linear_45, styles.box_shadow].join(" ")}
            src={`https://image.tmdb.org/t/p/original${data.poster}`}
            width={2000}
            height={3000}
            sizes="30vw"
            quality={90}
            alt="Movie Poster"
          />
          <section className={[styles.details, styles.flex_container, styles.flex_column, styles.dividerX_before].join(" ")}>
            <header className={styles.flex_container}>
              <p className={styles.certification} title="Certification Rating">
                {data.certification}
              </p>
              <h2 className={styles.details_title}>
                {data.title}
                <span className={styles.release_year}>{` (${format(parseISO(data.release_date), "yyyy")})`}</span>
              </h2>
            </header>
            <div className={[styles.links, styles.flex_container].join(" ")}>
              {data.trailer && (
                <button
                  className={[
                    styles.trailer,
                    styles.flex_container,
                    styles.onhover_gradient,
                    styles.border_gradient_linear_45,
                    styles.box_shadow,
                  ].join(" ")}
                  title="Watch movie trailer"
                  type="button"
                  onClick={() => openModal()}>
                  <p className={styles.bg_gradient_linear_45}>Watch Trailer</p>
                </button>
              )}
              <button
                className={[
                  styles.booking,
                  styles.flex_container,
                  styles.onhover_gradient,
                  styles.border_gradient_linear_45,
                  styles.box_shadow,
                ].join(" ")}
                title="Buy tickets"
                type="button">
                <p className={styles.bg_gradient_linear_45}>Book Now</p>
              </button>
            </div>
            <main>
              <div className={[styles.sub_heading, styles.flex_container, styles.flex_column].join(" ")}>
                {data.runtime > 0 && (
                  <p className={styles.runtime}>
                    Run Time: <span>{`${data.runtime}m`}</span>
                  </p>
                )}
                {data.genres && <p className={styles.genres}>{data.genres.join(", ")}</p>}
                {data.director && (
                  <h3 className={styles.director}>
                    Director: <span className={styles.director_name}>{data.director}</span>
                  </h3>
                )}
                {actors && (
                  <h3 className={styles.actors}>
                    Starring: <span className={styles.actor_names}>{actors}</span>
                  </h3>
                )}
              </div>
              {data.tagline && <p className={styles.tagline}>{`"${data.tagline}"`}</p>}
              <p className={styles.overview}>{data.overview}</p>
              {data.imdb_id && (
                <Link href={`https://www.imdb.com/title/${data.imdb_id}`}>
                  <a
                    className={[styles.overview_link, styles.onhover_gradient, styles.bg_gradient_linear_45].join(" ")}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="More information at the Internet Movie Database">
                    More at IMDB
                  </a>
                </Link>
              )}
            </main>
            <footer className={styles.footer}>
              <ul>
                <li
                  className={[
                    styles.share_link,
                    styles.onhover_gradient,
                    styles.border_gradient_linear_45,
                    styles.box_shadow,
                  ].join(" ")}>
                  <Link href="#">
                    <a title="Share Link">
                      <i className={["bi bi-share-fill", styles.bg_gradient_linear_45].join(" ")} title="Share Link" />
                    </a>
                  </Link>
                </li>
                <li
                  className={[
                    styles.fb_link,
                    styles.onhover_gradient,
                    styles.border_gradient_linear_45,
                    styles.box_shadow,
                  ].join(" ")}>
                  <Link href="#">
                    <a title="Share to Facebook">
                      <i className={["bi bi-facebook", styles.bg_gradient_linear_45].join(" ")} title="Share to Facebook" />
                    </a>
                  </Link>
                </li>
                <li
                  className={[
                    styles.twt_link,
                    styles.onhover_gradient,
                    styles.border_gradient_linear_45,
                    styles.box_shadow,
                  ].join(" ")}>
                  <Link href="#">
                    <a title="Share to Twitter">
                      <i className={["bi bi-twitter", styles.bg_gradient_linear_45].join(" ")} title="Share to Twitter" />
                    </a>
                  </Link>
                </li>
                <li
                  className={[
                    styles.insta_link,
                    styles.onhover_gradient,
                    styles.border_gradient_linear_45,
                    styles.box_shadow,
                  ].join(" ")}>
                  <Link href="#">
                    <a title="Share to Instagram">
                      <i className={["bi bi-instagram", styles.bg_gradient_linear_45].join(" ")} title="Share to Instagram" />
                    </a>
                  </Link>
                </li>
              </ul>
            </footer>
          </section>
        </article>
      </main>
    </>
  );
}

MovieDetails.getLayout = function getLayout(page) {
  return (
    <Layout
      navProps={[
        { link: "/", title: "Return to the Home page", label: "Home" },
        { link: "/movies", title: "Browse all Movies", label: "Movies" },
        { link: "/cinemas", title: "Cinema Locations", label: "Cinemas" },
      ]}>
      {page}
    </Layout>
  );
};
