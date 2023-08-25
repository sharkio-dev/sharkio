import { Avatar, Menu, MenuItem, Tooltip, Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import React, { useEffect, useState } from "react";
import styles from "./login-component.module.scss";
import { supabaseClient } from "../../utils/supabase-auth";
import { useAuthStore } from "../../stores/authStore";

const LoginComponent: React.FC = () => {
  const [anchorElUser, setAnchorElUser] = useState(false);
  const { user, signOut } = useAuthStore();
  const settings = ["Logout"];

  const handleOpenUserMenu = () => {
    setAnchorElUser(!anchorElUser);
  };

  const handleCloseUserMenu = async (setting: string) => {
    setAnchorElUser(!anchorElUser);
    if (setting === "Logout") {
      const { error } = await supabaseClient.auth.signOut();
      signOut();
    }
  };

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabaseClient.auth.getUser();
    })();
  }, []);

  return (
    <div className={styles.login_component_container}>
      <div>
        <div onClick={handleOpenUserMenu} className={styles.my_box}>
          <Tooltip title="Open settings">
            <IconButton sx={{ p: 0 }}>
              {user ? (
                <Avatar src={user.profileImg} sx={{ width: 34, height: 34 }} />
              ) : (
                <Avatar alt="Remy Sharp" sx={{ width: 34, height: 34 }} />
              )}
            </IconButton>
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
