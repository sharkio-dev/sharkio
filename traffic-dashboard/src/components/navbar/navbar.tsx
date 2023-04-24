import MenuIcon from "@mui/icons-material/Menu";
import { AppBar, IconButton, Toolbar } from "@mui/material";

interface INavbarProps {
  onBurgerClicked: () => void;
}

export const Navbar: React.FC<INavbarProps> = ({ onBurgerClicked }) => {
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          onClick={() => onBurgerClicked?.()}
        >
          <MenuIcon></MenuIcon>
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};
