import { SelectComponent } from "../test-suites/SelectComponent";

type SelectMethodDropDownProps = {
  value: string;
  onChange: (value: any) => void;
  title?: string;
  disabled?: boolean;
};
export const SelectMethodDropDown = ({
  value,
  disabled,
  onChange,
  title = "Method",
}: SelectMethodDropDownProps) => {
  return (
    <SelectComponent
      disabled={disabled}
      options={[
        { value: "GET", label: "GET" },
        { value: "POST", label: "POST" },
        { value: "PUT", label: "PUT" },
        { value: "PATCH", label: "PATCH" },
        { value: "DELETE", label: "DELETE" },
      ]}
      title={title}
      value={value}
      setValue={(value) => {
        onChange(value);
      }}
    />
  );
};
