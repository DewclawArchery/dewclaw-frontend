import Head from "next/head";
import Header from "./Header";
import Footer from "./Footer";
import { useRouter } from "next/router";
import TeriWidget from "@/components/Teri/TeriWidget";

export default function Layout({ children, title, description }) {
  const router = useRouter();

  const isHome = router.pathname === "/";

  const pageTitle = title ? `${title} | Dewclaw Archery` : "Dewclaw Archery";

  const pageDescription =
    description ||
    "Dewclaw Archery – Southern Oregon’s trusted archery resource for pro-shop services, custom arrows, leagues, and a community of shooters.";

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Inter Font */}
      </Head>

      <div className="flex min-h-screen flex-col bg-dew-bg text-slate-100">
        <Header />

        {/* Home gets its own layout.
            All other pages get the page-shell wrapper. */}
        <main className="flex-1">
          {isHome ? children : <div className="page-shell">{children}</div>}
        </main>

        <Footer />
      </div>

      {/* T.E.R.I. chat mount (site-wide) */}
      <TeriWidget />
    </>
  );
}
