import "./QuickActions.css";

import {
  FiShield,
  FiClipboard,
  FiUsers,
} from "react-icons/fi";

import { HiOutlineDocumentSearch } from "react-icons/hi";

import QuickActionCard from "./QuickActionCard";

const QuickActions = () => {
  return (
    <section className="quick-actions">

      <div className="section-title">

        <span className="title-line"></span>

        <h2>Quick Actions</h2>

      </div>

      <div className="quick-grid">

        <QuickActionCard
          icon={<FiShield />}
          title="Verify Student"
        />

        <QuickActionCard
          icon={<FiClipboard />}
          title="Review Tasks"
        />

        <QuickActionCard
          icon={<FiUsers />}
          title="Assign Students"
        />

        <QuickActionCard
          icon={<HiOutlineDocumentSearch />}
          title="Review Submission"
        />

      </div>

    </section>
  );
};

export default QuickActions;