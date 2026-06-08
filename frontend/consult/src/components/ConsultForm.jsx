// src/components/ConsultForm.jsx

import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { 
  createQuickConsultationApi, 
  createPaymentOrderApi 
} from "../api/consultationApi";
import { initiateCashfreePayment } from "../utils/cashfree";

function ConsultForm({ services }) {
  const navigate = useNavigate();
  
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

    // Validation
    if (!form.name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (!form.contact.trim()) {
      toast.error("Please enter email or phone");
      return;
    }
    if (!form.category) {
      toast.error("Please select a category");
      return;
    }
    if (!form.question.trim() || form.question.trim().length < 10) {
      toast.error("Please enter a question (minimum 10 characters)");
      return;
    }

    try {
      setLoading(true);
      toast.loading("Creating consultation...", { id: "payment" });

      // STEP 1: Create quick consultation
      const consultationResult = await createQuickConsultationApi({
        name: form.name,
        emailOrPhone: form.contact,
        category: form.category,
        question: form.question
      });

      const consultationId = consultationResult.consultationId;
      console.log("Consultation created:", consultationId);

      toast.loading("Creating payment order...", { id: "payment" });

      // STEP 2: Create payment order with idempotency key
      const idempotencyKey = crypto.randomUUID();
      const paymentOrder = await createPaymentOrderApi(consultationId, idempotencyKey);
      
      const { orderId, paymentSessionId } = paymentOrder;
      console.log("Payment order created:", { orderId, paymentSessionId });

      toast.loading("Opening payment window...", { id: "payment" });

      // STEP 3: Initiate Cashfree hosted checkout
      const result = await initiateCashfreePayment(paymentSessionId, orderId);

      toast.dismiss("payment");

      // STEP 4: Handle result
      if (result.success) {
        if (result.redirect) {
          // Cashfree will redirect automatically
          toast.success("Redirecting to payment...");
        } else {
          // Payment completed inline (some UPI methods)
          toast.success("Payment initiated! We'll notify you once confirmed.");
          // Redirect to my questions page after short delay
          setTimeout(() => {
            navigate("/questions");
          }, 2000);
        }
      } else {
        toast.error(result.error || "Payment failed. Please try again.");
      }

    } catch (error) {
      toast.dismiss("payment");
      console.error("Payment error:", error);
      
      const errorMessage = error.response?.data?.message || error.message || "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm({
      name: "",
      contact: "",
      category: "",
      question: ""
    });
  };

  return (
    <form className="consult-form" onSubmit={handleSubmit}>
      <h3>Quick Consultation Form</h3>

      <label>
        Name *
        <input 
          type="text" 
          name="name" 
          value={form.name} 
          onChange={handleChange} 
          placeholder="Enter your full name"
          required 
        />
      </label>

      <label>
        Email or Phone *
        <input 
          type="text" 
          name="contact" 
          value={form.contact} 
          onChange={handleChange} 
          placeholder="Enter email or mobile number"
          required 
        />
      </label>

      <label>
        Category *
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

      <label>
        Your Question *
        <textarea
          name="question"
          value={form.question}
          onChange={handleChange}
          rows="4"
          maxLength="1000"
          placeholder="Please describe your question in detail (minimum 10 characters)"
          required
        />
      </label>

      <div className="price-row">
        <span>Price :</span>
        <strong>₹21</strong>
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="btn-ghost"
          onClick={handleReset}
          disabled={loading}
        >
          Reset
        </button>

        <button 
          type="submit" 
          className="btn-primary" 
          disabled={loading}
        >
          {loading ? "Processing..." : "Pay ₹21 & Submit"}
        </button>
      </div>

      <p className="small">
        You will be redirected to Cashfree secure payment page. 
        Payment confirmation happens automatically. ₹21/₹49 + GST.
      </p>
    </form>
  );
}

export default ConsultForm;