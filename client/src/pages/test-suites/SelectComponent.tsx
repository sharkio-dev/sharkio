import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

type SelectComponentProps = {
  options: { value: string; label: string }[];
  title: string;
  value: string;
  setValue: (value: string) => void;
  disabled?: boolean;
};

export function SelectComponent({
  options,
  title,
  value,
  setValue,
  disabled,
}: SelectComponentProps) {
  return (
    <FormControl  sx={{ width: "100%" }} size="small" disabled={disabled}>
      <InputLabel>{title}</InputLabel>
      <Select
        value={value}
        label={title}
        onChange={(event) => setValue(event.target.value)}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
