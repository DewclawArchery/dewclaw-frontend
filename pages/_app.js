import '../styles/globals.css';
import Layout from '../components/Layout';

function MyApp({ Component, pageProps }) {
  return (
    <Layout title={pageProps?.title} description={pageProps?.description}>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
