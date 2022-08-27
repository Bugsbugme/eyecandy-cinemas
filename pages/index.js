import useSWR, { useSWRConfig } from "swr";

import ComingSoon from "../components/homepage/ComingSoon";
import Head from "next/head";
import Layout from "../components/layout/Layout";
import Loading from "../components/Loading";
import NowShowing from "../components/homepage/NowShowing";
import fetchDatabase from "../lib/database/fetch";
import { isStale } from "../lib/util/isStale";
import styles from "../styles/Common.module.css";

export const getStaticProps = async () => {
  console.info("ISR building page: Home...");
  const { data, error } = await fetchDatabase();

  if (error) {
    const appError = JSON.parse(error);
    const err = new Error("An error has occured while fetching data.");
    err.status = appError.Status;
    err.name = "Fetch Error";
    err.info = appError;
    throw err;
  }

  const appData = JSON.parse(data);

  return {
    props: {
      data: appData,
    },
    revalidate: 1800,
  };
};

export default function Home(props) {
  // const stale = isStale(props.data.created);
  // stale ? console.info("SWR: data not stale") : console.info("SWR: data is not stale");
  // const { cache } = useSWRConfig();
  // console.log(...cache);
  // const { data, error } = useSWR(`/api/fetch/database`, {
  //   fallbackData: props.data,
  // });

  // console.log(data);

  // if (error) {
  //   console.error(error);
  //   return (
  //     <main id="main_content">
  //       <p>{error.status}</p>
  //       <p>{error.name}</p>
  //       <p>{error.message}</p>
  //     </main>
  //   );
  // }
  // if (!data) {
  //   return (
  //     <main id="main_content">
  //       <Loading />
  //     </main>
  //   );
  // }
  // console.log(data);
  const data = props.data;

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
  return (
    <Layout
      navProps={[
        { link: "/movies", title: "Browse all Movies", label: "Movies" },
        { link: "/cinemas", title: "Cinema Locations", label: "Cinemas" },
      ]}>
      {page}
    </Layout>
  );
};
