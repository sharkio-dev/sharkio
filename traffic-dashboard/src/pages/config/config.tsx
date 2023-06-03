import { ConfigCard } from "../../components/config-card/config-card";
import styles from "./config.module.scss";

export const Config = () => {
  return (
    <>
      <ConfigCard className={styles.container} />
    </>
  );
};
