function ServiceCard({ title, brief, onConsult }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <p>{brief}</p>

      <button
        className="card-btn"
        onClick={() => onConsult(title)}
      >
        Consult
      </button>
    </div>
  );
}

export default ServiceCard;
