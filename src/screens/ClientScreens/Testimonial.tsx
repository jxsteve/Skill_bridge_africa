import "./Testimonial.css";
import profile from "../assets/images/Testimonial.png";

const Testimonial = () => {
  return (
    <section className="testimonial">

      <p className="testimonial-text">
        SkillBridge Africa has helped us complete projects
        faster and at affordable rates. The quality and
        communication are top-notch.
      </p>

      <div className="testimonial-user">

        <img
          src={profile}
          alt="Thomas Daniel"
          className="testimonial-image"
        />

        <div>
          <h3>Thomas Daniel</h3>
          <span>Product Manager</span>
        </div>

      </div>

    </section>
  );
};

export default Testimonial;