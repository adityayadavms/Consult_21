import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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

  /*
  ===============================
  FETCH FORM TEMPLATE
  ===============================
  */

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const res = await getFormTemplateApi(categoryId);

        // assuming schemaJson
        const schema = JSON.parse(res.schemaJson);

        setFormSchema(schema.fields);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, [categoryId]);

  /*
  ===============================
  HANDLE INPUT
  ===============================
  */

  const handleChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  /*
  ===============================
  HANDLE SUBMIT (NEXT STEP)
  ===============================
  */

  const handleSubmit = async () => {

  if (loading) return; // prevent double click

  try {

    setLoading(true);

    /*
    ===============================
    STEP 1: SAVE CONSULTATION
    ===============================
    */

    const consultationRes = await submitConsultationApi({
      categoryId: Number(categoryId),
      answers: formData
    });

    const consultationId = consultationRes.consultationId;

    /*
    ===============================
    STEP 2: CREATE PAYMENT ORDER
    ===============================
    */

    const orderRes = await createPaymentOrderApi(consultationId);

    const {
      razorpayOrderId,
      amount
    } = orderRes;

    /*
    ===============================
    LOAD RAZORPAY
    ===============================
    */

    const isLoaded = await loadRazorpay();

    if (!isLoaded) {
      alert("Razorpay failed to load");
      return;
    }

    /*
    ===============================
    OPEN CHECKOUT
    ===============================
    */

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY,
      amount,
      currency: "INR",
      name: "Consult21",
      order_id: razorpayOrderId,

      handler: async function (response) {

        await verifyPaymentApi({
          consultationId,
          razorpayOrderId: response.razorpay_order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpaySignature: response.razorpay_signature
        });

        alert("Consultation submitted successfully ");
        setLoading(false); 
      },

      modal: {
        ondismiss: function () {
          alert("Payment cancelled");
          setLoading(false); 
        }
      }
    };

    const rzp = new window.Razorpay(options);

    rzp.on("payment.failed", function () {
      alert("Payment failed");
      setLoading(false); T
    });

    rzp.open();

  } catch (error) {

    alert(
      error.response?.data?.message ||
      "Something went wrong"
    );

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
              onChange={(e) =>
                handleChange(field.key, e.target.value)
              }
            />
          )}

          {field.type === "textarea" && (
            <textarea
              onChange={(e) =>
                handleChange(field.key, e.target.value)
              }
            />
          )}

          {field.type === "select" && (
            <select
              onChange={(e) =>
                handleChange(field.key, e.target.value)
              }
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