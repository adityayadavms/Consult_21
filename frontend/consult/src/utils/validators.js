export const validateProfile = (form) => {

  if (!form.name || form.name.trim() === "") {
    return "Name is required";
  }

  if (!form.phone || form.phone.trim() === "") {
    return "Phone number is required";
  }

  // Simple phone validation (India)
  const phoneRegex = /^[6-9]\d{9}$/;

  if (!phoneRegex.test(form.phone)) {
    return "Enter a valid 10-digit phone number";
  }

  return null; 
};


/*
=====================================
DYNAMIC CONSULTATION VALIDATION
=====================================
*/

export const validateConsultation = (formData, schema) => {

  for (let field of schema) {

    if (field.required) {

      const value = formData[field.key];

      if (!value || value.toString().trim() === "") {
        return `${field.label} is required`;
      }
    }

    // special rule for question
    if (field.key === "question") {

      const value = formData[field.key];

      if (!value || value.trim().length < 10) {
        return "Question must be at least 10 characters";
      }
    }

  }

  return null;
};