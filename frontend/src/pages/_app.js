import { store } from "@/config/redux/store.js";
import "@/styles/globals.css";
import { Provider } from "react-redux";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <main className={poppins.className}>
        <Component {...pageProps} />
      </main>
    </Provider>
  );
}
