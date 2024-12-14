import React from "react";
import Select from "react-select";
import { FaBeer, FaCoffee, FaApple } from 'react-icons/fa';

// Define the available icons
const iconOptions = [
  { label: "Beer", value: "FaBeer", Icon: FaBeer },
  { label: "Coffee", value: "FaCoffee", Icon: FaCoffee },
  { label: "Apple", value: "FaApple", Icon: FaApple },
];

interface IconPickerProps {
  value: string;
  onChange: (value: string) => void;
}

const IconPicker: React.FC<IconPickerProps> = ({ value, onChange }) => {
  return (
    <Select
      options={iconOptions}
      value={iconOptions.find((option) => option.value === value)}
      onChange={(selectedOption) => onChange(selectedOption?.value || "")}
      formatOptionLabel={({ label, Icon }) => (
        <div className="flex items-center space-x-2">
          <Icon />
          <span>{label}</span>
        </div>
      )}
      styles={{
        control: (base) => ({
          ...base,
          backgroundColor: "#1e293b", // Dark background
          color: "#fff",
          borderColor: "#374151",
        }),
        singleValue: (base) => ({
          ...base,
          color: "#fff",
        }),
        menu: (base) => ({
          ...base,
          backgroundColor: "#1e293b", // Dropdown background
          color: "#fff",
        }),
        option: (base, state) => ({
          ...base,
          backgroundColor: state.isFocused ? "#374151" : "#1e293b",
          color: "#fff",
        }),
      }}
      placeholder="Select an icon..."
    />
  );
};

export default IconPicker;
