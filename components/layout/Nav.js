import Link from "next/link";
import React from "react";
import commonStyles from "../../styles/Common.module.css";
import moduleStyles from "../../styles/Nav.module.css";

const styles = { ...commonStyles, ...moduleStyles };
export default function Nav(props) {
  return (
    <nav
      id="navbar"
      className={[styles.navbar, styles.flex_container, styles.fixed, styles.border_gradient_linear_45].join(" ")}>
      <div className={[styles.nav_logo, styles.flex_container].join(" ")}>
        <i className={["eci-ecc-logo", styles.bg_gradient_linear_45].join(" ")} title="Logo" />
        <h1>
          EyeCandy
          <br />
          Cinemas
        </h1>
      </div>

      <div id="nav_links" className={[styles.nav_links, styles.flex_container].join(" ")}>
        <ul className={styles.flex_container}>
          {props.navProps.map((link, index) => (
            <li key={index} className={[styles.flex_container, styles.flex_column].join(" ")}>
              <Link href={link.link}>
                <a
                  className={[
                    styles.bg_gradient_linear_45,
                    styles.onhover_gradient,
                    styles.dividerY_after,
                    styles.dividerY_after_onhover,
                  ].join(" ")}
                  title={link.title}>
                  {link.label}
                </a>
              </Link>
            </li>
          ))}
        </ul>
        <div id="nav_search" className={[styles.nav_search, styles.flex_container, styles.flex_col].join(" ")}>
          <form className={styles.flex_container}>
            <input type="search" name="search" title="Search for titles" placeholder="Search..." />
            <button
              className={[styles.flex_container, styles.onhover_gradient].join(" ")}
              type="submit"
              name="search"
              title="Search for titles">
              <i className={["bi bi-search", styles.bg_gradient_linear_45].join(" ")} name="search" title="Search for titles" />
            </button>
            <div className={[styles.input_border, styles.border_gradient_linear_45].join(" ")} />
          </form>
        </div>
      </div>
    </nav>
  );
}
