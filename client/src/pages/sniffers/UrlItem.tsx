import { AiOutlineCopy } from "react-icons/ai";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import { InputAdornment, Tooltip } from "@mui/material";
import { useSnackbar } from "../../hooks/useSnackbar";

interface UrlItemProps {
  SnifferURL: string;
  Icon: any;
  Label: string;
  Title: string;
}
const UrlItem: React.FC<UrlItemProps> = ({
  SnifferURL,
  Icon,
  Label,
  Title,
}) => {
  const { show: showSnackbar, component: snackBar } = useSnackbar();
  return (
    <ListItem>
      {snackBar}
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: "#3b82f6" }}>
          <Icon style={{ color: "#f0fdf4" }} />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={
          <div className="flex items-center space-x-2">
            <TextField
              style={{ flexGrow: 1 }}
              label={Label}
              variant="outlined"
              color="warning"
              size="small"
              disabled
              value={SnifferURL}
              focused
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Tooltip title={Title} arrow placement="top">
                      <div>
                        <AiOutlineCopy
                          className="cursor-pointer text-2xl ml-1 active:contrast-50 hover:scale-110"
                          onClick={() =>
                            navigator.clipboard
                              .writeText(SnifferURL)
                              .then(() => {
                                showSnackbar("Copied to clipboard", "success");
                              })
                          }
                        />
                      </div>
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
            />
          </div>
        }
      />
    </ListItem>
  );
};

export default UrlItem;
