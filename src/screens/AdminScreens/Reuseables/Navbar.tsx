import "./Navbar.css";
import logo from "../assets/images/logo_mark.png";

const Navbar = () => {
  return (
    <header className="navbar">

      <img
        src={logo}
        alt="SkillBridge"
        className="logo"
      />

    </header>
  );
};

export default Navbar;