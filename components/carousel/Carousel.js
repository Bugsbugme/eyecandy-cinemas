import CarouselSlide from "./CarouselSlide";
import styles from "../../styles/Carousel.module.css";

export default function Carousel({ movieList, movieType }) {
  if (movieType) {
    return (
      <>
        <div className={styles.content}>
          <button className={styles.left} title="Move to previous item" name="Back" type="button">
            <i className="far fa-arrow-alt-circle-left" />
          </button>

          <button className={styles.right} title="Move to next item" name="Forward" type="button">
            <i className="far fa-arrow-alt-circle-right" />
          </button>

          <ul className={styles.track}>
            {movieList.map((movie, index) => (
              <CarouselSlide
                key={index}
                movieDetails={{
                  id: movie.id,
                  movieType: movieType,
                  title: movie.title,
                  release_date: movie.release_date,
                  poster_path: movie.poster_path,
                }}
              />
            ))}
          </ul>
        </div>

        <div className={styles.nav}>
          <button className="carousel_indicator" type="button" title="Indicator"></button>
          <button className="carousel_indicator" type="button" title="Indicator"></button>
          <button className="carousel_indicator" type="button" title="Indicator"></button>
        </div>
      </>
    );
  }
}
