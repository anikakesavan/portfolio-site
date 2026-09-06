function isValidEmail(email) {
  if (typeof email !== "string") return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function validateContactForm({ name, email, message }) {
  const errors = {};

  if (!name || !name.trim()) {
    errors.name = "Please enter your name.";
  }

  if (!email || !email.trim()) {
    errors.email = "Please enter your email.";
  } else if (!isValidEmail(email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (!message || !message.trim()) {
    errors.message = "Please enter a message.";
  } else if (message.trim().length < 10) {
    errors.message = "Message should be at least 10 characters.";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { isValidEmail, validateContactForm };
}
