import {
  Button,
  Card,
  CircularProgress,
  Dialog,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { editMock } from "../../../api/api";
import { Mock } from "../../../types/types";
import styles from "./edit-mock-dialog.module.scss";

type EditMockDialogProps = {
  open: boolean;
  close: () => void;
  mock: Omit<Mock, "active"> & { port: number };
  onDataChange: (data: Omit<Mock, "active"> & { port: number }) => void;
};

export const EditMockDialog: React.FC<EditMockDialogProps> = (props) => {
  const { close, open, mock, onDataChange } = props;

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onDataChange({ ...mock, [e.target.name]: e.target.value });
  };

  const handleEditMock = () => {
    if (!mock.port) return;
    editMock(
      mock.id,
      mock.port,
      mock.method,
      mock.endpoint,
      mock.status,
      mock.data,
    )
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

  return (
    <Dialog open={open} onClose={close} id="edit">
      <Card className={styles.card}>
        <Typography>Edit mock</Typography>
        <TextField
          label="Port"
          name="port"
          placeholder="1234"
          type="number"
          value={mock?.port}
          onChange={(e) => onDataChange({ ...mock, port: +e.target.value })}
        />
        <TextField
          label="Method"
          name="method"
          placeholder="GET"
          value={mock?.method}
          onChange={handleChange}
        />
        <TextField
          label="Endpoint"
          name="endpoint"
          placeholder="/example"
          value={mock?.endpoint}
          onChange={handleChange}
        />
        <TextField
          label="Status"
          name="status"
          placeholder="1234"
          type="number"
          value={mock?.status}
          onChange={(e) => onDataChange({ ...mock, port: +e.target.value })}
        />
        <TextField
          label="Data"
          name="data"
          placeholder="{}"
          multiline
          rows={5}
          value={mock?.data}
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
