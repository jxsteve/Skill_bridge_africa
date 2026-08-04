import "./InputField.css";

interface InputFieldProps {
  icon: React.ReactNode;
  placeholder: string;
  type?: string;
  rightIcon?: React.ReactNode;
}

const InputField = ({
  icon,
  placeholder,
  type = "text",
  rightIcon,
}: InputFieldProps) => {
  return (
    <div className="input-container">
      <div className="left-icon">{icon}</div>

      <input
        type={type}
        placeholder={placeholder}
      />

      {rightIcon && <div className="right-icon">{rightIcon}</div>}
    </div>
  );
};

export default InputField;