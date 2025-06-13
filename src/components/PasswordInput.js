import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const PasswordInput = ({ value, onChange, placeholder = "", name }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <input
        type={showPassword ? "text" : "password"}
        value={value}
        name={name}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          width: "87%",
          padding: "0.75rem 2.5rem 0.75rem 1rem",
          fontSize: "1rem",
          borderRadius: "8px",
          border: "1px solid #ccc"
        }}
      />
      <div
        onClick={() => setShowPassword(prev => !prev)}
        style={{
          position: "absolute",
          top: "50%",
          right: "1rem",
          transform: "translateY(-50%)",
          cursor: "pointer",
          color: "#888"
        }}
      >
        {showPassword ? <FaEyeSlash /> : <FaEye />}
      </div>
    </div>
  );
};

export default PasswordInput;
