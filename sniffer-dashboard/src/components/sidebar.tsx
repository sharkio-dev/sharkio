import {
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
} from "@mui/material";
import styles from "./sidebar.module.css";

export const SideBar = () => {
  return (
    <Paper className={styles.sideBarPaper}>
      <List>
        <ListItem disablePadding>
          <ListItemButton>
            <Link href="/requests">
              <ListItemText primary={"Requests"} sx={{ textAlign: "center" }} />
            </Link>
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton>
            <Link href="/requests/new">
              <ListItemText primary={"New Request"} sx={{ textAlign: "center" }} />
            </Link>
          </ListItemButton>
        </ListItem>
      </List>
    </Paper>
  );
};
