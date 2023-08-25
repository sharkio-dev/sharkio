import React, { useCallback } from "react";
import {
  Add,
  Delete,
  Edit,
  FileDownload,
  FileUpload,
  PlayArrow,
  Save,
  Stop,
} from "@mui/icons-material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {
  Button,
  Card,
  CircularProgress,
  Collapse,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import c from "classnames";
import { saveAs } from "file-saver";
import { useEffect, useRef, useState } from "react";
import {
  createSniffer,
  deleteSniffer,
  editSniffer,
  getSniffers,
  startSniffer,
  stopSniffer,
} from "../../api/api";
import { useSnackbar } from "../../hooks/useSnackbar";
import { SnifferConfig, SnifferCreateConfig } from "../../types/types";
import styles from "./config-card.module.scss";
import { generatePath, useNavigate } from "react-router-dom";
import { routes } from "../../constants/routes";

export type SnifferConfigRow = {
  isNew: boolean;
  config: Partial<SnifferConfig>;
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

  const [sniffers, setSniffers] = useState<SnifferConfigRow[]>([
    {
      config: {
        port: undefined,
        downstreamUrl: undefined,
        name: undefined,
      },
      isStarted: false,
      isNew: true,
      isEditing: false,
      isCollapsed: true,
    },
  ]);

  const [loading, setLoading] = useState<boolean>(false);
  const { show: showSnackbar, component: snackBar } = useSnackbar();

  const loadData = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    await getSniffers()
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
          config: { port: undefined, downstreamUrl: undefined },
          isNew: true,
          isStarted: false,
          isEditing: true,
          isCollapsed: false,
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
      name: config.name ?? "",
      port: config.port,
      downstreamUrl: config.downstreamUrl,
      id: config.port.toString(),
    };

    setSaveLoading(true);
    await createSniffer(saveConfig)
      .then(() => {
        loadData();
        showSnackbar("Created sniffer", "info");
      })
      .catch(() => {
        showSnackbar("Failed to create proxy", "error");
      })
      .finally(() => {
        setSaveLoading(false);
      });
  };

  const handleImportClicked = () => {
    fileUploadInputRef.current?.click();
  };

  const handleExportClicked = () => {
    const file = new Blob(
      [
        JSON.stringify(
          sniffers.map((sniffer) => sniffer.config),
          null,
          2,
        ),
      ],
      { type: "text/plain;charset=utf-8" },
    );
    saveAs(file, "config.json");
  };

  const handlePortChanged = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    index: number,
  ) => {
    setSniffers((prev) => {
      const sniffers = [...prev];
      sniffers[index].config.port = +e.target.value;

      return sniffers;
    });
  };

  const handleUrlChanged = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    index: number,
  ) => {
    setSniffers((prev) => {
      const sniffers = [...prev];
      sniffers[index].config.downstreamUrl = e.target.value;

      return sniffers;
    });
  };

  const handleNameChanged = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    index: number,
  ) => {
    setSniffers((prev) => {
      const sniffers = [...prev];
      sniffers[index].config.name = e.target.value;

      return sniffers;
    });
  };

  const handleConfigUploaded = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.files &&
      e.target.files[0]
        .text()
        .then((res) => {
          const config = JSON.parse(res);
          setSniffers(
            config.map((sniffer: any) => {
              const configRow: SnifferConfigRow = {
                config: sniffer,
                isNew: true,
                isStarted: true,
                isEditing: false,
                isCollapsed: false,
              };
              return configRow;
            }),
          );
          showSnackbar("Successfully set the config file", "info");
        })
        .catch(() => {
          showSnackbar("Failed to import config", "error");
        });
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
      setLoading(true);
      await editSniffer(newConfig)
        .then(() => {
          loadData();
          showSnackbar("Changes were saved", "info");
        })
        .catch(() => {
          showSnackbar("Failed to edit config", "error");
        })
        .finally(() => setLoading(false));
    }
  };

  const handleShowFieldsClicked = (index: number) => {
    setSniffers((prevSniffers: SnifferConfigRow[]) => {
      return prevSniffers.map((sniffer: SnifferConfigRow, idx: number) => {
        if (index === idx) {
          sniffer.isCollapsed = !sniffer.isCollapsed;
        }
        return sniffer;
      });
    });
  };

  const navigate = useNavigate();
  const snifferConfigForm = (sniffer: SnifferConfigRow, index: number) => {
    const navigateToSniffer = () => {
      navigate(
        generatePath(routes.SERVICE, {
          port: sniffer.config.port,
        }),
      );
    };
    return (
      <>
        {sniffer.isCollapsed && (
          <Typography
            className={styles.snifferTitle}
            variant="h5"
            onClick={navigateToSniffer}
          >
            {sniffer.config.name == "" ? "No Name" : sniffer.config.name}
          </Typography>
        )}
        <Collapse orientation="horizontal" in={!sniffer.isCollapsed}>
          <TextField
            label={"Port"}
            placeholder="1234"
            defaultValue={sniffer.config.port}
            disabled={sniffer.isEditing === false}
            value={sniffer.config.port || ""}
            onChange={(
              e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
            ) => {
              handlePortChanged(e, index);
            }}
          />
        </Collapse>
        <Collapse orientation="horizontal" in={!sniffer.isCollapsed}>
          <TextField
            label={"Proxy url"}
            placeholder="http://example.com"
            defaultValue={sniffer.config.downstreamUrl}
            value={sniffer.config.downstreamUrl || ""}
            disabled={sniffer.isEditing === false}
            onChange={(
              e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
            ) => {
              handleUrlChanged(e, index);
            }}
          />
        </Collapse>
        <Collapse orientation="horizontal" in={!sniffer.isCollapsed}>
          <TextField
            label={"Name"}
            placeholder="name"
            defaultValue={sniffer.config.name}
            value={sniffer.config.name || ""}
            disabled={sniffer.isEditing === false}
            onChange={(
              e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
            ) => {
              handleNameChanged(e, index);
            }}
          />
        </Collapse>
      </>
    );
  };

  return (
    <>
      <Card className={c(className, styles.container)}>
        <div className={styles.titleBar}>
          <Typography variant="h6" gutterBottom>
            Config
          </Typography>
          <div>
            <Tooltip title={"export"}>
              <Button onClick={handleExportClicked}>
                <FileDownload />
              </Button>
            </Tooltip>
            <Tooltip title={"import"}>
              <Button onClick={handleImportClicked}>
                <FileUpload />
                <input
                  ref={fileUploadInputRef}
                  type="file"
                  accept="application/JSON"
                  hidden
                  onChange={handleConfigUploaded}
                />
              </Button>
            </Tooltip>
          </div>
        </div>
        {sniffers?.map((sniffer, index) => {
          return (
            <div key={`config-row-${index}`} className={styles.inputs}>
              {snifferConfigForm(sniffer, index)}
              {sniffer.isNew === false && (
                <>
                  <Tooltip title={"Start sniffing requests"}>
                    <Button
                      color="success"
                      onClick={() =>
                        sniffer.config.port !== undefined &&
                        handleStartClicked(sniffer.config.port)
                      }
                      disabled={
                        sniffer.isStarted === true || sniffer.isEditing === true
                      }
                    >
                      {startLoading === true ? (
                        <CircularProgress />
                      ) : (
                        <PlayArrow />
                      )}
                    </Button>
                  </Tooltip>
                  <Tooltip title={"Stop sniffing requests"}>
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
                  </Tooltip>
                  <Tooltip
                    title={
                      sniffer.isEditing ? "Save changes" : "Edit the sniffer"
                    }
                  >
                    <Button
                      color="info"
                      onClick={() => {
                        handleEditClicked(
                          index,
                          sniffer.config as SnifferCreateConfig,
                        );
                      }}
                      disabled={sniffer.isStarted === true}
                    >
                      {sniffer.isEditing ? <Save /> : <Edit />}
                    </Button>
                  </Tooltip>
                </>
              )}
              {sniffer.isNew === true && (
                <>
                  <Tooltip title="Save new sniffer">
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
                      {saveLoading === true ? <CircularProgress /> : <Save />}
                    </Button>
                  </Tooltip>
                </>
              )}
              <Tooltip title="Remove the sniffer">
                <Button
                  color="error"
                  onClick={() => {
                    handleDeleteClicked(index);
                  }}
                  disabled={sniffer.isStarted === true}
                >
                  <Delete></Delete>
                </Button>
              </Tooltip>
              <Tooltip title="Show fields">
                <Button
                  color="info"
                  onClick={() => {
                    handleShowFieldsClicked(index);
                  }}
                >
                  {!sniffer.isCollapsed ? (
                    <ChevronLeftIcon />
                  ) : (
                    <ChevronRightIcon />
                  )}
                </Button>
              </Tooltip>
            </div>
          );
        })}
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
