import Head from "next/head";
import Layout from "../../components/layout/Layout";
import commonStyles from "../../styles/Common.module.css";
import fetchDatabase from "../../lib/database/fetch";
import { isStale } from "../../lib/util/isStale";
import useSWR from "swr";

const styles = { ...commonStyles };

export const getStaticProps = async () => {
  console.info("ISR building page: Movies...");
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

export default function Movies(props) {
  // const stale = isStale(props.data.created);
  // stale ? console.info("SWR: data not stale") : console.info("SWR: data is not stale");
  // const { data, error } = useSWR(isStale(props.data.created) && "/api/fetch/database", { fallbackData: props.data });
  // console.log(data);
  return (
    <>
      <Head>
        <title>EyeCandy Cinemas: Movies</title>
        <meta property="og:title" content="EyeCandy Cinemas: Movies" key="title" />
      </Head>
      <main id="main_content">
        <div className={[styles.content, styles.flex_container, styles.flex_column].join(" ")}>
          <h2>Movies</h2>
          <h3>(Under Construction)</h3>
        </div>
      </main>
    </>
  );
}
Movies.getLayout = function getLayout(page) {
  return (
    <Layout
      navProps={[
        { link: "/", title: "Return to the Home page", label: "Home" },
        { link: "/cinemas", title: "Cinema Locations", label: "Cinemas" },
      ]}>
      {page}
    </Layout>
  );
};
