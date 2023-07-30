import React, { useState } from 'react';
import {
  Avatar,
  Button,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import styles from './login-component.module.scss';

const LoginComponent: React.FC = () => {
  const [login, setLogin] = useState(true);
  const [anchorElUser, setAnchorElUser] = useState(false);

  const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

  const handleOpenUserMenu = () => {
    setAnchorElUser(!anchorElUser);
  };

  const handleCloseUserMenu = (setting: string) => {
    setAnchorElUser(!anchorElUser);
    if (setting === 'Logout') {
      setLogin(true);
    }
  };

  return (
    <div className={styles.login_component_container}>
      {login ? (
        <Button variant="outlined" onClick={() => setLogin(!login)}>
          Login
        </Button>
      ) : (
        <div>
          <div onClick={handleOpenUserMenu} className={styles.my_box}>
            <Tooltip title="Open settings">
              <IconButton sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" sx={{ width: 34, height: 34 }} />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '55px' }}
              id="menu-appbar"
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
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
      )}
    </div>
  );
};

export default LoginComponent;

// sx={{
//     flexGrow: 0,
//     border: 1,
//     borderColor: "primary.main",
//     cursor: "pointer",
//     padding: "5px",
//     borderRadius: "10px",
//   }}
