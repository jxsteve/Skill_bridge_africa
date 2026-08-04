import "./QuickActionCard.css";

interface QuickActionCardProps {
  icon: React.ReactNode;
  title: string;
}

const QuickActionCard = ({
  icon,
  title,
}: QuickActionCardProps) => {
  return (
    <button className="quick-card">

      <div className="quick-icon">
        {icon}
      </div>

      <p>{title}</p>

    </button>
  );
};

export default QuickActionCard;