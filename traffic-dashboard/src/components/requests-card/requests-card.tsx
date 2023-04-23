import { Card, List, ListItem } from "@mui/material";
import { useEffect, useState } from "react";
import { getRequests } from "../../api/api";
import { useSnackbar } from "../../hooks/useSnackbar";

export const RequestsCard = () => {
  const [requests, setRequests] = useState<any>();
  const { open, hide, Snackbar } = useSnackbar();

  useEffect(() => {
    getRequests()
      .then((res) => {
        alert("okay");
        setRequests(res);
      })
      .catch(() => {
        setRequests([]);

        open("Failed to fetch requests!", "error");
      });
  }, []);

  return (
    <Card>
      <List>
        {requests &&
          requests?.map((req: any) => <ListItem>{req.url}</ListItem>)}
      </List>
      <Snackbar />
    </Card>
  );
};
