import { SelectComponent } from "../../components/select-component/SelectComponent";

type SelectMethodDropDownProps = {
  value: string;
  onChange: (value: any) => void;
  disabled?: boolean;
};
export const SelectMethodDropDown = ({
  value,
  disabled,
  onChange,
}: SelectMethodDropDownProps) => {
  return (
    <SelectComponent
      disabled={disabled}
      inputClassName="min-w-[10ch]"
      options={[
        { value: "GET", label: "GET" },
        { value: "POST", label: "POST" },
        { value: "PUT", label: "PUT" },
        { value: "PATCH", label: "PATCH" },
        { value: "DELETE", label: "DELETE" },
      ]}
      value={value.toUpperCase()}
      setValue={(value) => {
        onChange(value);
      }}
    />
  );
};
