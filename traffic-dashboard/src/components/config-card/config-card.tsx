import { Add, Delete, PlayArrow, Save, Stop } from "@mui/icons-material";
import {
  Button,
  Card,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  createSniffer,
  getSniffers,
  startSniffer,
  stopSniffer,
} from "../../api/api";
import { useSnackbar } from "../../hooks/useSnackbar";
import { SnifferConfig, SnifferCreateConfig } from "../../types/types";
import styles from "./config-card.module.scss";

type SnifferConfigRow = {
  isNew: boolean;
  config: Partial<SnifferConfig>;
  isStarted: boolean;
};

export const ConfigCard: React.FC = () => {
  const [stopLoading, setStopLoading] = useState<boolean>(false);
  const [startLoading, setStartLoading] = useState<boolean>(false);
  const [saveLoading, setSaveLoading] = useState<boolean>(false);

  const [sniffers, setSniffers] = useState<SnifferConfigRow[]>([
    {
      config: {
        port: undefined,
        downstreamUrl: undefined,
      },
      isStarted: false,
      isNew: true,
    },
  ]);

  const [loading, setLoading] = useState<boolean>(false);
  const { show: showSnackbar, hide, component: snackBar } = useSnackbar();

  const loadData = async () => {
    if (loading) return;
    setLoading(true);
    await getSniffers()
      .then((res: any) => {
        const configs = res.data.map((config: any) => ({
          ...config,
          isNew: false,
        }));

        setSniffers(configs);
      })
      .catch((err) => {
        showSnackbar("Failed to get config", "error");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleNewSnifferClicked = () => {
    setSniffers((prev) => {
      return prev.concat([
        {
          config: { port: undefined, downstreamUrl: undefined },
          isNew: true,
          isStarted: false,
        },
      ]);
    });
  };

  const handleStopClicked = async (port: number) => {
    setStopLoading(true);
    await stopSniffer(port)
      .then(() => loadData())
      .catch(() => {
        showSnackbar("Failed to stop sniffer", "error");
      })
      .finally(() => setStopLoading(false));
  };

  const handleStartClicked = async (port: number) => {
    setStartLoading(true);
    await startSniffer(port)
      .then((res) => {
        showSnackbar("then", "error");

        loadData();
      })
      .catch(() => {
        showSnackbar("Failed to start sniffer", "error");
      })
      .finally(() => {
        setStartLoading(false);
      });
  };

  const handleDeleteClicked = (index: number) => {
    setSniffers((config) => {
      const configs = [...config];
      configs.splice(index, 1);
      return configs;
    });
  };

  const handleSaveClicked = async (config: Partial<SnifferConfig>) => {
    if (config.port === undefined || config.downstreamUrl === undefined) {
      return;
    }
    const saveConfig: SnifferCreateConfig = {
      port: config.port,
      downstreamUrl: config.downstreamUrl,
    };

    setSaveLoading(true);
    await createSniffer(saveConfig)
      .then(() => {
        loadData();
        showSnackbar("Created sniffer", "info");
      })
      .catch((e) => {
        showSnackbar("Failed to create proxy", "error");
      })
      .finally(() => {
        setSaveLoading(false);
      });
  };

  return (
    <>
      <Card className={styles.container}>
        <Typography variant="h6" gutterBottom>
          Config
        </Typography>
        {sniffers?.map((sniffer, index) => {
          return (
            <div key={`config-row-${index}`} className={styles.inputs}>
              <TextField
                label={"Port"}
                defaultValue={sniffer.config.port}
                contentEditable={sniffer.isNew === true}
                disabled={sniffer.isNew === false}
                value={sniffer.config.port}
                onChange={(
                  e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
                ) => {
                  setSniffers((prev) => {
                    const sniffers = [...prev];
                    sniffers[index].config.port = +e.target.value;

                    return sniffers;
                  });
                }}
              />
              <TextField
                label={"Proxy url"}
                defaultValue={sniffer.config.downstreamUrl}
                value={sniffer.config.downstreamUrl}
                contentEditable={sniffer.isNew === true}
                disabled={sniffer.isNew === false}
                onChange={(
                  e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
                ) => {
                  setSniffers((prev) => {
                    const sniffers = [...prev];
                    sniffers[index].config.downstreamUrl = e.target.value;

                    return sniffers;
                  });
                }}
              />
              {sniffer.isNew === false && (
                <>
                  <Button
                    color="success"
                    onClick={() =>
                      sniffer.config.port !== undefined &&
                      handleStartClicked(sniffer.config.port)
                    }
                    disabled={sniffer.isStarted === true}
                  >
                    {startLoading === true ? (
                      <CircularProgress />
                    ) : (
                      <PlayArrow></PlayArrow>
                    )}
                  </Button>
                  <Button
                    color="warning"
                    disabled={sniffer.isStarted === false}
                    onClick={() =>
                      sniffer.config.port !== undefined &&
                      handleStopClicked(sniffer.config.port)
                    }
                  >
                    {stopLoading === true ? (
                      <CircularProgress />
                    ) : (
                      <Stop></Stop>
                    )}
                  </Button>
                </>
              )}
              {sniffer.isNew === true && (
                <>
                  <Button
                    color="info"
                    disabled={
                      sniffer.config.port === undefined ||
                      sniffer.config.downstreamUrl === undefined
                    }
                    onClick={() => {
                      handleSaveClicked(sniffer.config);
                    }}
                  >
                    {saveLoading === true ? (
                      <CircularProgress />
                    ) : (
                      <Save></Save>
                    )}
                  </Button>

                  <Button
                    color="error"
                    onClick={() => {
                      handleDeleteClicked(index);
                    }}
                  >
                    <Delete></Delete>
                  </Button>
                </>
              )}
            </div>
          );
        })}
        <div className={styles.addSnifferBtn}>
          <Button
            onClick={handleNewSnifferClicked}
            className={styles.addSnifferBtn}
          >
            <Add></Add>
            <Typography>New sniffer</Typography>
          </Button>
        </div>
      </Card>
      {snackBar}
    </>
  );
};
