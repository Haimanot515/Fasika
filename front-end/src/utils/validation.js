export const validateEmail = (email) => {
  return String(email).toLowerCase().match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};