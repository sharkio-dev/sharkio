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
};

export function SelectComponent({
  options,
  title,
  value,
  setValue,
  disabled,
  className,
  inputClassName,
}: SelectComponentProps) {
  return (
    <div className={className}>
      <FormControl size="small" disabled={disabled}>
        {title && <InputLabel>{title}</InputLabel>}
        <Select
          value={value}
          label={title}
          className={inputClassName}
          onChange={(event) => setValue && setValue(event.target.value)}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
