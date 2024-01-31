import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

type SelectComponentProps = {
  options: { value: string; label: string }[];
  value: string;
  title?: string;
  className?: string;
  inputClassName?: string;
  setValue?: (value: string) => void;
  disabled?: boolean;
  variant?: "standard" | "outlined" | "filled";
};

export function SelectComponent({
  options,
  title,
  value,
  setValue,
  disabled,
  inputClassName,
  variant = "outlined",
}: SelectComponentProps) {
  return (
    <FormControl
      size="small"
      disabled={disabled}
      className="w-full"
      variant={variant}
    >
      {title && <InputLabel>{title}</InputLabel>}
      <Select
        value={value}
        label={title}
        className={`w-full ${inputClassName}`}
        onChange={(event) => setValue && setValue(event.target.value)}
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
