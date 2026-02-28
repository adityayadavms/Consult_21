function ConsultForm({ services }) {
  return (
    <form className="consult-form">
      <h3>Quick Consultation Form</h3>

      <label>
        Name
        <input type="text" name="name" required />
      </label>

      <label>
        Email or Phone
        <input type="text" name="contact" required />
      </label>

      <label>
        Category
        <select name="category" required>
          <option value="">Choose a category</option>

          {services.map((service) => (
            <option key={service.title} value={service.title}>
              {service.title}
            </option>
          ))}
        </select>
      </label>

      <label>
        Your question
        <textarea
          name="question"
          rows="4"
          maxLength="1000"
          placeholder="Type your question (max 1000 chars)"
          required
        />
      </label>

      <div className="price-row">
        <span>Price :</span>
        <strong>₹21</strong>
      </div>

      <div className="form-actions">
        <button type="reset" className="btn-ghost">
          Reset
        </button>
        <button type="submit" className="btn-primary">
          Pay & Submit
        </button>
      </div>

      <p className="small">
        Payment will open a Razorpay checkout (test keys used). After payment,
        admin will receive an email and you will see a confirmation.
      </p>
    </form>
  );
}

export default ConsultForm;
