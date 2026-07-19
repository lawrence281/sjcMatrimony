import { useState, useCallback } from 'react';

/**
 * Custom form handling hook with validation.
 *
 * @param {Object} initialValues - Initial field values
 * @param {Function} validateFn - Callback function that takes values and returns errors object
 * @param {Function} onSubmitFn - Callback function to run on successful validation
 */
export const useForm = (initialValues, validateFn, onSubmitFn) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;

    setValues((prev) => ({
      ...prev,
      [name]: val,
    }));

    // Clear field-specific error as user types
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  }, [errors]);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setIsSubmitting(false);
  }, [initialValues]);

  const handleSubmit = useCallback(async (e) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }

    if (validateFn) {
      const validationErrors = validateFn(values);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
    }

    setIsSubmitting(true);
    try {
      await onSubmitFn(values);
    } catch (error) {
      // If error is from backend Joi validator or responseHelper:
      if (error.response?.data?.errors) {
        const serverErrors = {};
        error.response.data.errors.forEach((err) => {
          serverErrors[err.field] = err.message;
        });
        setErrors(serverErrors);
      } else {
        setErrors({ form: error.response?.data?.message || error.message || 'An error occurred.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validateFn, onSubmitFn]);

  const setFieldValue = useCallback((name, value) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  }, [errors]);

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    resetForm,
    setFieldValue,
    setErrors,
  };
};

export default useForm;
