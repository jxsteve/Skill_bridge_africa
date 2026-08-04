import "./CTA.css";
import { FiArrowRight } from "react-icons/fi";

const CTA = () => {
  return (
    <section className="cta-section">
      <button className="cta-button">
        <span>Get Started Now</span>
        <FiArrowRight />
      </button>
    </section>
  );
};

export default CTA;