import React from "react";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";

type SearchBarProps = {
  handleSearch: (value: string) => void;
};

export const SearchBar: React.FC<SearchBarProps> = ({ handleSearch }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    handleSearch(value);
  };
  return (
    <TextField
      className="h-10"
      label="Search..."
      variant="outlined"
      size="small"
      fullWidth
      onChange={handleChange}
      InputProps={{
        startAdornment: <SearchIcon style={{ color: "gray" }} />,
      }}
    />
  );
};
