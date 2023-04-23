import {
  Box,
  Button,
  Card,
  CircularProgress,
  Input,
  List,
  ListItem,
  ListItemButton,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { getRequests } from "../../api/api";
import { useSnackbar } from "../../hooks/useSnackbar";
import { HttpMethod } from "../http-method/http-method";
import styles from "./requests-card.module.scss";

export const RequestsCard = () => {
  const [requests, setRequests] = useState<any>();
  const [filter, setFilter] = useState<string>();
  const { show, hide, component: snackBar } = useSnackbar();
  const [loading, setLoading] = useState<boolean>(false);

  const loadData = () => {
    if (loading) {
      return;
    }

    setLoading(true);
    getRequests()
      .then((res) => res.data)
      .then((res) => {
        setRequests(JSON.parse(res));
        show("Got requests!", "success");
        console.log(JSON.parse(res));
      })
      .catch(() => {
        setRequests([]);
        show("Failed to fetch requests!", "error");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleFilterChanged: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (e) => {
    setFilter(e.target.value);
  };

  const filteredRequests = !filter
    ? requests
    : requests?.filter((req: any) => req.url.includes(filter));

  return (
    <>
      <Box
        sx={{
          padding: "20px 0px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Typography>Requests</Typography>
        <Input onChange={handleFilterChanged} placeholder="Search..."></Input>
      </Box>
      <div className={styles.container}>
        <Card>
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
            <List>
              {filteredRequests &&
                filteredRequests.map((req: any) => (
                  <ListItemButton>
                    <HttpMethod method={req.method}></HttpMethod> {req.url}
                  </ListItemButton>
                ))}
            </List>
          )}
          {snackBar}
        </Card>
      </div>
      <Box
        sx={{
          display: "flex",
          padding: "20px",
          justifyContent: "center",
        }}
      >
        <Button onClick={() => loadData()}>refresh</Button>
      </Box>
    </>
  );
};
