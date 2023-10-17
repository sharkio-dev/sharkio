import { Button } from "@mui/material";
import React, { useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Delete, Edit } from "@mui/icons-material";
import { ConfigButton } from "../../components/config-card/ConfigButton";

function APIKeys() {
  const [keys, setKeys] = React.useState([
    { name: "test", key: "test" },
    { name: "test2", key: "test2" },
  ]);

  useEffect(() => {
    // TODO: fetch API keys
  }, []);

  const generateKey = () => {};

  const deleteKey = () => {};

  const editKey = () => {};

  const onClickEdit = () => {};

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex flex-row justify-between items-center">
        <div className="text-2xl font-bold">API Keys</div>
        <Button variant="contained" color="primary" onClick={generateKey}>
          Generate API Key
        </Button>
      </div>
      <div className="w-full border-b-[0.05px] my-4" />
      {keys.length > 0 && (
        <div className="text whitespace-pre-line mb-8">
          {
            "Below, you'll find your confidential API keys.\nPlease be aware that once generated, we won't display your secret API keys again."
          }
        </div>
      )}
      {/* {keys.length === 0 && (
        <div className="text-lg">
          There are no API keys associated with your account.
        </div>
      )} */}
      <TableContainer
        sx={{ width: "75%", alignSelf: "center" }}
        className="s:w-3/4"
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                align="left"
                style={{ fontWeight: "bold" }}
                sx={{ color: "GrayText" }}
              >
                Name
              </TableCell>
              <TableCell
                align="left"
                style={{ fontWeight: "bold" }}
                sx={{ color: "GrayText" }}
              >
                Key
              </TableCell>
              <TableCell align="left"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {keys.map((row) => (
              <TableRow key={row.name}>
                <TableCell align="left">{row.name}</TableCell>
                <TableCell align="left">{row.key}</TableCell>
                <TableCell align="left">
                  <div className="flex flex-row-reverse w-full ">
                    <ConfigButton
                      tooltip={"Delete the API key"}
                      onClick={deleteKey}
                    >
                      <Delete color="error" fontSize="small" />
                    </ConfigButton>
                    <ConfigButton
                      tooltip={"Edit the API key"}
                      onClick={editKey}
                      className="mr-2"
                    >
                      <Edit color="info" fontSize="small" />
                    </ConfigButton>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default APIKeys;
