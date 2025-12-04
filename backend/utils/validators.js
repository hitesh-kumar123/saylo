export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validateUser = (user) => {
  if (!user.name || user.name.trim() === "") {
    return { valid: false, message: "Name is required" };
  }

  if (!validateEmail(user.email)) {
    return { valid: false, message: "Invalid email format" };
  }

  if (!validatePassword(user.password)) {
    return { valid: false, message: "Password must be at least 6 characters" };
  }

  return { valid: true };
};
