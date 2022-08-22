import Carousel from "../carousel/Carousel";
import commonStyles from "../../styles/Common.module.css";
import moduleStyles from "../../styles/Home.module.css";

const styles = { ...commonStyles, ...moduleStyles };

export default function NowShowing({ movies }) {
  return (
    <section id="now_showing" className={[styles.now_showing, styles.flex_container, styles.flex_column].join(" ")}>
      <header className={[styles.flex_container, styles.flex_column].join(" ")}>
        <h2>Now Showing</h2>
      </header>
      <Carousel movieList={movies.slice(0, 10)} movieType={"ns"} />
    </section>
  );
}
