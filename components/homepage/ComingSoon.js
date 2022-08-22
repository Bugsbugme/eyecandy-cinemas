import Carousel from "../carousel/Carousel";
import commonStyles from "../../styles/Common.module.css";
import moduleStyles from "../../styles/Home.module.css";

const styles = { ...commonStyles, ...moduleStyles };

export default function ComingSoon({ movies }) {
  return (
    <section id="coming_soon" className={[styles.coming_soon, styles.flex_container, styles.flex_column].join(" ")}>
      <header className={[styles.flex_container, styles.flex_column].join(" ")}>
        <h2>Coming Soon</h2>
      </header>
      <Carousel movieList={movies.slice(0, 10)} movieType={"cs"} />
    </section>
  );
}
