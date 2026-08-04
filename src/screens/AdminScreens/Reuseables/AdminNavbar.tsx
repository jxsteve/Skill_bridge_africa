import "./AdminNavbar.css";
import logo from "../assets/images/logo_mark.png";
import profile from "../assets/images/Testimonials.png";

import { FiBell } from "react-icons/fi";

const AdminNavbar = () => {
  return (
    <header className="navbar">

      <img
        src={logo}
        alt="SkillBridge Africa"
        className="logo"
      />

      <div className="navbar-right">

        <button className="notification-btn">
          <FiBell />
          <span className="notification-dot"></span>
        </button>

        <div className="profile-wrapper">

          <img
            src={profile}
            alt="Profile"
            className="profile-image"
          />

          <span className="online-dot"></span>

        </div>

      </div>

    </header>
  );
};

export default AdminNavbar;