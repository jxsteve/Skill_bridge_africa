import "./PendingVerifications.css";

import VerificationRow from "./VerificationRow";

import user1 from "../assets/images/user1.png";
import user2 from "../assets/images/user1.png";
import user3 from "../assets/images/user1.png";

const PendingVerifications = () => {
  return (
    <section className="table-card">

      <div className="table-header">

        <h3>Pending Verifications</h3>

        <button>View all</button>

      </div>

      <VerificationRow
        image={user1}
        name="Chidi Okeke"
        school="Uni. of Lagos • UI/UX"
        status="Pending"
      />

      <VerificationRow
        image={user2}
        name="Tunde Adeyemi"
        school="OAU Ife • Video Editing"
        status="In Review"
      />

      <VerificationRow
        image={user3}
        name="Miracle Igboanusi"
        school="Uni. of Jos • UI/UX Design"
        status="Completed"
      />

    </section>
  );
};

export default PendingVerifications;