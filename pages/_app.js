import '../styles/globals.css';
import Layout from '../components/Layout';
import { SHOW_HOLIDAY_BANNER, HOLIDAY_BANNER_TEXT } from "../config/site";

{SHOW_HOLIDAY_BANNER && (
  <div
    className="
      w-full 
      bg-gradient-to-r from-dew-gold via-yellow-500 to-orange-500
      text-black 
      text-center 
      py-2 
      font-bold 
      shadow-lg 
      tracking-wide 
      z-50
    "
  >
    {HOLIDAY_BANNER_TEXT}
  </div>
)}

function MyApp({ Component, pageProps }) {
  return (
    <Layout title={pageProps?.title} description={pageProps?.description}>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
