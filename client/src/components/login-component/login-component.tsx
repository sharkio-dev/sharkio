import {
  Avatar,
  CircularProgress,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { supabaseClient } from "../../utils/supabase-auth";
import styles from "./login-component.module.scss";

const LoginComponent: React.FC = () => {
  const [anchorElUser, setAnchorElUser] = useState(false);
  const { user, signOut } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const settings = user != null ? ["Logout", "API keys"] : ["Login", "Signup"];
  const navigate = useNavigate();

  const handleOpenUserMenu = () => {
    setAnchorElUser(!anchorElUser);
  };

  const handleCloseUserMenu = (setting: string) => {
    setLoading(true);
    setAnchorElUser(!anchorElUser);

    switch (setting) {
      case "API keys": {
        setLoading(false);
        navigate("/api-keys");
        break;
      }
      case "Logout": {
        supabaseClient.auth.signOut().then(() => {
          setLoading(false);
          signOut();
          navigate("/");
        });
        break;
      }
      case "Login": {
        setLoading(false);
        navigate("/login");
        break;
      }
      case "Signup": {
        setLoading(false);
        navigate("/signup");
        break;
      }
      default: {
        setLoading(false);
      }
    }
  };

  return (
    <div className={styles.login_component_container}>
      <div>
        <div onClick={handleOpenUserMenu} className={styles.my_box}>
          <Tooltip title="Open settings">
            {loading ? (
              <CircularProgress />
            ) : (
              <IconButton sx={{ p: 0 }}>
                {user ? (
                  <Avatar
                    src={user.profileImg}
                    sx={{ width: 34, height: 34 }}
                  />
                ) : (
                  <Avatar alt="Remy Sharp" sx={{ width: 34, height: 34 }} />
                )}
              </IconButton>
            )}
          </Tooltip>
          <Menu
            sx={{ mt: "55px" }}
            id="menu-appbar"
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            {settings.map((setting) => (
              <MenuItem
                key={setting}
                onClick={() => handleCloseUserMenu(setting)}
              >
                <Typography textAlign="center">{setting}</Typography>
              </MenuItem>
            ))}
          </Menu>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;
