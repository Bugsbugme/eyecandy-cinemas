import Image from "next/future/image";
import Link from "next/link";
import commonStyles from "../../styles/Common.module.css";
import moduleStyles from "../../styles/MovieCard.module.css";

const styles = { ...commonStyles, ...moduleStyles };

export default function MovieCard({ movie }) {
  return (
    <>
      <div id={movie.id} className={[styles.card].join(" ")}>
        <div
        // className={styles.poster}
        >
          <Image
            className={styles.poster}
            src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
            alt="Movie Poster"
            width={2000}
            height={3000}
            sizes="20vw"
            quality={90}
          />
        </div>

        <div className={[styles.overlay, styles.onhover_gradient].join(" ")}>
          <Link href={`/movies/${movie.id}`}>
            <a title="Go to movie details">
              <h3 className={styles.bg_gradient_linear_45} title={movie.title}>
                {movie.title}
              </h3>
              {movie.released === false && <h4 title="Coming Soon">Coming Soon</h4>}
            </a>
          </Link>
        </div>
      </div>
    </>
  );
}
