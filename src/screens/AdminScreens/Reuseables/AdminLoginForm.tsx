import "./AdminLoginForm.css";

import {
  FiMail,
  FiLock,
  FiEye,
} from "react-icons/fi";

import AdminInputField from "./AdminInputField";

const AdminLoginForm = () => {
  return (
    <section className="login-form">

      <h1>Admin Console</h1>

      <p className="subtitle">
        Sign in to manage the marketplace
      </p>

      <AdminInputField
        icon={<FiMail />}
        placeholder="Admin Email"
      />

      <AdminInputField
        icon={<FiLock />}
        placeholder="Admin Password"
        type="password"
        rightIcon={<FiEye />}
      />

      <p className="warning">
        Authorized administrators only · Access is logged
      </p>

      <div className="remember">

        <input
          type="checkbox"
          id="remember"
            className="checkbox"
        />

        <label htmlFor="remember">
          Remember me
        </label>

      </div>

    </section>
  );
};

export default AdminLoginForm;