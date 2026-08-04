import "./ChooseUsContent.css";

import {
  FiShield,
  FiThumbsUp,
  FiClock,
  FiLock,
} from "react-icons/fi";

import FeatureCard from "./FeatureCard";

const ChooseUsContent = () => {
  return (
    <section className="why">

      <h4>Why Clients Choose Us</h4>

      <h1>
        More than just a
        <br />
        Freelance Platform
      </h1>

      <p className="subtitle">
        We give you confidence,
        quality and complete control
      </p>

      <FeatureCard
        icon={<FiShield color="#22A652" />}
        title="Verified Student Talent"
        description="Every student is verified by our admin team. You work with trusted, skilled talent."
      />

      <FeatureCard
        icon={<FiThumbsUp color="#2450CF" />}
        title="Quality You can Trust"
        description="We ensure high standards through manual review and quality control."
      />

      <FeatureCard
        icon={<FiClock color="#6A28FF" />}
        title="On-Time Delivery"
        description="Students are committed to deadlines. We keep your projects on track."
      />

      <FeatureCard
        icon={<FiLock color="#F59E0B" />}
        title="Secure Blockchain Payments"
        description="Your funds are safe in our platform wallet and released only after you approve."
      />

    </section>
  );
};

export default ChooseUsContent;