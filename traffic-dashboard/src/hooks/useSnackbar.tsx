import { Snackbar, Alert, AlertColor } from "@mui/material";
import { useState } from "react";

type useSnackbarType = () => {
  component: any;
  show: (content: string, severity: AlertColor) => void;
  hide: () => void;
};

export const useSnackbar: useSnackbarType = () => {
  const [open, setOpen] = useState<boolean>();
  const [content, setContent] = useState<string>();
  const [severity, setSeverity] = useState<AlertColor>();

  const component = (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={() => setOpen(false)}
      anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
    >
      <Alert onClose={() => setOpen(false)} severity={severity}>
        {content}
      </Alert>
    </Snackbar>
  );

  return {
    component,
    show: (content: string, severity: AlertColor) => {
      setOpen(true);
      setContent(content);
      setSeverity(severity);
    },
    hide: () => setOpen(false),
  };
};
