import React, { useState } from "react";

function DropdownItem({ icon, label, onClick, isSelected }) {
  return (
    <div
      onClick={onClick}
      className={`dropdown-item ${isSelected ? "selected" : ""}`}
      style={{
        padding: "8px 12px",
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
        borderRadius: "4px",
        backgroundColor: isSelected ? "#333" : "transparent", // Adjust color as needed
        color: "white", // Adjust color as needed
        "&:hover": {
          backgroundColor: "#444", // Adjust color as needed
        },
      }}
    >
      {icon && <span style={{ marginRight: "8px" }}>{icon}</span>}
      <span>{label}</span>
      {isSelected && <span style={{ marginLeft: "auto" }}>✓</span>}
    </div>
  );
}

function MyDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("General");

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleItemClick = (value) => {
    setSelectedValue(value);
    setIsOpen(false);
  };

  const dropdownOptions = [
    { label: "General", icon: "ⓘ" },
    { label: "Issue", icon: "📖" },
    { label: "Bug", icon: "🐛" },
    { label: "Incident", icon: "⚠" },
  ];

  return (
    <div style={{ width: "200px", fontFamily: "sans-serif", color: "white" }}>
      {" "}
      {/* adjust width and other styles as needed */}
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "8px 0",
          }}
        >
          <span>Type</span>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span>{selectedValue}</span>
            <span style={{ cursor: "pointer", marginLeft: "8px" }} onClick={toggleDropdown}>
              {isOpen ? "∧" : "∨"} {/* Dropdown arrow */}
            </span>
          </div>
        </div>
        {isOpen && (
          <div
            style={{
              position: "absolute",
              background: "#222", // Dark background
              border: "1px solid #555", // subtle border
              borderRadius: "4px",
              marginTop: "4px",
              zIndex: 1, // Make sure it shows on top of other elements
              width: "100%",
            }}
          >
            {dropdownOptions.map((option) => (
              <DropdownItem key={option.label} label={option.label} icon={option.icon} onClick={() => handleItemClick(option.label)} isSelected={selectedValue === option.label} />
            ))}
          </div>
        )}
      </div>
      <div style={{ padding: "8px 0" }}>
        <span>Status</span>
      </div>
      <div style={{ padding: "8px 0" }}>
        <span>Priority</span>
      </div>
    </div>
  );
}

export default MyDropdown;
