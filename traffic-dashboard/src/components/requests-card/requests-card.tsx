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
  const [methodsFilter, setMethodsFilter] = useState<string[]>([]);

  const loadData = () => {
    if (loading) {
      return;
    }

    setLoading(true);
    getRequests()
      .then((res) => res.data)
      .then((res) => {
        setRequests(JSON.parse(res));
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
                        <Button onClick={() => loadData()}>refresh</Button>
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
                        <div>
                          <HttpMethod method={req.method}></HttpMethod>
                          {req.url}
                        </div>
                        <div>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Chip label={req.hitCount}></Chip>
                            <IconButton size="small">
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
          {snackBar}
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
