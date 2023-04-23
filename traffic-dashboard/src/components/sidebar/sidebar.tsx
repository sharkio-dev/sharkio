import { List, ListItem, ListItemButton, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface ISideBarProps {
  className: string;
}

export const SideBar: React.FC<ISideBarProps> = ({ className }) => {
  const navigate = useNavigate();

  return (
    <Paper className={className}>
      <List>
        <ListItemButton
          onClick={() => {
            navigate("/home");
          }}
        >
          Home
        </ListItemButton>
        <ListItemButton
          onClick={() => {
            navigate("/new-request");
          }}
        >
          New request
        </ListItemButton>
      </List>
    </Paper>
  );
};
