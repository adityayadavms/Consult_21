import services from "../data/services.json";
import ServiceCard from "./ServiceCard";
import { useNavigate } from "react-router-dom";

function Services() {

  const navigate = useNavigate();

  /*
  ===============================
  HANDLE CONSULT CLICK
  ===============================
  */
  const handleConsult = (id, title) => {
    navigate(`/consult/${id}`);
  };

  return (
    <section id="services" className="container services">
      <h2>Our Services</h2>

      <p className="subtitle">
        Choose from 12 expert consultation categories — all at ₹49 per consult.
      </p>

      <div className="grid">
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            id={service.id}
            title={service.title}
            brief={service.brief}
            onConsult={handleConsult}
          />
        ))}
      </div>
    </section>
  );
}

export default Services;