import {
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  List,
  ListItemButton,
  Typography
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { generatePath, useNavigate } from "react-router-dom";
import { routes } from "../../constants/routes";
import { RequestsMetadataContext } from "../../context/requests-context";
import { FilterBar } from "../filter-bar/filter-bar";
import { HttpMethod } from "../http-method/http-method";
import { ServiceName } from "../service-name/service-name";
import styles from "./requests-card.module.scss";

interface IRequestCardProps {
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
  const navigate = useNavigate();

  useEffect(() => {
    loadData?.();
  }, []);

  const handleFilterChanged: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (e) => {
    setFilter(e.target.value);
  };

  const filteredRequests = requests?.filter(
    (req: any) =>
      (filter ? req.url.includes(filter) : true) &&
      (methodsFilter.length > 0
        ? methodsFilter.find((method) => method === req.method) !== undefined
        : true) &&
      (servicesFilter.length > 0
        ? servicesFilter.find((service) => service === req.service) !==
          undefined
        : true)
  );

  return (
    <>
      {withControls && (
        <FilterBar
          handleFilterChanged={handleFilterChanged}
          services={services}
          setMethodsFilter={setMethodsFilter}
          setServicesFilter={setServicesFilter}
        />
      )}
      <div className={styles.container}>
        <Card className={styles.card}>
          <div className={styles.titleContainer}>
            <Typography variant="h6">Requests</Typography>
            <Button onClick={() => loadData?.()}>refresh</Button>
          </div>
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
                {filteredRequests &&
                  filteredRequests.map((req: any) => (
                    <ListItemButton
                      key={req.id}
                      onClick={() => {
                        navigate(generatePath(routes.REQUEST, { id: req.id }));
                      }}
                    >
                      <Box
                        sx={{
                          width: "100%",
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <div className={styles.requestLeftSection}>
                          <div className={styles.serviceContainer}>
                            <ServiceName service={req.service} />
                          </div>
                          <div className={styles.methodContainer}>
                            <HttpMethod method={req.method} />
                          </div>
                          <span className={styles.url}>{req.url}</span>
                        </div>

                        <div>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              columnGap: "15px",
                            }}
                          >
                            <Box
                              sx={{
                                display: {
                                  xs: "none",
                                  sm: "none",
                                  md: "none",
                                  lg: "block",
                                  xl: "block",
                                },
                              }}
                            >
                              <div>{req.lastInvocationDate}</div>
                            </Box>
                            <Chip label={req.hitCount}></Chip>
                          </Box>
                        </div>
                      </Box>
                    </ListItemButton>
                  ))}
              </List>
            </>
          )}
          <div className={styles.requestCardFooter}>
            <div>items:{filteredRequests?.length}</div>
          </div>
        </Card>
      </div>

      <Box
        sx={{
          display: "flex",
          padding: "20px",
          justifyContent: "center",
        }}
      ></Box>
    </>
  );
};
