import { List, ListItem, ListItemButton, Paper } from "@mui/material";

interface ISideBarProps {
  className: string;
}

export const SideBar: React.FC<ISideBarProps> = ({ className }) => {
  return (
    <Paper className={className}>
      <List>
        <ListItemButton>Home</ListItemButton>
      </List>
    </Paper>
  );
};
