import React, { PropsWithChildren, ReactNode } from "react";
import styles from "./page-template.module.scss";

export const PageTemplate: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className={styles.container}>This is a page template{children}</div>
  );
};
