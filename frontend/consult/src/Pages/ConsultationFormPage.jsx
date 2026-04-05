import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast"; 
import { getFormTemplateApi } from "../api/formApi";
import {
  submitConsultationApi,
  createPaymentOrderApi,
  verifyPaymentApi
} from "../api/consultationApi";
import { loadRazorpay } from "../utils/loadRazorpay";

function ConsultationFormPage() {

  const { categoryId } = useParams();

  const [formSchema, setFormSchema] = useState([]);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const res = await getFormTemplateApi(categoryId);
        const schema = JSON.parse(res.schemaJson);
        setFormSchema(schema.fields);
      } catch {
        toast.error("Failed to load form");
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, [categoryId]);

  const handleChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSubmit = async () => {

    if (loading) return;

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

            toast.success("Consultation submitted successfully ");

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
      toast.error(error.response?.data?.message || "Something went wrong");
      setLoading(false);
    }
  };

  if (loading) return <p>Loading form...</p>;

  return (
    <div className="container">
      <h2>Consultation Form</h2>

      {formSchema.map((field) => (
        <div key={field.key} style={{ marginBottom: "15px" }}>
          <label>{field.label}</label>

          {field.type === "text" && (
            <input
              type="text"
              onChange={(e) => handleChange(field.key, e.target.value)}
            />
          )}

          {field.type === "textarea" && (
            <textarea
              onChange={(e) => handleChange(field.key, e.target.value)}
            />
          )}

          {field.type === "select" && (
            <select
              onChange={(e) => handleChange(field.key, e.target.value)}
            >
              {field.options.map((opt) => (
                <option key={opt}>{opt}</option>
              ))}
            </select>
          )}
        </div>
      ))}

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Processing..." : "Submit Consultation"}
      </button>
    </div>
  );
}

export default ConsultationFormPage;