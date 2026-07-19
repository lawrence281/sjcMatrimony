import { useRef, useEffect } from 'react';

/**
 * Premium numeric OTP split input component.
 * Supports auto-focus, backspace jumping, and copy-paste.
 */
const OtpInput = ({ length = 6, value = '', onChange, error }) => {
  const inputsRef = useRef([]);

  // Split string into array, pad with empty strings if too short
  const otpArray = value.split('').concat(Array(length).fill('')).slice(0, length);

  useEffect(() => {
    // Focus the first box on mount
    if (inputsRef.current[0]) {
      inputsRef.current[0].focus();
    }
  }, []);

  const handleChange = (e, index) => {
    const val = e.target.value;
    if (!/^\d*$/.test(val)) return; // Allow only digits

    const newOtpArray = [...otpArray];
    // Keep only the last character if user types over
    newOtpArray[index] = val.substring(val.length - 1);

    const newOtp = newOtpArray.join('');
    onChange(newOtp);

    // Shift focus forward if we typed a digit and are not at the end
    if (val && index < length - 1 && inputsRef.current[index + 1]) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Backspace handling
    if (e.key === 'Backspace') {
      if (!otpArray[index] && index > 0 && inputsRef.current[index - 1]) {
        // Empty box backspace -> focus previous box and delete value
        inputsRef.current[index - 1].focus();
        const newOtpArray = [...otpArray];
        newOtpArray[index - 1] = '';
        onChange(newOtpArray.join(''));
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').trim();
    if (!/^\d+$/.test(pasteData)) return; // Digits only

    const pastedDigits = pasteData.slice(0, length).split('');
    const newOtpArray = [...otpArray];

    pastedDigits.forEach((digit, i) => {
      newOtpArray[i] = digit;
    });

    const newOtp = newOtpArray.join('');
    onChange(newOtp);

    // Focus the last filled box or final box
    const focusIndex = Math.min(pastedDigits.length, length - 1);
    if (inputsRef.current[focusIndex]) {
      inputsRef.current[focusIndex].focus();
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between gap-2.5 max-w-sm mx-auto" onPaste={handlePaste}>
        {Array(length)
          .fill(0)
          .map((_, index) => (
            <input
              key={index}
              ref={(el) => (inputsRef.current[index] = el)}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={otpArray[index]}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={`w-12 h-14 sm:w-14 sm:h-16 text-center text-xl font-bold font-heading rounded-2xl border bg-white
                focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-150
                ${error ? 'border-danger focus:ring-danger' : 'border-neutral-200'}`}
              aria-label={`Digit ${index + 1}`}
            />
          ))}
      </div>
      {error && <p className="text-center text-xs text-danger mt-3" role="alert">{error}</p>}
    </div>
  );
};

export default OtpInput;
