import {
  Box,
  Button,
  Card,
  CircularProgress,
  FormControlLabel,
  List,
  Switch,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { RequestsMetadataContext } from "../../context/requests-context";
import { FilterBar } from "../filter-bar/filter-bar";
import { RequestRow } from "../request-row/request-row";
import styles from "./requests-card.module.scss";
import { generatePath, useNavigate } from "react-router-dom";
import { routes } from "../../constants/routes";
import { InterceptedRequest, SnifferConfig } from "../../types/types";

interface IRequestCardProps {
  className?: string;
  withControls: boolean;
}
export const RequestsCard: React.FC<IRequestCardProps> = ({
  withControls = false,
}) => {
  const [filter, setFilter] = useState<string>();
  const [methodsFilter, setMethodsFilter] = useState<string[]>([]);
  const [servicesFilter, setServicesFilter] = useState<string[]>([]);
  const {
    requestsData: requests,
    servicesData: services,
    loadData,
    loading,
  } = useContext(RequestsMetadataContext);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    loadData?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterChanged: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (e) => {
    setFilter(e.target.value);
  };

  const filteredRequests = requests?.filter(
    (req) =>
      (filter ? req.url.includes(filter) : true) &&
      (methodsFilter.length > 0
        ? methodsFilter.find((method) => method === req.method) !== undefined
        : true) &&
      (servicesFilter.length > 0
        ? servicesFilter.find((service) => service === req.serviceId) !==
          undefined
        : true),
  );
  const navigate = useNavigate();

  const handleRequestClicked = (
    requestId: InterceptedRequest["id"],
    serviceId: SnifferConfig["id"],
  ) => {
    navigate(
      generatePath(routes.SERVICE_REQUEST, {
        id: requestId,
        serviceId: serviceId,
      }),
    );
  };
  return (
    <div style={{ flex: 1 }}>
      {withControls && (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
            alignItems: "center",
            marginBottom: "32px",
          }}
        >
          <FilterBar
            handleFilterChanged={handleFilterChanged}
            services={services ?? []}
            setMethodsFilter={setMethodsFilter}
            setServicesFilter={setServicesFilter}
          />
          <LiveSwitch checked={checked} setChecked={setChecked} />
        </div>
      )}
      {!checked ? (
        <RequestCardGrouped
          requests={filteredRequests ?? []}
          loading={loading || false}
          loadData={loadData}
          onRequestClicked={handleRequestClicked}
        />
      ) : (
        <RequestCardLive requests={filteredRequests ?? []} />
      )}
    </div>
  );
};

type RequestCardGroupedProps = {
  requests: InterceptedRequest[];
  loading: boolean;
  loadData?: () => void;
  onRequestClicked: (
    requestId: InterceptedRequest["id"],
    serviceId: SnifferConfig["id"],
  ) => void;
};

const RequestCardGrouped: React.FC<RequestCardGroupedProps> = ({
  requests,
  loading,
  loadData,
  onRequestClicked,
}) => {
  return (
    <Card className={styles.card}>
      <div className={styles.titleContainer}>
        <Typography variant="h6">Requests</Typography>
        <Button onClick={() => loadData?.()}>refresh</Button>
      </div>
      <div className={styles.requestsSection}>
        {loading ? (
          <Box
            sx={{
              display: "flex",
              padding: "20px",
              justifyContent: "center",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <>
            <List>
              {requests &&
                requests.map((req) => (
                  <RequestRow
                    key={req.id}
                    serviceId={req.serviceId}
                    onRequestClicked={() => {
                      onRequestClicked(req.id, req.serviceId);
                    }}
                    id={req.id}
                    method={req.method}
                    url={req.url}
                    timestamp={req.lastInvocationDate}
                    hitCount={req.hitCount}
                  />
                ))}
            </List>
          </>
        )}
      </div>
      <div className={styles.requestCardFooter}>
        <div>items:{requests?.length}</div>
      </div>
    </Card>
  );
};

type RequestCardLiveProps = {
  requests: InterceptedRequest[];
};

type Invocation = {
  timestamp: string;
  method: string;
  url: string;
  serviceId: string;
  id: string;
};

const RequestCardLive: React.FC<RequestCardLiveProps> = ({ requests }) => {
  const { loadData } = useContext(RequestsMetadataContext);

  useEffect(() => {
    const interval = setInterval(() => {
      loadData?.();
    }, 1000);
    return () => clearInterval(interval);
  }, [loadData]);

  const invocations: Invocation[] = useMemo(() => {
    const invocs: Invocation[] = [];
    requests.forEach((req) => {
      req.invocations.forEach((inv) => {
        invocs.push({
          timestamp: inv.timestamp,
          method: req.method,
          url: req.url,
          serviceId: req.serviceId,
          id: inv.id,
        });
      });
    });
    invocs.sort((a, b) => {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

    return invocs;
  }, [requests]);

  return (
    <Card className={styles.card}>
      <Typography variant="h6">Live</Typography>
      <List>
        {invocations.map((inv) => (
          <RequestRow
            key={inv.id}
            serviceId={inv.serviceId}
            onRequestClicked={() => {
              // TODO: Add click handler
              console.log("clicked");
            }}
            id={inv.id}
            method={inv.method}
            url={inv.url}
            timestamp={inv.timestamp}
          />
        ))}
      </List>
    </Card>
  );
};

type LiveSwitchProps = {
  checked: boolean;
  setChecked: (checked: boolean) => void;
};

const LiveSwitch: React.FC<LiveSwitchProps> = ({ checked, setChecked }) => {
  const handleChange = (event: any) => {
    setChecked(event.target.checked);
  };

  return (
    <FormControlLabel
      control={
        <Switch
          checked={checked}
          onChange={handleChange}
          name="Live"
          color="primary"
        />
      }
      label="Live"
    />
  );
};
