import ComingSoon from "./ComingSoon";
import Head from "next/head";
import Layout from "../layout/Layout";
import NowShowing from "./NowShowing";

export default function Home() {
  return (
    <>
      <Head>
        <title>EyeCandy Cinemas: Home</title>
        <meta property="og:title" content="EyeCandy Cinemas: Home" key="title" />
      </Head>
      <main id="main_content">
        <section className={[styles.content, styles.flex_container, styles.flex_column].join(" ")}>
          <NowShowing movies={data.now_showing} />

          <ComingSoon movies={data.coming_soon} />
        </section>
      </main>
    </>
  );
}

Home.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
