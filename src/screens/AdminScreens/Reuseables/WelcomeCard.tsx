import "./WelcomeCard.css";

const WelcomeCard = () => {
  return (
    <section className="welcome">

      <p className="welcome-text">
        Welcome,
      </p>

      <div className="welcome-row">

        <h1>
          Admin Stephen
          <span className="wave">👋</span>
        </h1>

        <span className="badge">
          Super Admin
        </span>

      </div>

    </section>
  );
};

export default WelcomeCard;