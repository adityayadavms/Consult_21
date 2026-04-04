import { useState } from "react";
import { createQuickConsultationApi, verifyPaymentApi } from "../api/consultationApi";
import { loadRazorpay } from "../utils/loadRazorpay";

function ConsultForm({ services }) {

  /*
  ===============================
  STATE
  ===============================
  */
  const [form, setForm] = useState({
    name: "",
    contact: "",
    category: "",
    question: ""
  });

  const [loading, setLoading] = useState(false);

  /*
  ===============================
  HANDLE INPUT
  ===============================
  */
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  /*
  ===============================
  HANDLE SUBMIT (CORE LOGIC)
  ===============================
  */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      /*
      ===============================
      LOAD RAZORPAY
      ===============================
      */
      const isLoaded = await loadRazorpay();

      if (!isLoaded) {
        alert("Razorpay SDK failed to load");
        return;
      }

      /*
      ===============================
      CREATE ORDER (BACKEND)
      ===============================
      */
      const data = await createQuickConsultationApi(form);

      const {
        consultationId,
        razorpayOrderId,
        amount
      } = data;

      /*
      ===============================
      OPEN RAZORPAY CHECKOUT
      ===============================
      */
      const options = {
        key: "YOUR_RAZORPAY_KEY", // 🔥 replace with your test key
        amount: amount,
        currency: "INR",
        name: "Consult21",
        description: "Quick Consultation",
        order_id: razorpayOrderId,

        handler: async function (response) {

          /*
          ===============================
          VERIFY PAYMENT
          ===============================
          */
          await verifyPaymentApi({
            consultationId,
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature
          });

          alert("Payment successful! 🎉");
        },

        prefill: {
          name: form.name,
          email: form.contact
        },

        theme: {
          color: "#ff6a00"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Something went wrong"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="consult-form" onSubmit={handleSubmit}>
      <h3>Quick Consultation Form</h3>

      {/* NAME */}
      <label>
        Name
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
      </label>

      {/* CONTACT */}
      <label>
        Email or Phone
        <input
          type="text"
          name="contact"
          value={form.contact}
          onChange={handleChange}
          required
        />
      </label>

      {/* CATEGORY */}
      <label>
        Category
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          required
        >
          <option value="">Choose a category</option>

          {services.map((service) => (
            <option key={service.title} value={service.title}>
              {service.title}
            </option>
          ))}
        </select>
      </label>

      {/* QUESTION */}
      <label>
        Your question
        <textarea
          name="question"
          value={form.question}
          onChange={handleChange}
          rows="4"
          maxLength="1000"
          placeholder="Type your question (max 1000 chars)"
          required
        />
      </label>

      {/* PRICE */}
      <div className="price-row">
        <span>Price :</span>
        <strong>₹21</strong>
      </div>

      {/* ACTIONS */}
      <div className="form-actions">
        <button
          type="reset"
          className="btn-ghost"
          onClick={() =>
            setForm({
              name: "",
              contact: "",
              category: "",
              question: ""
            })
          }
        >
          Reset
        </button>

        <button
          type="submit"
          className="btn-primary"
          disabled={loading}
        >
          {loading ? "Processing..." : "Pay & Submit"}
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