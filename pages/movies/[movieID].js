import { format, parseISO } from "date-fns";

import Head from "next/head";
import Image from "next/future/image";
import Layout from "../../components/layout/Layout";
import Link from "next/link";
import Loading from "../../components/Loading";
import Trailer from "../../components/popups/Trailer";
import commonStyles from "../../styles/Common.module.css";
import fetchDetails from "../../lib/movie/fetch";
import getDatabase from "../../lib/database/get";
import pageStyles from "../../styles/MovieDetails.module.css";
import useSWR from "swr";
import { useState } from "react";

const styles = { ...commonStyles, ...pageStyles };

export const getStaticPaths = async () => {
  const { data, error } = await getDatabase();

  error && console.error(JSON.parse(error));

  const movies = [];
  data.now_showing.map((i) => {
    movies.push(i);
  });
  data.coming_soon.map((i) => {
    movies.push(i);
  });

  const paths = movies.map((movie) => ({
    params: { movieID: movie.id.toString() },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async (context) => {
  const { params } = context;
  const { data, error } = await fetchDetails(params.movieID);

  error && console.error(error);

  return {
    props: {
      data,
    },
    revalidate: 86400,
  };
};

export default function MovieDetails(props) {
  const { data, error } = useSWR(`/api/fetch/movie_details?movie_id=${props.data.tmdb_id}`, { fallbackData: props.data });
  const [modalOpen, setModalOpen] = useState(false);
  const [modalHidden, setModalHidden] = useState(true);

  if (error) {
    return (
      <main id="main_content">
        <div>{error}</div>
      </main>
    );
  }
  if (!data) {
    return (
      <main id="main_content">
        <Loading />
      </main>
    );
  }

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
          }}></Trailer>
      )}
      <main id="main_content">
        <div className={styles.backdrop_container}>
          <Image
            className={styles.backdrop}
            src={`https://image.tmdb.org/t/p/original${data.backdrop}`}
            width={3840}
            height={2160}
            sizes="100vw"
            quality={90}
            priority
            alt="Movie Backdrop"
          />
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
                      {/* <BsInstagram className={[styles.icon, styles.bg_gradient_linear_45].join(" ")} /> */}

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