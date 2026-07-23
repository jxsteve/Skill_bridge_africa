import "./Hero.css";

import {
  FiUsers,
  FiShield,
  FiClock,
  FiAward
} from "react-icons/fi";

import student from "../assets/student.png";

const Hero = () => {
  return (
    <section className="hero">

      <div className="badge">
        <FiUsers />
        <span>For Clients / Businesses</span>
      </div>

      <h1>
        Get Quality
        <br />
        work done by
        <br />
        verified student
        <br />
        talent.
      </h1>

      <p className="hero-text">
        Post tasks, we handle the verification and
        matching.
        <br />
        You get results, on time.
      </p>

      <div className="hero-image-wrapper">

        <div className="floating top">
          <FiAward />
          <span>Quality Work</span>
        </div>

        <div className="floating left">
          <FiShield />
          <span>Verified Students</span>
        </div>

        <div className="floating right">
          <FiClock />
          <span>On-time Delivery</span>
        </div>

        <img
          src={student}
          alt="Student"
          className="hero-image"
        />

      </div>

    </section>

    
  );
};

export default Hero;