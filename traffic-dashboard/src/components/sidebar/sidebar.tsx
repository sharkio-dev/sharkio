import {
  Button,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  Paper,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import DataObjectIcon from "@mui/icons-material/DataObject";
import { ChevronLeft, ChevronRight, Home } from "@mui/icons-material";
import SettingsInputComponentIcon from "@mui/icons-material/SettingsInputComponent";
import { Navbar } from "../navbar/navbar";
import { useState } from "react";
import styles from "./sidebar.module.scss";

interface ISideBarProps {
  className: string;
}

export const SideBar: React.FC<ISideBarProps> = ({ className }) => {
  const navigate = useNavigate();
  const [minimized, setMinimized] = useState(false);

  const handleMenuIconClicked = () => {
    setMinimized((prev) => !prev);
  };

  return (
    <div className={styles.sidebarContainer} data-is-minimized={minimized}>
      <Paper className={styles.paper} elevation={8}>
        <div className={styles.toggleMenu} onClick={handleMenuIconClicked}>
          <IconButton>
            {minimized ? <ChevronRight /> : <ChevronLeft />}
          </IconButton>
        </div>
        <List>
          <ListItem>
            <Typography>Menu</Typography>
          </ListItem>
          <ListItemButton
            alignItems="center"
            onClick={() => {
              navigate("/home");
            }}
            className={styles.listItem}
          >
            <Home />
            {!minimized && <>Home</>}
          </ListItemButton>
          <ListItemButton
            alignItems="center"
            className={styles.listItem}
            onClick={() => {
              navigate("/config");
            }}
          >
            <SettingsInputComponentIcon />
            {!minimized && <>Config</>}
          </ListItemButton>
          <ListItemButton
            alignItems="center"
            className={styles.listItem}
            onClick={() => {
              navigate("/mocks");
            }}
          >
            <DataObjectIcon />
            {!minimized && <>Mocks</>}
          </ListItemButton>
        </List>
      </Paper>
    </div>
  );
};
