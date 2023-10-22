import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Delete, Edit } from "@mui/icons-material";
import { ConfigButton } from "../../components/config-card/ConfigButton";
import { Key } from "./api-keys";

type KeysTableProps = {
  keys: Key[];
  invokeKey: (id: string) => void;
  onEditKey: (id: string) => void;
};
export const KeysTable = ({ keys, invokeKey, onEditKey }: KeysTableProps) => {
  return (
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
                    onClick={() => invokeKey(row.id)}
                  >
                    <Delete color="error" fontSize="small" />
                  </ConfigButton>
                  <ConfigButton
                    tooltip={"Edit the API key"}
                    onClick={() => onEditKey(row.id)}
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
  );
};
