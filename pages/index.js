import { useEffect, useState } from "react";

import ComingSoon from "../components/homepage/ComingSoon";
import Head from "next/head";
import Layout from "../components/layout/Layout";
import NowShowing from "../components/homepage/NowShowing";
import fetchDatabase from "../lib/database/fetch";
import isStale from "../lib/util/StaleDataCheck";
import styles from "../styles/Common.module.css";

export const getStaticProps = async () => {
  console.info("ISR: Building page - Home...");
  const { data, error } = await fetchDatabase();

  if (error) {
    const appError = JSON.parse(error);
    const err = new Error("An error has occured while fetching data.");
    err.status = appError.Status;
    err.name = "Fetch Error";
    err.info = appError;
    throw err;
  }

  return {
    props: {
      data: JSON.parse(data),
    },
  };
};

export default function Home(props) {
  const revalToken = process.env.NEXT_PUBLIC_REVAL_TOKEN;
  const dataDate = props.data.created;
  const [data, setData] = useState(props.data);

  useEffect(() => {
    if (isStale(new Date(dataDate), 1800)) {
      fetch(`/api/revalidate?reval_token=${revalToken}&fetch=db&path=/`)
        .then((res) => res.json())
        .then((data) => setData(data.fresh_data));
    }
  }, [dataDate, revalToken]);

  return (
    <>
      <Head>
        <title>EyeCandy Cinemas: Home</title>
        <meta
          property="og:title"
          content="EyeCandy Cinemas: Home"
          key="title"
        />
      </Head>
      <main id="main_content">
        <section
          className={[
            styles.content,
            styles.flex_container,
            styles.flex_column,
          ].join(" ")}
        >
          {/* <h2>Database created {`${data.created}`}</h2> */}
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
      ]}
    >
      {page}
    </Layout>
  );
};
