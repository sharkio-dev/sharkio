import c from "classnames";
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
  deleteSniffer,
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

export type IConfigCardProps = {
  className?: string;
};

export const ConfigCard: React.FC<IConfigCardProps> = ({ className }) => {
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
  const { show: showSnackbar, component: snackBar } = useSnackbar();

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
      .catch(() => {
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
      .then(() => {
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
    if (sniffers[index].isNew === true) {
      setSniffers((config) => {
        const configs = [...config];
        configs.splice(index, 1);
        return configs;
      });
    } else {
      const x = sniffers[index].config.port;

      if (x !== undefined) {
        deleteSniffer(x).then(() => {
          setSniffers((config) => {
            const configs = [...config];
            configs.splice(index, 1);
            return configs;
          });
          showSnackbar("Removed sniffer successfully", "info");
        });
      }
    }
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
      .catch((_) => {
        showSnackbar("Failed to create proxy", "error");
      })
      .finally(() => {
        setSaveLoading(false);
      });
  };

  return (
    <>
      <Card className={c(className, styles.container)}>
        <Typography variant="h6" gutterBottom>
          Config
        </Typography>
        {sniffers?.map((sniffer, index) => {
          return (
            <div key={`config-row-${index}`} className={styles.inputs}>
              <TextField
                label={"Port"}
                defaultValue={sniffer.config.port}
                disabled={sniffer.isNew === false}
                value={sniffer.config.port || ""}
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
                value={sniffer.config.downstreamUrl || ""}
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
                </>
              )}
              <Button
                color="error"
                onClick={() => {
                  handleDeleteClicked(index);
                }}
                disabled={sniffer.isStarted === true}
              >
                <Delete></Delete>
              </Button>
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
