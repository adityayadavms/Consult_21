function ServiceCard({ id, title, brief, onConsult }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <p>{brief}</p>

      <button
        className="card-btn"
        onClick={() => onConsult(id, title)}
      >
        Consult
      </button>
    </div>
  );
}

export default ServiceCard;
