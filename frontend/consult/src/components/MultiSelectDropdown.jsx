// src/components/MultiSelectDropdown.jsx
import { useState } from "react";

function MultiSelectDropdown({ value = [], options, label, onChange }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="multi-select-container">
      <div 
        className="multi-select-display"
        onClick={() => setIsOpen(!isOpen)}
      >
        {value.length === 0 ? (
          <span className="placeholder">Select {label}</span>
        ) : (
          <span>{value.join(", ")}</span>
        )}
        <span className="dropdown-arrow">{isOpen ? "▲" : "▼"}</span>
      </div>
      
      {isOpen && (
        <div className="multi-select-options">
          {options?.map((opt) => (
            <label key={opt} className="multi-select-option">
              <input
                type="checkbox"
                checked={value.includes(opt)}
                onChange={(e) => {
                  if (e.target.checked) {
                    onChange([...value, opt]);
                  } else {
                    onChange(value.filter(v => v !== opt));
                  }
                }}
              />
              {opt}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

export default MultiSelectDropdown;