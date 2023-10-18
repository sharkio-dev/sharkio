import { Add } from "@mui/icons-material";
import { Button, Card, Paper, Typography } from "@mui/material";
import c from "classnames";
import React, { useCallback, useEffect, useState } from "react";
import {
  createSniffer,
  deleteSniffer,
  editSniffer,
  getSniffers,
  startSniffer,
  stopSniffer,
} from "../../api/api";
import { useSnackbar } from "../../hooks/useSnackbar";
import { useAuthStore } from "../../stores/authStore";
import { SnifferConfig, SnifferCreateConfig } from "../../types/types";
import styles from "./config-card.module.scss";
import { ProxyConfig } from "./ProxyConfig";
import { useRef } from "react";

export type SnifferConfigRow = {
  isNew: boolean;
  config: SnifferConfig;
  isStarted: boolean;
  isEditing: boolean;
  isCollapsed: boolean;
};

export type IConfigCardProps = {
  className?: string;
};

export const ConfigCard: React.FC<IConfigCardProps> = ({ className }) => {
  const [stopLoading, setStopLoading] = useState<boolean>(false);
  const [startLoading, setStartLoading] = useState<boolean>(false);
  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const fileUploadInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuthStore();
  const userId = user?.id;
  const [sniffers, setSniffers] = useState<SnifferConfigRow[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { show: showSnackbar, component: snackBar } = useSnackbar();
  const [isLoadingStarted, setIsLoadingStarted] = useState<boolean>(false);
  const [isLoadingEdit, setIsLoadingEdit] = useState<boolean>(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState<boolean>(false);

  const loadData = useCallback(async () => {
    if (userId == null) {
      console.error("user is not logged in");
      return;
    }
    if (loading) return;
    setLoading(true);
    return getSniffers()
      .then((res) => {
        const configs: SnifferConfigRow[] = res.data.map((config) => ({
          ...config,
          isNew: false,
          isEditing: false,
          isCollapsed: true,
        }));

        setSniffers(configs);
      })
      .catch(() => {
        showSnackbar("Failed to get config", "error");
      })
      .finally(() => setLoading(false));
  }, [loading, showSnackbar]);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNewSnifferClicked = () => {
    setSniffers((prev) => {
      return prev.concat([
        {
          config: {
            isStarted: false,
            name: "",
            port: 0,
            downstreamUrl: "",
            id: "",
          },
          isNew: true,
          isStarted: false,
          isEditing: true,
          isCollapsed: false,
        },
      ]);
    });
  };

  const handleStopClicked = (id: string) => {
    setIsLoadingStarted(true);
    return stopSniffer(id)
      .then(() => loadData())
      .catch(() => {
        showSnackbar("Failed to stop sniffer", "error");
      })
      .finally(() => setIsLoadingStarted(false));
  };

  const handleStartClicked = (id: string) => {
    setIsLoadingStarted(true);
    return startSniffer(id)
      .then(() => {
        loadData();
      })
      .catch(() => {
        showSnackbar("Failed to start sniffer", "error");
      })
      .finally(() => setIsLoadingStarted(false));
  };

  const handleDeleteClicked = (index: number) => {
    if (sniffers[index].isNew === true) {
      setSniffers((config) => {
        const configs = [...config];
        configs.splice(index, 1);
        return configs;
      });
    } else {
      setIsLoadingDelete(true);
      const x = sniffers[index].config.id;

      if (x !== undefined) {
        deleteSniffer(x).then(() => {
          setSniffers((config) => {
            const configs = [...config];
            configs.splice(index, 1);
            return configs;
          });
          setIsLoadingDelete(false);
          showSnackbar("Removed sniffer successfully", "info");
        });
      }
    }
  };

  const handleSaveClicked = async (config: SnifferConfig) => {
    if (
      config.port === undefined ||
      config.downstreamUrl === undefined ||
      userId == null
    ) {
      console.error("port url and userId are required");
      console.log({
        port: config.port,
        userId: userId,
        downstreamUrl: config.downstreamUrl,
      });
      return;
    }
    const saveConfig: SnifferCreateConfig = {
      name: config.name ?? "",
      port: config.port,
      downstreamUrl: config.downstreamUrl,
      id: config.id,
    };
    setIsLoadingEdit(true);
    await createSniffer(saveConfig)
      .then(() => {
        loadData();
        showSnackbar("Created sniffer", "info");
      })
      .catch(() => {
        showSnackbar("Failed to create proxy", "error");
      })
      .finally(() => setIsLoadingEdit(false));
  };

  const handleEditClicked = async (
    index: number,
    newConfig: SnifferCreateConfig,
  ) => {
    if (sniffers[index].isEditing === false) {
      setSniffers((prev) => {
        return prev.map((sniffer: SnifferConfigRow, idx: number) => {
          if (index === idx) {
            sniffer.isEditing = true;
          }
          return sniffer;
        });
      });
      showSnackbar("Sniffer in edit mode", "info");
    } else {
      if (userId == null) {
        console.error("userId is required");
        return;
      }

      setIsLoadingEdit(true);
      await editSniffer(userId, newConfig)
        .then(() => {
          loadData();
          showSnackbar("Changes were saved", "info");
        })
        .catch(() => {
          showSnackbar("Failed to edit config", "error");
        })
        .finally(() => setIsLoadingEdit(false));
    }
  };

  return (
    <>
      <Card className={c(className, styles.container)}>
        <div className={styles.titleBar}>
          <Typography variant="h6" gutterBottom>
            Create Your Proxy
          </Typography>
        </div>
        <div
          className={"grid sm:grid-cols1 md:grid-cols-2 lg:grid-cols-4 gap-3"}
        >
          {sniffers?.map((sniffer, index) => {
            return (
              <Paper elevation={10} className="p-3" key={`config-row-${index}`}>
                <div key={`config-row-${index}`} className={styles.inputs}>
                  <ProxyConfig
                    sniffer={sniffer}
                    handleSnifferChanged={(s) => {
                      const newSniffers = [...sniffers];
                      newSniffers[index] = s;
                      setSniffers(newSniffers);
                    }}
                    handleDeleteClicked={() => {
                      handleDeleteClicked(index);
                    }}
                    onStart={() =>
                      sniffer.config.port !== undefined &&
                      handleStartClicked(sniffer.config.id)
                    }
                    onStop={() =>
                      sniffer.config.port !== undefined &&
                      handleStopClicked(sniffer.config.id)
                    }
                    onEdit={() => {
                      handleEditClicked(
                        index,
                        sniffer.config as SnifferCreateConfig,
                      );
                    }}
                    onSave={() => {
                      handleSaveClicked(sniffer.config);
                    }}
                    isLoadingStarted={isLoadingStarted}
                    isLoadingEdit={isLoadingEdit}
                    isLoadingDelete={isLoadingDelete}
                  />
                </div>
              </Paper>
            );
          })}
        </div>
        <div className={styles.addSnifferBtn}>
          <Button
            onClick={handleNewSnifferClicked}
            className={styles.addSnifferBtn}
          >
            <Add />
            <Typography>New sniffer</Typography>
          </Button>
        </div>
      </Card>
      {snackBar}
    </>
  );
};
