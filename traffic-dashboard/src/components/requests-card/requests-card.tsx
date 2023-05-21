import { Edit } from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  IconButton,
  Input,
  List,
  ListItemButton,
  TextField,
  Typography,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { RequestsMetadataContext } from "../../context/requests-context";
import { HttpMethod } from "../http-method/http-method";
import styles from "./requests-card.module.scss";
import { generatePath, useNavigate } from "react-router-dom";
import { routes } from "../../constants/routes";

export const RequestsCard = () => {
  const [filter, setFilter] = useState<string>();
  const [methodsFilter, setMethodsFilter] = useState<string[]>([]);
  const {
    data: requests,
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
        : true)
  );

  return (
    <>
      <Box
        sx={{
          padding: "20px 0px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Input onChange={handleFilterChanged} placeholder="Search..."></Input>
        <Autocomplete
          freeSolo
          disablePortal
          multiple
          renderTags={(value: string[], getTagProps) =>
            value.map((option: string, index: number) => (
              <Chip
                variant="outlined"
                label={option}
                {...getTagProps({ index })}
              />
            ))
          }
          id="combo-box-demo"
          options={["GET", "POST", "PATCH", "PUT", "DELETE"]}
          sx={{ width: 300 }}
          renderInput={(params) => (
            <TextField variant="filled" {...params} label="Method" />
          )}
          onChange={(e, value) => {
            setMethodsFilter(value);
          }}
        />
      </Box>
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
                    <ListItemButton key={req.id}>
                      <Box
                        sx={{
                          width: "100%",
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <div className={styles.requestLeftSection}>
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
                            <IconButton
                              size="small"
                              onClick={() => {
                                navigate(
                                  generatePath(routes.REQUEST, { id: req.id })
                                );
                              }}
                            >
                              <Edit />
                            </IconButton>
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
