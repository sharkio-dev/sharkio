import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";
import styles from "./index.module.css";

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header
      style={{ width: "100%", height: "calc(100vh - 60px)" }}
      className={clsx("hero", styles.heroBanner)}
    >
      <div className="container">
        <Heading
          as="h1"
          className="hero__title hero--primary"
          style={{ color: "#879ec4" }}
        >
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/Getting Started"
          >
            Read the Docs
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  return (
    <Layout title={`Docs`} description="Sharkio Documentation">
      <HomepageHeader />
    </Layout>
  );
}
