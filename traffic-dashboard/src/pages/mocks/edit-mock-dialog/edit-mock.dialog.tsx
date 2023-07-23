import {
  Button,
  Card,
  CircularProgress,
  Dialog,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { editMock } from "../../../api/api";
import { Mock } from "../../../types/types";
import styles from "./edit-mock-dialog.module.scss";

type EditMockDialogProps = {
  open: boolean;
  close: () => void;
  mock: Omit<Mock, "active"> & { port: number };
};

type FormType = {
  port: number;
  method: string;
  endpoint: string;
  status: number;
  data: unknown;
};

export const EditMockDialog: React.FC<EditMockDialogProps> = (props) => {
  const { close, open, mock } = props;

  const [form, setForm] = useState<FormType>({ ...mock });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { data, port, status, endpoint, method } = form;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEditMock = () => {
    if (!port) return;
    editMock(mock.id, port, method, endpoint, status, data)
      .then(() => {
        close();
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (mock) setForm(mock);
  }, [mock]);

  return (
    <Dialog open={open} onClose={close}  id="edit">
      <Card className={styles.card}>
        <Typography>Edit mock</Typography>
        <TextField
          label="Port"
          name="port"
          placeholder="1234"
          type="number"
          value={port}
          onChange={(e) => setForm({ ...form, port: +e.target.value })}
        />
        <TextField
          label="Method"
          name="method"
          placeholder="GET"
          value={method}
          onChange={handleChange}
        />
        <TextField
          label="Endpoint"
          name="endpoint"
          placeholder="/example"
          value={endpoint}
          onChange={handleChange}
        />
        <TextField
          label="Status"
          name="status"
          placeholder="1234"
          type="number"
          value={status}
          onChange={(e) => setForm({ ...form, port: +e.target.value })}
        />
        <TextField
          label="Data"
          name="data"
          placeholder="{}"
          multiline
          rows={5}
          value={data}
          onChange={handleChange}
        />

        <Button onClick={handleEditMock}>
          {isLoading === true ? <CircularProgress /> : <>Submit</>}
        </Button>
        <Button color="error" onClick={close}>
          cancel
        </Button>
      </Card>
    </Dialog>
  );
};
