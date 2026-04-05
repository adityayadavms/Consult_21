import { useState } from "react";
import toast from "react-hot-toast"; 
import { createQuickConsultationApi, verifyPaymentApi } from "../api/consultationApi";
import { loadRazorpay } from "../utils/loadRazorpay";

function ConsultForm({ services }) {

  const [form, setForm] = useState({
    name: "",
    contact: "",
    category: "",
    question: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const isLoaded = await loadRazorpay();

      if (!isLoaded) {
        toast.error("Razorpay SDK failed to load");
        return;
      }

      const data = await createQuickConsultationApi(form);

      const { consultationId, razorpayOrderId, amount } = data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount,
        currency: "INR",
        name: "Consult21",
        description: "Quick Consultation",
        order_id: razorpayOrderId,

        handler: async function (response) {
          try {
            await verifyPaymentApi({
              consultationId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature
            });

            toast.success("Payment successful! ");

          } catch {
            toast.error("Payment verification failed");
          }
        },

        prefill: {
          name: form.name,
          email: form.contact
        },

        theme: {
          color: "#ff6a00"
        },

        modal: {
          ondismiss: function () {
            toast("Payment cancelled");
          }
        }
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function (response) {
        console.error("Payment Failed:", response.error);
        toast.error(response.error.description || "Payment failed");
      });

      rzp.open();

    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="consult-form" onSubmit={handleSubmit}>
      <h3>Quick Consultation Form</h3>

      <label>
        Name
        <input type="text" name="name" value={form.name} onChange={handleChange} required />
      </label>

      <label>
        Email or Phone
        <input type="text" name="contact" value={form.contact} onChange={handleChange} required />
      </label>

      <label>
        Category
        <select name="category" value={form.category} onChange={handleChange} required>
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
          value={form.question}
          onChange={handleChange}
          rows="4"
          maxLength="1000"
          required
        />
      </label>

      <div className="price-row">
        <span>Price :</span>
        <strong>₹21</strong>
      </div>

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

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Processing..." : "Pay & Submit"}
        </button>
      </div>

      <p className="small">
        Payment will open a Razorpay checkout. After payment, admin will receive an email.
      </p>
    </form>
  );
}

export default ConsultForm;