import "./AdminBottomNavigation.css";

import {
  FiHome,
  FiStar,
  FiCreditCard,
  FiUserCheck,
} from "react-icons/fi";

const AdminBottomNavigation = () => {
  return (
    <nav className="bottom-nav">

      <button className="nav-item active">
        <FiHome />
        <span>Home</span>
      </button>

      <button className="nav-item">
        <FiStar />
        <span>Reviews</span>
      </button>

      <button className="nav-item">
        <FiCreditCard />
        <span>Escrow</span>
      </button>

      <button className="nav-item">
        <FiUserCheck />
        <span>Verify</span>
      </button>

    </nav>
  );
};

export default AdminBottomNavigation;