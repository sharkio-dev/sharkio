import { useEffect, useState } from "react";
import { SnifferConfig, getConfig } from "../../api/api";
import { useSnackbar } from "../../hooks/useSnackbar";
import { Button, Card, TextField } from "@mui/material";
import styles from "./config-card.module.scss";

export const ConfigCard: React.FC = () => {
  const [config, setConfig] = useState<SnifferConfig>();
  const [loading, setLoading] = useState<boolean>(false);
  const { show, hide, component: snackBar } = useSnackbar();

  const loadData = () => {
    if (loading) return;
    setLoading(true);
    getConfig()
      .then((data) => setConfig(data))
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
      Config
      <Card className={styles.container}>
        <div className={styles.inputs}>
          <TextField label={"port"} value={config?.port}></TextField>
          <TextField label={"url"} value={config?.downstreamUrl}></TextField>
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
