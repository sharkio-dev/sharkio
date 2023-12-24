import React, { useEffect, useState } from "react";
import { MenuItem, Autocomplete, TextField } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { allStatusCodes } from "./StatusCodeData";
import { useNavigate, useSearchParams } from "react-router-dom";

type StatusCode = {
  value: string;
  label: string;
};

export const MultiAutocomplete = () => {
  const [selectedStatusCodes, setSelectedStatusCodes] = useState<StatusCode[]>(
    []
  );
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const savedStatusCodes = searchParams.get("statusCodes")?.split(",") || [];
    const selectedCodes = allStatusCodes.filter((code) =>
      savedStatusCodes.includes(code.value)
    );
    setSelectedStatusCodes(selectedCodes);
  }, []);

  useEffect(() => {
    const statusCodeValues = selectedStatusCodes.map((code) => code.value);

    setSearchParams((prevParams) => {
      const newSearchParams = new URLSearchParams(prevParams);
      newSearchParams.set("statusCodes", statusCodeValues.join(","));
      return newSearchParams;
    });
  }, [selectedStatusCodes]);

  const handleStatusCodesChange = (selectedOptions: StatusCode[]) => {
    setSelectedStatusCodes(selectedOptions);
  };

  return (
    <Autocomplete
      multiple
      size="small"
      id="tags-standard"
      options={allStatusCodes}
      getOptionLabel={(status) => status.value}
      onChange={(_, selectedCodes: StatusCode[]) =>
        handleStatusCodesChange(selectedCodes)
      }
      value={selectedStatusCodes}
      renderOption={(props, method, { selected }) => (
        <MenuItem
          key={method.value}
          value={method.value}
          sx={{ justifyContent: "space-between" }}
          {...props}
        >
          {method.label}
          {selected ? <CheckIcon color="info" /> : null}
        </MenuItem>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          label="Status Codes"
          placeholder="Select status code"
        />
      )}
    />
  );
};

// const MultiSelect = () => {
//     const [selectedNames, setSelectedNames] = useState([]);
//     return (
//       <FormControl sx={{ m: 1, width: 500 }}>
//         <InputLabel>Multiple Select</InputLabel>
//         <Select
//           multiple
//           value={selectedNames}
//           onChange={(e) => setSelectedNames(e.target.value)}
//           input={<OutlinedInput label="Multiple Select" />}
//           renderValue={(selected) => (
//             <Stack gap={1} direction="row" flexWrap="wrap">
//               {selected.map((value) => (
//                 <Chip
//                   key={value}
//                   label={value}
//                   onDelete={() =>
//                     setSelectedNames(
//                       selectedNames.filter((item) => item !== value)
//                     )
//                   }
//                   deleteIcon={
//                     <CancelOutlined
//                       onMouseDown={(event) => event.stopPropagation()}
//                     />
//                   }
//                 />
//               ))}
//             </Stack>
//           )}
//         >
//           {names.map((name) => (
//             <MenuItem
//               key={name}
//               value={name}
//               sx={{ justifyContent: "space-between" }}
//             >
//               {name}
//               {selectedNames.includes(name) ? <CheckIcon color="info" /> : null}
//             </MenuItem>
//           ))}
//         </Select>
//       </FormControl>
//     );
//   };
