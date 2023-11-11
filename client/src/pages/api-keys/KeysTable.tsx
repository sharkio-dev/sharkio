import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Delete, Edit } from "@mui/icons-material";
import { ConfigButton } from "../../components/config-card/ConfigButton";
import { Key } from "./api-keys";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";

type KeysTableProps = {
  keys: Key[];
  invokeKey: (id: string) => void;
  onEditKey: (id: string) => void;
};
export const KeysTable = ({ keys, invokeKey, onEditKey }: KeysTableProps) => {
  return (
    <TableContainer sx={{ width: "75%", alignSelf: "center" }}>
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
                  <AiOutlineDelete
                    className=" text-red-400 active:scale-110 text-lg cursor-pointer ml-4 hover:bg-border-color rounded-md"
                    onClick={() => invokeKey(row.id)}
                  />
                  <AiOutlineEdit
                    className=" text-amber-400 active:scale-110 text-lg cursor-pointer hover:bg-border-color rounded-md"
                    onClick={() => onEditKey(row.id)}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
