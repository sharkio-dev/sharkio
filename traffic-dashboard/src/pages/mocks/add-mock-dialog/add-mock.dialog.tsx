import { Dialog, Card, TextField, Typography, Button } from "@mui/material";
import styles from "./add-mock-dialog.module.scss";
import { useState } from "react";
import { createMock } from "../../../api/api";

type AddMockDialogProps = { open: boolean; close: () => void };

export const AddMockDialog: React.FC<AddMockDialogProps> = ({
  open,
  close,
}) => {
  const [port, setPort] = useState<number>(0);
  const [method, setMethod] = useState<string>("");
  const [endpoint, setEndpoint] = useState<string>("");
  const [data, setData] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleAddMock = () => {
    setIsLoading(true);
    createMock(port, method, endpoint, data)
      .then(() => {
        close();
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Dialog open={open} onClose={close}>
      <Card className={styles.card}>
        <Typography>Add mock</Typography>
        <TextField
          label="Port"
          placeholder="1234"
          type="number"
          value={port}
          onChange={(e) => setPort(+e.target.value)}
        />
        <TextField
          label="Method"
          placeholder="GET"
          value={method}
          onChange={(e) => setMethod(e.target.value)}
        />
        <TextField
          label="Endpoint"
          placeholder="/example"
          value={endpoint}
          onChange={(e) => setEndpoint(e.target.value)}
        />
        <TextField
          label="Data"
          placeholder="{}"
          multiline
          rows={5}
          value={data}
          onChange={(e) => setData(e.target.value)}
        />
        <Button onClick={handleAddMock}>add</Button>
        <Button color="error" onClick={close}>
          cancel
        </Button>
      </Card>
    </Dialog>
  );
};
