import "./StatCard.css";

interface StatCardProps {
  title: string;
  value: string;
  footer: string;
  footerColor?: string;
}

const StatCard = ({
  title,
  value,
  footer,
  footerColor = "#6B7280",
}: StatCardProps) => {
  return (
    <div className="stat-card">
      <h4>{title}</h4>

      <h2>{value}</h2>

      <p style={{ color: footerColor }}>
        {footer}
      </p>
    </div>
  );
};

export default StatCard;