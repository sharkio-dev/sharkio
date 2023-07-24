import React from "react";
import { ConfigCard } from "../../components/config-card/config-card";
import { RequestsCard } from "../../components/requests-card/requests-card";
import styles from "./home.module.scss";

export const Home: React.FC = () => {
  return (
    <div className={styles.container}>
      <ConfigCard />
      <RequestsCard withControls={false} />
    </div>
  );
};
