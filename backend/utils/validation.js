// Input validation utilities
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  // At least 6 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/;
  return passwordRegex.test(password);
};

const validatePhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone);
};

const validateName = (name) => {
  return name && name.trim().length >= 2 && name.trim().length <= 50;
};

const validateAddress = (address) => {
  return address && address.trim().length >= 10 && address.trim().length <= 200;
};

// Validation functions for different operations
const validateSignup = (data) => {
  const errors = {};

  if (!data.email || !validateEmail(data.email)) {
    errors.email = 'Valid email is required';
  }

  if (!data.password || !validatePassword(data.password)) {
    errors.password = 'Password must be at least 6 characters with uppercase, lowercase, and number';
  }

  if (!data.name || !validateName(data.name)) {
    errors.name = 'Name must be 2-50 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

const validateLogin = (data) => {
  const errors = {};

  if (!data.email || !validateEmail(data.email)) {
    errors.email = 'Valid email is required';
  }

  if (!data.password || data.password.length < 6) {
    errors.password = 'Password is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

const validateProfileUpdate = (data) => {
  const errors = {};

  if (data.name && !validateName(data.name)) {
    errors.name = 'Name must be 2-50 characters';
  }

  if (data.fullName && !validateName(data.fullName)) {
    errors.fullName = 'Full name must be 2-50 characters';
  }

  if (data.salonName && !validateName(data.salonName)) {
    errors.salonName = 'Salon name must be 2-50 characters';
  }

  if (data.phone && !validatePhone(data.phone)) {
    errors.phone = 'Valid phone number is required';
  }

  if (data.phoneNumber && !validatePhone(data.phoneNumber)) {
    errors.phoneNumber = 'Valid phone number is required';
  }

  if (data.address && !validateAddress(data.address)) {
    errors.address = 'Address must be 10-200 characters';
  }

  if (data.salonAddress && !validateAddress(data.salonAddress)) {
    errors.salonAddress = 'Salon address must be 10-200 characters';
  }

  if (data.city && data.city.trim().length < 2) {
    errors.city = 'City must be at least 2 characters';
  }

  if (data.state && data.state.trim().length < 2) {
    errors.state = 'State must be at least 2 characters';
  }

  if (data.pincode && !/^\d{6}$/.test(data.pincode.trim())) {
    errors.pincode = 'Pincode must be 6 digits';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

const validateSalonRegistration = (data) => {
  const errors = {};

  if (!data.salonName || !validateName(data.salonName)) {
    errors.salonName = 'Salon name must be 2-50 characters';
  }

  if (!data.email || !validateEmail(data.email)) {
    errors.email = 'Valid email is required';
  }

  if (!data.password || !validatePassword(data.password)) {
    errors.password = 'Password must be at least 6 characters with uppercase, lowercase, and number';
  }

  if (!data.salonAddress || !validateAddress(data.salonAddress)) {
    errors.salonAddress = 'Salon address must be 10-200 characters';
  }

  if (!data.phoneNumber || !validatePhone(data.phoneNumber)) {
    errors.phoneNumber = 'Valid phone number is required';
  }

  if (!data.servicesOffered || !Array.isArray(data.servicesOffered) || data.servicesOffered.length === 0) {
    errors.servicesOffered = 'At least one service must be selected';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

module.exports = {
  validateEmail,
  validatePassword,
  validatePhone,
  validateName,
  validateAddress,
  validateSignup,
  validateLogin,
  validateProfileUpdate,
  validateSalonRegistration
}; 