import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getFormTemplateApi } from "../api/formApi";
import "./consultation.css";
import {
  submitConsultationApi,
  createPaymentOrderApi,
  verifyPaymentApi
} from "../api/consultationApi";
import { loadRazorpay } from "../utils/loadRazorpay";
import { validateConsultation } from "../utils/validators";

function ConsultationFormPage() {

  const { categoryId } = useParams();

  const [formSchema, setFormSchema] = useState([]);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);

  // =============================
  // FETCH FORM
  // =============================
  useEffect(() => {
  const fetchForm = async () => {
    try {
      const res = await getFormTemplateApi(categoryId);

      console.log("API RESPONSE:", res);

      if (!res || !res.schemaJson) {
        throw new Error("Invalid API response");
      }

      const schema = res.schemaJson;

      setFormSchema(schema.sections || []);

    } catch (err) {
      console.error(err);
      toast.error("Failed to load form");
    } finally {
      setLoading(false);
    }
  };

  fetchForm();
}, [categoryId]);

  // =============================
  // HANDLE CHANGE
  // =============================
  const handleChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  // =============================
  // RENDER FIELD (CLEAN)
  // =============================
  const renderField = (field) => {
    switch (field.type) {

      case "text":
      case "email":
      case "number":
        return (
          <input
            type={field.type}
            value={formData[field.key] || ""}
            onChange={(e) => handleChange(field.key, e.target.value)}
          />
        );

      case "textarea":
        return (
          <textarea
            value={formData[field.key] || ""}
            onChange={(e) => handleChange(field.key, e.target.value)}
          />
        );

      case "select":
        return (
          <select
            value={formData[field.key] || ""}
            onChange={(e) => handleChange(field.key, e.target.value)}
          >
            <option value="">Select</option>
            {field.options?.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        );

      case "multiselect":
        return (
          <select
            multiple
            value={formData[field.key] || []}
            onChange={(e) =>
              handleChange(
                field.key,
                Array.from(e.target.selectedOptions).map(o => o.value)
              )
            }
          >
            {field.options?.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        );

      case "file":
        return (
          <input
            type="file"
            onChange={(e) => handleChange(field.key, e.target.files[0])}
          />
        );

      default:
        return <p>Unsupported field: {field.type}</p>;
    }
  };

  // =============================
  // SUBMIT
  // =============================
  const handleSubmit = async () => {

    // flatten fields for validation
    const allFields = formSchema.flatMap(section => section.fields);

    const error = validateConsultation(formData, allFields);

    if (error) {
      toast.error(error);
      return;
    }

    try {
      setLoading(true);

      const consultationRes = await submitConsultationApi({
        categoryId: Number(categoryId),
        answers: formData
      });

      const consultationId = consultationRes.consultationId;

      const orderRes = await createPaymentOrderApi(consultationId);

      const { razorpayOrderId, amount } = orderRes;

      const isLoaded = await loadRazorpay();

      if (!isLoaded) {
        toast.error("Razorpay failed to load");
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount,
        currency: "INR",
        name: "Consult21",
        order_id: razorpayOrderId,

        handler: async function (response) {
          try {
            await verifyPaymentApi({
              consultationId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature
            });

            toast.success("Consultation submitted successfully");

          } catch {
            toast.error("Payment verification failed");
          } finally {
            setLoading(false);
          }
        },

        modal: {
          ondismiss: function () {
            toast("Payment cancelled");
            setLoading(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function () {
        toast.error("Payment failed");
        setLoading(false);
      });

      rzp.open();

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong"
      );
      setLoading(false);
    }
  };

  // =============================
  // UI
  // =============================
  if (loading) return <p className="consult-loading">Loading form...</p>;

if (!formSchema.length) {
  return <p className="consult-loading">No form available</p>;
}

return (
  <div className="consult-container">
    <div className="consult-card">

      <h2 className="consult-title">Consultation Form</h2>

      {formSchema.map((section) => (
        <div key={section.section} className="consult-section">

          <h3>{section.section}</h3>

          {section.fields.map((field) => (
            <div key={field.key} className="consult-field">

              <label>{field.label}</label>

              {renderField(field)}

            </div>
          ))}

        </div>
      ))}

      <button
        className="consult-btn"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Processing..." : "Submit Consultation"}
      </button>

    </div>
  </div>
);
}

export default ConsultationFormPage;