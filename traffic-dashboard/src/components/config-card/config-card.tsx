import { useEffect, useState } from "react";
import { SnifferConfig, getConfig } from "../../api/api";
import { useSnackbar } from "../../hooks/useSnackbar";
import { Button, Card, TextField, Typography } from "@mui/material";
import styles from "./config-card.module.scss";

export const ConfigCard: React.FC = () => {
  const [config, setConfig] = useState<SnifferConfig>();
  const [loading, setLoading] = useState<boolean>(false);
  const { show, hide, component: snackBar } = useSnackbar();

  const loadData = () => {
    if (loading) return;
    setLoading(true);
    getConfig()
      .then((data: any) => setConfig(JSON.parse(data)))
      .catch((err) => {
        show("Failed to get config", "error");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <>
      <Card className={styles.container}>
        <Typography variant="h6" gutterBottom>
          Response
        </Typography>
        <div className={styles.inputs}>
          <TextField placeholder={"Port"} value={config?.port}></TextField>
          <TextField
            placeholder={"Proxy url"}
            value={config?.downstreamUrl}
          ></TextField>
        </div>
        <div>
          <Button color="success">start</Button>
          <Button color="warning">pause</Button>
          <Button color="error">stop</Button>
        </div>
      </Card>
      {snackBar}
    </>
  );
};
