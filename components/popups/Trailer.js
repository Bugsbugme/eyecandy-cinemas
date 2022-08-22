import commonStyles from "../../styles/Common.module.css";
import moduleStyles from "../../styles/Trailer.module.css";

const styles = { ...commonStyles, ...moduleStyles };

export default function Trailer(props) {
  return (
    props.isOpen && (
      <div className={`${styles.modal}`}>
        <div className={[styles.container, `${props.isHidden && styles.hidden}`].join(" ")} onClick={() => props.closeModal()}>
          <div className={[styles.video, styles.border_gradient_linear_45, styles.box_shadow].join(" ")}>
            <button
              className={[styles.onhover_gradient, styles.border_gradient_linear_45, styles.box_shadow].join(" ")}
              type="button"
              onClick={() => props.closeModal()}
              title="Close">
              <i className={[`bi bi-x ${styles.bg_gradient_linear_45}`].join(" ")} />
            </button>
            <iframe
              src={`https://www.youtube.com/embed/${props.youtubeID}?rel=0&amp;modestbranding=1`}
              title={`${props.movieTitle} Trailer`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    )
  );
}
