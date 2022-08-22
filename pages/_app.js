import "../styles/globals.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import { SWRConfig } from "swr";

export default function MyApp({ Component, pageProps }) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout || ((page) => page);

  return (
    <SWRConfig
      value={{
        fetcher: async (...args) => {
          const response = await fetch(...args);
          const data = await response.json();
          if (!response.ok) {
            const error = new Error("An error has occured while fetching data.");
            error.status = response.status;
            error.name = "SWR Fetcher Error";
            error.info = data;
            throw error;
          }

          return data;
        },
      }}>
      {getLayout(<Component {...pageProps} />)}
    </SWRConfig>
  );
}
