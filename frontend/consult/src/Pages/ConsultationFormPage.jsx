// src/Pages/ConsultationFormPage.jsx

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getFormTemplateApi } from "../api/formApi";
import {submitConsultationApi,createPaymentOrderApi} from "../api/consultationApi";
import { validateConsultation } from "../utils/validators";
import { initiateCashfreePayment } from "../utils/cashfree";
import "./consultation.css";
import MultiSelectDropdown from "../components/MultiSelectDropdown";

function ConsultationFormPage() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  
  const [formSchema, setFormSchema] = useState([]);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // =============================
  // FETCH FORM TEMPLATE
  // =============================
  useEffect(() => {
    const fetchForm = async () => {
      try {
        const res = await getFormTemplateApi(categoryId);
        console.log("Form template response:", res);

        if (!res || !res.schemaJson) {
          throw new Error("Invalid API response");
        }

        const schema = res.schemaJson;
        setFormSchema(schema.sections || []);
        
        // Initialize form data with empty values
        const initialData = {};
        (schema.sections || []).forEach(section => {
          section.fields?.forEach(field => {
            if (field.type === "multiselect") {
              initialData[field.key] = [];
            } else {
              initialData[field.key] = "";
            }
          });
        });
        setFormData(initialData);
        
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
  // HANDLE FORM FIELD CHANGE
  // =============================
  const handleChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  // =============================
  // RENDER FORM FIELD
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
            placeholder={field.placeholder || ""}
          />
        );

      case "textarea":
        return (
          <textarea
            value={formData[field.key] || ""}
            onChange={(e) => handleChange(field.key, e.target.value)}
            placeholder={field.placeholder || ""}
            rows={4}
          />
        );

      case "select":
        return (
          <select
            value={formData[field.key] || ""}
            onChange={(e) => handleChange(field.key, e.target.value)}
          >
            <option value="">Select {field.label}</option>
            {field.options?.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        );

      case "multiselect":
      return (
        <MultiSelectDropdown
          value={formData[field.key] || []}
          options={field.options}
          label={field.label}
          onChange={(val) => handleChange(field.key, val)}
        />
      );

      case "file":
        return (
          <input
            type="file"
            onChange={(e) => handleChange(field.key, e.target.files[0])}
          />
        );

      default:
        return <p className="text-red-500">Unsupported field: {field.type}</p>;
    }
  };

  // =============================
  // HANDLE FORM SUBMIT
  // =============================
  const handleSubmit = async () => {
    // Flatten all fields for validation
    const allFields = formSchema.flatMap(section => section.fields || []);
    
    // Validate form
    const error = validateConsultation(formData, allFields);
    if (error) {
      toast.error(error);
      return;
    }

    try {
      setSubmitting(true);
      toast.loading("Submitting consultation...", { id: "payment" });

      // STEP 1: Submit consultation form
      const consultationRes = await submitConsultationApi({
        categoryId: Number(categoryId),
        answers: formData
      });

      const consultationId = consultationRes.consultationId;
      console.log("Consultation submitted:", consultationId);

      toast.loading("Creating payment order...", { id: "payment" });

      // STEP 2: Create payment order
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
          toast.success("Redirecting to payment...");
        } else {
          toast.success("Payment initiated! We'll notify you once confirmed.");
          setTimeout(() => {
            navigate("/questions");
          }, 2000);
        }
      } else {
        toast.error(result.error || "Payment failed. Please try again.");
      }

    } catch (error) {
      toast.dismiss("payment");
      console.error("Submission error:", error);
      
      const errorMessage = error.response?.data?.message || "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  // =============================
  // LOADING STATE
  // =============================
  if (loading) {
    return (
      <div className="consult-container">
        <div className="consult-card" style={{ textAlign: "center" }}>
          <p>Loading form...</p>
        </div>
      </div>
    );
  }

  if (!formSchema.length) {
    return (
      <div className="consult-container">
        <div className="consult-card" style={{ textAlign: "center" }}>
          <p>No form available for this category.</p>
          <button className="btn-primary" onClick={() => navigate("/")}>
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="consult-container">
      <div className="consult-card">
        <h2 className="consult-title">Consultation Form</h2>
        <p className="price-row" style={{ marginBottom: "20px" }}>
          Consultation Fee: <strong>₹49</strong>
        </p>

        {formSchema.map((section, sectionIdx) => (
          <div key={sectionIdx} className="consult-section">
            <h3>{section.section}</h3>
            
            {section.fields?.map((field) => (
              <div key={field.key} className="consult-field">
                <label>
                  {field.label}
                  {field.required && <span style={{ color: "#ff6a00" }}> *</span>}
                </label>
                {renderField(field)}
              </div>
            ))}
          </div>
        ))}

        <button
          className="consult-btn"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? "Processing..." : "Pay ₹49 & Submit Consultation"}
        </button>
      </div>
    </div>
  );
}

export default ConsultationFormPage;