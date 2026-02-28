import services from "../data/services.json";
import ServiceCard from "./ServiceCard";

function Services() {
  const handleConsult = (category) => {
    
    const select = document.querySelector('select[name="category"]');
    if (select) {
      select.value = category;
      window.location.hash = "#consult";
    }
  };

  return (
    <section id="services" className="container services">
      <h2>Our Services</h2>
      <p className="subtitle">
        Choose from 13 expert consultation categories — all at ₹21 per consult.
      </p>

      <div className="grid">
        {services.map((service, index) => (
          <ServiceCard
            key={index}
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
