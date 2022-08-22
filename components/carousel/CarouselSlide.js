import Image from "next/image";
import Link from "next/link";
import commonStyles from "../../styles/Common.module.css";
import moduleStyles from "../../styles/Carousel.module.css";

const styles = { ...commonStyles, ...moduleStyles };

export default function CarouselSlide({ movieDetails }) {
  return (
    <>
      <li id={movieDetails.id} className={[styles.slide].join(" ")}>
        <div className={styles.poster}>
          <Image
            src={`https://image.tmdb.org/t/p/original${movieDetails.poster_path}`}
            alt="Movie Poster"
            layout="responsive"
            width={2000}
            height={3000}
            quality={90}
            sizes="20vw"
          />
        </div>

        <Link href={`/movies/${movieDetails.id}`}>
          <a className={[styles.overlay, styles.onhover_gradient].join(" ")} title="Go to movie details">
            <header>
              <h3 className={styles.bg_gradient_linear_45} title={movieDetails.title}>
                {movieDetails.title}
              </h3>
              {movieDetails.movieType === "cs" && <h4 title="Coming Soon">Coming Soon</h4>}
            </header>
          </a>
        </Link>
      </li>
    </>
  );
}
