import { FC, ChangeEventHandler } from "react";

interface CheckboxSwitchProps {
  name: string;
  onChange: ChangeEventHandler;
  checked: boolean;
}

export const CheckboxSwitch: FC<CheckboxSwitchProps> = ({
  name,
  onChange,
  checked,
}) => {
  return (
    <div className="checkbox-container">
      <input
        type="checkbox"
        name={name}
        id={name}
        defaultChecked={checked}
        onChange={onChange}
      />
      <span className="checkbox-control"></span>
    </div>
  );
};
