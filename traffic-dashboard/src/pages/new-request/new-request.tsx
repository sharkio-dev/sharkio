import React from "react";
import { Button, Card, Input, Typography } from "@mui/material";
import styles from "./new-request.module.scss";

export const NewRequest: React.FC = () => {
  return (
    <>
      <Card className={styles.card}>
        <Typography variant="h6" gutterBottom>
          Request
        </Typography>
        <Input placeholder="Url"></Input>
        <Input placeholder="Body"></Input>
        <Input placeholder="Headers"></Input>
        <Input placeholder="Cookies"></Input>
        <Button>Execute</Button>
      </Card>
      <Card className={styles.card}>
        <Typography variant="h6" gutterBottom>
          Response
        </Typography>
      </Card>
    </>
  );
};
