import Head from "next/head";
import Layout from "../../components/layout/Layout";
import commonStyles from "../../styles/Common.module.css";

const styles = { ...commonStyles };

export default function Cinemas() {
  return (
    <>
      <Head>
        <title>EyeCandy Cinemas: Cinemas</title>
        <meta property="og:title" content="EyeCandy Cinemas: Cinemas" key="title" />
      </Head>
      <main id="main_content">
        <div className={[styles.content, styles.flex_container, styles.flex_column].join(" ")}>
          <h2>Cinemas</h2>
          <h3>(Under Construction)</h3>
        </div>
      </main>
    </>
  );
}
Cinemas.getLayout = function getLayout(page) {
  return (
    <Layout
      navProps={[
        { link: "/", title: "Return to the Home page", label: "Home" },
        { link: "/movies", title: "Browse all Movies", label: "Movies" },
      ]}>
      {page}
    </Layout>
  );
};
