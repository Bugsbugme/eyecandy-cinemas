import Head from "next/head";
import Layout from "../../components/layout/Layout";
import commonStyles from "../../styles/Common.module.css";
import getDatabase from "../../lib/database/get";
import useSWR from "swr";

const styles = { ...commonStyles };

export const getStaticProps = async (ctx) => {
  const { data } = await getDatabase();

  return {
    props: {
      data,
    },
    revalidate: 86400,
  };
};

export default function Movies(props) {
  // const { data, error } = useSWR("/api/database/db.json", { fallbackData: props.data });
  const data = props.data;
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
