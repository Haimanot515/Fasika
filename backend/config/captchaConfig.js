const axios = require('axios');

async function verifyCaptcha(token) {
  const secret = process.env.RECAPTCHA_SECRET;
  const response = await axios.post(
    `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`
  );
  return response.data.success;
}

module.exports = { verifyCaptcha };
