import Link from "next/link";
import commonStyles from "../../styles/Common.module.css";
import moduleStyles from "../../styles/Footer.module.css";

const styles = { ...commonStyles, ...moduleStyles };

export default function Footer() {
  return (
    <footer
      id="page_footer"
      className={[styles.container, styles.flex_container, styles.fixed, styles.border_gradient_linear_45].join(" ")}>
      <ul className={[styles.copyright, styles.flex_container].join(" ")}>
        <li className={styles.ecc_link}>
          <p>
            &copy; 2021
            <Link href="#">
              <a className={[styles.onhover_gradient].join(" ")} title="EyeCandy Entertainment Website">
                <span className={[styles.bg_gradient_linear_45].join(" ")}> EyeCandy Entertainment</span>
              </a>
            </Link>
          </p>
        </li>
        <li className={[styles.contact_link, styles.onhover_gradient, styles.dividerX_before].join(" ")}>
          <Link href="#">
            <a className={[styles.bg_gradient_linear_45].join(" ")} title="Contact Us">
              Contact Us
            </a>
          </Link>
        </li>
      </ul>
      <ul className={[styles.socials, styles.flex_container].join(" ")}>
        <li className={[styles.follow_us, styles.dividerX_after].join(" ")}>
          <p>Follow Us</p>
        </li>
        <li className={[styles.fb_link, styles.onhover_gradient].join(" ")}>
          <Link href="#">
            <a title="Share to Facebook">
              <i className={["bi bi-facebook", styles.bg_gradient_linear_45].join(" ")} title="Follow us on Facebook" />
            </a>
          </Link>
        </li>
        <li className={[styles.twt_link, styles.onhover_gradient].join(" ")}>
          <Link href="#">
            <a title="Share to Twitter">
              <i className={["bi bi-twitter", styles.bg_gradient_linear_45].join(" ")} title="Follow us on Twitter" />
            </a>
          </Link>
        </li>
        <li className={[styles.insta_link, styles.onhover_gradient].join(" ")}>
          <Link href="#">
            <a title="Share to Instagram">
              <i className={["bi bi-instagram", styles.bg_gradient_linear_45].join(" ")} title="Follow us on Instagram" />
            </a>
          </Link>
        </li>
      </ul>
    </footer>
  );
}
