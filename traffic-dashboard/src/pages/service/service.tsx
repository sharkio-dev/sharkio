import React, { useCallback } from "react";
import { PlayArrow, Stop } from "@mui/icons-material";
import {
  Button,
  Card,
  Chip,
  CircularProgress,
  List,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSniffer, startSniffer, stopSniffer } from "../../api/api";
import MockRow from "../../components/mock/mock-row";
import { RequestRow } from "../../components/request-row/request-row";
import { useSnackbar } from "../../hooks/useSnackbar";
import { InterceptedRequest, Mock, Sniffer } from "../../types/types";
import styles from "./service.module.scss";
import { EditMockDialog } from "../mocks/edit-mock-dialog/edit-mock-dialog";

export const Service: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [startLoading, setStartLoading] = useState<boolean>(false);
  const [stopLoading, setStopLoading] = useState<boolean>(false);
  const [editMock, setEditMock] = useState<
    (Omit<Mock, "active"> & { port: number }) | null
  >(null);
  const [editOpen, setEditOpen] = useState<boolean>(false);
  const handleCloseModal = () => {
    setEditOpen(false);
    setEditMock(null);
    loadData();
  };

  const { show: showSnackbar, component: snackBar } = useSnackbar();
  const params = useParams();

  const { port } = params;

  const [sniffer, setSniffer] = useState<Sniffer>();

  const loadData = useCallback(async () => {
    if (loading) return;
    if (!port) return;

    setLoading(true);

    await getSniffer(+port)
      .then((res) => {
        setSniffer(res.data);
      })
      .catch(() => {
        showSnackbar("Failed to get sniffer", "error");
      })
      .finally(() => setLoading(false));
  }, [loading, port, showSnackbar]);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  return (
    <>
      {snackBar}
      {sniffer === undefined ? (
        <>not found</>
      ) : (
        <>
          <div className={styles.title}>
            <Typography variant="h4">{sniffer.config.name}</Typography>
            {sniffer.config.isStarted ? (
              <Chip color="success" label="Live"></Chip>
            ) : (
              <Chip color="error" label="Stopped"></Chip>
            )}
          </div>
          <div className={styles.serviceGrid}>
            <Card className={styles.serviceCard}>
              <div className={styles.controlTitle}>
                <Typography variant="h6">Control</Typography>
                <div>
                  <Tooltip title={"Start sniffing requests"}>
                    <Button
                      color="success"
                      onClick={() => handleStartClicked(sniffer.config.port)}
                      disabled={sniffer.isStarted === true}
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
                      color="error"
                      disabled={sniffer.isStarted === false}
                      onClick={() => handleStopClicked(sniffer.config.port)}
                    >
                      {stopLoading === true ? <CircularProgress /> : <Stop />}
                    </Button>
                  </Tooltip>
                </div>
              </div>
              <div>
                <div className={styles.configFields}>
                  <TextField
                    label={"Port"}
                    placeholder="1234"
                    defaultValue={sniffer.config.port}
                    disabled={sniffer.isStarted === true}
                    value={sniffer.config.port || ""}
                  />
                  <TextField
                    label={"Proxy url"}
                    placeholder="http://example.com"
                    defaultValue={sniffer.config.downstreamUrl}
                    value={sniffer.config.downstreamUrl || ""}
                    disabled={sniffer.isStarted === true}
                  />
                  <TextField
                    label={"Name"}
                    placeholder="name"
                    defaultValue={sniffer.config.name}
                    value={sniffer.config.name || ""}
                    disabled={sniffer.isStarted === true}
                  />
                </div>
              </div>
            </Card>
            <Card className={styles.mocksCard}>
              <div className={styles.mockTitle}>
                <Typography variant="h6">Mocks</Typography>
              </div>
              <div className={styles.mockRowsContainer}>
                {sniffer.mocks.map((mock) => {
                  return (
                    <MockRow
                      key={mock.id}
                      mock={mock}
                      service={sniffer.config}
                      editable={true}
                      loadData={loadData}
                      onEditClick={() => {
                        setEditMock({ ...mock, port: +(port ?? 0) });
                        setEditOpen(true);
                      }}
                    />
                  );
                })}
              </div>
              <EditMockDialog
                mock={editMock!}
                open={editOpen && editMock !== null}
                close={handleCloseModal}
                onDataChange={setEditMock}
              />
            </Card>
            <Card className={styles.requestsCard}>
              <List>
                {sniffer.interceptedRequests.map(
                  (request: InterceptedRequest) => {
                    return (
                      <RequestRow
                        key={request.id}
                        request={request}
                        serviceId={request.serviceId}
                      />
                    );
                  },
                )}
              </List>
            </Card>
          </div>
        </>
      )}
    </>
  );
};
