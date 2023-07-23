
import React, { useState } from "react";
import {  Avatar, Button, Menu, MenuItem, Tooltip, Typography } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';


const LoginComponent: React.FC<{}> = (props) => {
    //this login state is example for auth user
    const [login, setLogin] = useState(true)
    const [anchorElUser, setAnchorElUser] = useState(false);

    const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

    const handleOpenUserMenu = () => {
        setAnchorElUser(!anchorElUser);
    };
    const handleCloseUserMenu = () => {
        setAnchorElUser(!anchorElUser);
    };

    return (
        <div>
            {
                login ?
                    <Button variant="outlined" onClick={() => setLogin(!login)}>Login</Button> :
                    (<div>
                        <Box onClick={handleOpenUserMenu} sx={{ flexGrow: 0, border: 1, borderColor: 'primary.main', cursor: 'pointer', padding: "5px", borderRadius: "10px" }}>
                            <span style={{ color: '#90caf9' }}>User </span>
                            <Tooltip title="Open settings">
                                <IconButton sx={{ p: 0 }}>
                                    <Avatar alt="Remy Sharp" sx={{ width: 34, height: 34 }} />
                                </IconButton>
                            </Tooltip>
                            <Menu
                                sx={{ mt: '55px' }}
                                id="menu-appbar"
                                // anchorEl={anchorElUser}
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
                                    <MenuItem key={setting} onClick={handleCloseUserMenu}>
                                        <Typography textAlign="center">{setting}</Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>
                    </div>)
            }
        </div>

    );
};

export default LoginComponent;
