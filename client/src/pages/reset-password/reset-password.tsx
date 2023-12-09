import {
  Button,
  IconButton,
  Input,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import { supabaseClient } from "../../utils/supabase-auth";
import { useSnackbar } from "../../hooks/useSnackbar";
import { BsEye } from "react-icons/bs";

export const RestPassword = () => {
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const { show, component: snackBar } = useSnackbar();

  const handleResetClick = () => {
    supabaseClient.auth
      .updateUser({
        password,
      })
      .then((res) => show("Password updated", "success"))
      .catch((res) => show("Password update failed", "error"));
  };

  useEffect(() => {
    supabaseClient.auth.getUser().then((res) => {
      setEmail(res.data.user?.email ?? "");
    });
  }, []);

  return (
    <div className="flex flex-col w-full justify-center items-center pt-20 gap-5">
      {snackBar}
      <Typography variant="h5">Reset password for: {email}</Typography>
      <div className="flex flex-row gap-2">
        <TextField
          variant="outlined"
          label="Password"
          type={showPassword ? "text" : "password"}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        ></TextField>
        <IconButton onClick={() => setShowPassword((prev: boolean) => !prev)}>
          <BsEye></BsEye>
        </IconButton>
      </div>
      <Button variant="contained" onClick={handleResetClick}>
        reset
      </Button>
    </div>
  );
};
