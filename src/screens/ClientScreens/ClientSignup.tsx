import "./ClientSignup.css";

import {
  FiUser,
  FiMail,
  FiPhone,
  FiLock,
  FiEye,
} from "react-icons/fi";

import InputField from "../../components/ui/InputField";

const ClientSignup = () => {
  return (
    <div className="register-page">
      <div className="register-card">

        <h1>Client Registration</h1>

        <p className="subtitle">
          Create your account to get verified
        </p>

        <div className="form">

          <InputField
            icon={<FiUser />}
            placeholder="Business / Full Name"
          />

          <InputField
            icon={<FiMail />}
            placeholder="Email Address"
          />

          <InputField
            icon={<FiPhone />}
            placeholder="Phone Number"
          />

          <InputField
            icon={<FiLock />}
            placeholder="Password"
            type="password"
            rightIcon={<FiEye />}
          />

          <InputField
            icon={<FiLock />}
            placeholder="Confirm Password"
            type="password"
            rightIcon={<FiEye />}
          />

          <div className="terms">

            <input type="checkbox" />

            <span>
              I agree to the{" "}
              <a href="/">
                Terms & Privacy Policy
              </a>
            </span>

          </div>

          <button className="register-btn">
            Create Account
          </button>

          <p className="login">
            Already have an account?
            <a href="/"> Login</a>
          </p>

        </div>

      </div>
    </div>
  );
};

export default ClientSignup;