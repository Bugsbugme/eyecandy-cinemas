import ComingSoon from "../components/homepage/ComingSoon";
import Head from "next/head";
import Layout from "../components/layout/Layout";
import Loading from "../components/Loading";
import NowShowing from "../components/homepage/NowShowing";
import getDatabase from "../lib/database/get";
import styles from "../styles/Common.module.css";
import useSWR from "swr";

export const getStaticProps = async (ctx) => {
  const { data } = await getDatabase();

  return {
    props: {
      data,
    },
    revalidate: 86400,
  };
};

export default function Home(props) {
  // const { data, error } = useSWR("/api/database/db.json", { fallbackData: props.data });
  const data = props.data;

  // if (props.error) {
  //   console.error(props.error);
  //   return (
  //     <main id="main_content">
  //       <p>{props.error.status}</p>
  //       <p>{props.error.name}</p>
  //       <p>{props.error.message}</p>
  //       <p>{}</p>
  //     </main>
  //   );
  // }

  if (!data) {
    return (
      <main id="main_content">
        <Loading />
      </main>
    );
  }

  // console.log(data);

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
