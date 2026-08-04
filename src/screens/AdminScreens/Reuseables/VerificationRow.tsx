import "./VerificationRow.css";

interface VerificationRowProps {
  image: string;
  name: string;
  school: string;
  status: "Pending" | "In Review" | "Completed";
}

const VerificationRow = ({
  image,
  name,
  school,
  status,
}: VerificationRowProps) => {
  const statusClass =
    status === "Pending"
      ? "pending"
      : status === "In Review"
      ? "review"
      : "completed";

  return (
    <div className="verification-row">

      <div className="verification-left">

        <img src={image} alt={name} />

        <div>
          <h4>{name}</h4>
          <p>{school}</p>
        </div>

      </div>

      <span className={`status ${statusClass}`}>
        {status}
      </span>

    </div>
  );
};

export default VerificationRow;