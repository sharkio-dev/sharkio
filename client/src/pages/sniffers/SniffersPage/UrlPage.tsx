import React from "react";
import { SnifferType } from "../../../stores/sniffersStores";
import { InputAdornment, TextField, Tooltip } from "@mui/material";
import {
  AiOutlineBank,
  AiOutlineCopy,
  AiOutlineDatabase,
} from "react-icons/ai";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";

interface UrlPageProps {
  sniffer: SnifferType;
}

const UrlPage: React.FC<UrlPageProps> = ({ sniffer }) => {
  return (
    <div className="flex flex-col w-full items-center space-y-4 justify-center ">
      <List
        className="items-center flex flex-col space-y-4  bg-primary "
        sx={{
          width: "100%",
          maxWidth: "50%",
          borderRadius: "20px",
        }}
      >
        <div className="flex justify-start"></div>
        <ListItem>
          <ListItemAvatar>
            <Avatar sx={{ bgcolor: "#3b82f6" }}>
              <AiOutlineDatabase style={{ color: "#f0fdf4" }} />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={
              <div className="flex items-center space-x-2">
                <TextField
                  style={{ flexGrow: 1 }}
                  label="Sniffer's Domain:"
                  variant="outlined"
                  color="warning"
                  disabled
                  value={sniffer.subdomain}
                  focused
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Tooltip
                          title="Copy Sniffer Domain to clipboard"
                          arrow
                          placement="top"
                        >
                          <div>
                            <AiOutlineCopy
                              className="cursor-pointer text-2xl ml-1"
                              onClick={() =>
                                navigator.clipboard.writeText(sniffer.subdomain)
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
        <ListItem>
          <ListItemAvatar>
            <Avatar sx={{ bgcolor: "#3b82f6" }}>
              <AiOutlineBank style={{ color: "#f0fdf4" }} />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={
              <div className="flex items-center space-x-2">
                <TextField
                  style={{ flexGrow: 1 }}
                  label="Server's Domain:"
                  disabled
                  value={sniffer.downstreamUrl}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Tooltip
                          title="Copy Server Domain to clipboard"
                          arrow
                          placement="top"
                        >
                          <div>
                            <AiOutlineCopy
                              className="cursor-pointer text-2xl"
                              onClick={() =>
                                navigator.clipboard.writeText(
                                  sniffer.downstreamUrl,
                                )
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
      </List>
    </div>
  );
};

export default UrlPage;
