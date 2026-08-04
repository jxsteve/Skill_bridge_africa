import { useState } from "react";
import "./AdminInputField.css";
import { FiEye, FiEyeOff } from "react-icons/fi";

interface AdminInputFieldProps {
  icon: React.ReactNode;
  placeholder: string;
  type?: string;
   rightIcon?: React.ReactNode;
}

const AdminInputField = ({
  icon,
  placeholder,
  type = "text",
   rightIcon,
}: AdminInputFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const inputType =
    type === "password"
      ? showPassword
        ? "text"
        : "password"
      : type;

  return (
    <div className="input-field">

      <div className="left-icon">
        {icon}
      </div>

      <input
        type={inputType}
        placeholder={placeholder}
      />
      

      {type === "password" && (
        <button
          type="button"
          className="eye-btn"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <FiEyeOff /> : <FiEye />}
        </button>
      )}
      {rightIcon && (
  <div className="right-icon">
    {rightIcon}
  </div>
)}

    </div>
  );
};

export default AdminInputField;