import "./DashboardStats.css";
import StatCard from "./StatCard";

const DashboardStats = () => {
  return (
    <section className="dashboard-stats">

      <div className="section-title">
        <span className="title-line"></span>
        <h2>Dashboard</h2>
      </div>

      <div className="stats-grid">

        <StatCard
          title="Verified Students"
          value="1,248"
          footer="▲ 6.2% wk"
          footerColor="#16A34A"
        />

        <StatCard
          title="Pending Verifications"
          value="12"
          footer="Students"
          footerColor="#2563EB"
        />

        <StatCard
          title="Active Escrow"
          value="15"
          footer="₦4.7K held"
          footerColor="#374151"
        />

        <StatCard
          title="Pending Tasks"
          value="8"
          footer="12 New Today"
          footerColor="#F59E0B"
        />

        <StatCard
          title="Pending Reviews"
          value="6"
          footer="Tasks"
          footerColor="#6B7280"
        />

      </div>

    </section>
  );
};

export default DashboardStats;