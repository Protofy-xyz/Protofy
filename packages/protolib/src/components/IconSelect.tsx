import { useState } from 'react'
import Select from "react-select";

export const IconSelect = ({ icons, onSelect, selected }) => {
    const [selectedIcon, setSelectedIcon] = useState(
      selected ? { value: selected, label: selected } : null
    );
  
    const options = icons.map((icon) => ({
      value: icon,
      label: icon,
    }));
  
    return (
      <div style={{ flex: 1 }}>
        <Select
          options={options}
          components={{
            SingleValue: ({ data }) => (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "0px 4px",
                }}
              >
                <img
                  src={`/public/icons/${data.value}.svg`}
                  alt={data.value}
                  width={18}
                  height={18}
                  style={{
                    verticalAlign: "middle",
                    filter: "invert(50%) sepia(100%) hue-rotate(120deg)",
                  }}
                />
                <span style={{ color: "var(--color)" }}>{data.value}</span>
              </div>
            ),
          }}
          onChange={(selectedOption) => {
            setSelectedIcon(selectedOption);
            onSelect?.(selectedOption.value);
          }}
          value={selectedIcon}
          placeholder="Select an icon..."
          menuPlacement="auto"
          styles={{
            control: (provided, state) => ({
              ...provided,
              backgroundColor: "var(--color2)",  
              borderColor: "var(--color6)",
              height: "44px",
              borderRadius: "9px",
              boxShadow: state.isFocused ? "0 0 3px var(--color6)" : "none",
            }),
            singleValue: (provided) => ({
              ...provided,
              color: "var(--color)",
            }),
            valueContainer: (provided) => ({
              ...provided,
              display: "flex",
              alignItems: "center",
              padding: "2px 8px",
            }),
            menu: (provided) => ({
              ...provided,
              backgroundColor: "var(--color2)",  
              borderRadius: "9px",
              zIndex: 99999,
            }),
            menuList: (provided) => ({
              ...provided,
              backgroundColor: "var(--color2)",  
            }),
            option: (provided, state) => ({
              ...provided,
              backgroundColor: state.isSelected
                ? "var(--color6)"
                : state.isFocused
                ? "var(--color5)"
                : "var(--color2)",
              color: "var(--color)", 
              cursor: "pointer",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }),
            indicatorSeparator: (provided) => ({
              ...provided,
              backgroundColor: "var(--color7)",
            }),
            dropdownIndicator: (provided) => ({
              ...provided,
              color: "var(--color7)",
            }),
          }}
          maxMenuHeight={300}
        />
      </div>
    );
  };