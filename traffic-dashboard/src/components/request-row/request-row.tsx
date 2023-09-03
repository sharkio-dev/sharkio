import { Box, Chip, ListItemButton } from "@mui/material";
import React, { useContext } from "react";
import { RequestsMetadataContext } from "../../context/requests-context";
import { InterceptedRequest, SnifferConfig } from "../../types/types";
import { HttpMethod } from "../http-method/http-method";
import { ServiceName } from "../service-name/service-name";
import styles from "./request-row.module.scss";
interface IRequestRowProps {
  serviceId: SnifferConfig["id"];
  onRequestClicked: (requestId: InterceptedRequest["id"]) => void;
  id: InterceptedRequest["id"];
  method: InterceptedRequest["method"];
  url: InterceptedRequest["url"];
  timestamp: InterceptedRequest["lastInvocationDate"];
  hitCount?: InterceptedRequest["hitCount"];
}

export const RequestRow: React.FC<IRequestRowProps> = ({
  serviceId,
  onRequestClicked,
  id,
  method,
  url,
  timestamp,
  hitCount,
}) => {
  const { servicesData } = useContext(RequestsMetadataContext);
  const service = servicesData?.find((service) => service.id == serviceId);

  return (
    <>
      <ListItemButton key={id} onClick={() => onRequestClicked(id)}>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div className={styles.requestLeftSection}>
            <div className={styles.serviceContainer}>
              <ServiceName service={service?.name ?? ""} />
            </div>
            <div className={styles.methodContainer}>
              <HttpMethod method={method} />
            </div>
            <span className={styles.url}>{url}</span>
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
                <div>{timestamp}</div>
              </Box>
              {hitCount && <Chip label={hitCount}></Chip>}
            </Box>
          </div>
        </Box>
      </ListItemButton>
    </>
  );
};
