import Footer from "./Footer";
import Head from "next/head";
import Nav from "./Nav";

export default function Layout({ children, ...pageProps }) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex" />
        <title>EyeCandy Cinemas</title>
        <meta name="og:title" content="EyeCandy Cinemas" key="title" />
        <meta name="description" content="Enjoy the latest blockbusters at EyeCandy Cinemas!" />
        <meta name="og:description" content="Enjoy the latest blockbusters at EyeCandy Cinemas!" key="description" />
        <meta name="subject" content="entertainment, movies" />
        <meta name="author" content="EyeCandy Entertainment" />
        <meta name="keywords" content="entertainment, movies" />
        <meta name="category" content="entertainment, movies" />
        <meta name="topic" content="entertainment, movies" />
        <meta name="og:type" content="entertainment, movies" key="type" />
        <meta name="og:country-name" content="NZ" key="country-name" />
        <meta name="language" content="ENG" />
        {/* <link rel="preload" href="/api/fetch/database" as="fetch" crossOrigin="anonymous" /> */}
      </Head>
      <Nav navProps={pageProps.navProps} />
      {children}
      <Footer />
    </>
  );
}
