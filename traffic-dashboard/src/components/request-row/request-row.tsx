import { ListItemButton, Box, Chip } from "@mui/material";
import { generatePath, useNavigate } from "react-router-dom";
import { routes } from "../../constants/routes";
import { HttpMethod } from "../http-method/http-method";
import { ServiceName } from "../service-name/service-name";
import styles from "./request-row.module.scss";
interface IRequestRowProps {
  request: any;
}

export const RequestRow: React.FC<IRequestRowProps> = ({ request }) => {
  const navigate = useNavigate();

  return (
    <>
      <ListItemButton
        key={request.id}
        onClick={() => {
          navigate(generatePath(routes.REQUEST, { id: request.id }));
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
              <ServiceName service={request.service} />
            </div>
            <div className={styles.methodContainer}>
              <HttpMethod method={request.method} />
            </div>
            <span className={styles.url}>{request.url}</span>
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
                <div>{request.lastInvocationDate}</div>
              </Box>
              <Chip label={request.hitCount}></Chip>
            </Box>
          </div>
        </Box>
      </ListItemButton>
    </>
  );
};
