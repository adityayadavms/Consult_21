import ConsultForm from "./ConsultForm";

function HeroSection({ services }) {
  return (
    <section className="hero container" id="home">
      {/* LEFT SIDE */}
      <div className="hero-left">
        <h1>
          Get trusted advice for life, career, education & relationships — only ₹21
        </h1>

        <p className="lead">
          Consult21 connects you with specialists and curated advisors who respond
          thoughtfully and quickly — helping you make confident decisions.
        </p>

        <div className="cta-row">
          <button className="btn-primary">Consult Now</button>
          <button className="btn-ghost">Learn More</button>
        </div>

        <div className="stats">
          <div>
            <strong>₹21</strong>
            <span>Per consult</span>
          </div>
          <div>
            <strong>Within 48h</strong>
            <span>Typical reply time</span>
          </div>
          <div>
            <strong>100+</strong>
            <span>Expert network</span>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <aside className="hero-right" id="consult">
        <ConsultForm services={services} />
      </aside>
    </section>
  );
}

export default HeroSection;
