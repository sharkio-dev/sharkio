import { useEffect, useState } from "react";
import { SnifferConfig, changeConfig, getConfig } from "../../api/api";
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
      .then((data: any) => setConfig(JSON.parse(data)))
      .catch((err) => {
        show("Failed to get config", "error");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleConfigChange = () => {
    if (!config) {
      return;
    }

    changeConfig(config)
      .then((res) => {
        show("changed config", "success");
      })
      .catch((e) => show("failed to change config", "error"));
  };

  return (
    <>
      Config
      <Card className={styles.container}>
        <div className={styles.inputs}>
          <TextField
            label={"Port"}
            defaultValue={config?.port}
            value={config?.port}
            onChange={(e) => {
              setConfig((prev) => ({
                downstreamUrl: prev?.downstreamUrl ?? "",
                port: +e.target.value,
              }));
            }}
          />
          <TextField
            label={"Proxy url"}
            defaultValue={config?.downstreamUrl}
            value={config?.downstreamUrl}
            onChange={(e) => {
              setConfig((prev) => ({
                downstreamUrl: e.target.value,
                port: prev?.port ?? 0,
              }));
            }}
          />
          <Button color="warning" onClick={handleConfigChange}>
            change
          </Button>
        </div>
        <div>
          <Button color="success">start</Button>

          <Button color="error">stop</Button>
        </div>
      </Card>
      {snackBar}
    </>
  );
};
