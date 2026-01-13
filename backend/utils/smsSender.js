// utils/smsSender.js
// Example GSM module integration (AT commands via serial port)

const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');

// Configure your GSM modem serial port
const port = new SerialPort({
  path: process.env.GSM_PORT || '/dev/ttyUSB0',
  baudRate: 9600
});

const parser = port.pipe(new Readline({ delimiter: '\r\n' }));

parser.on('data', line => {
  console.log('GSM response:', line);
});

// Send SMS via GSM modem
const sendSMSViaSIM = async (phoneNumber, message) => {
  return new Promise((resolve, reject) => {
    try {
      // Set SMS mode to text
      port.write('AT+CMGF=1\r');
      // Set recipient
      port.write(`AT+CMGS="${phoneNumber}"\r`);
      // Write message and Ctrl+Z to send
      port.write(message + String.fromCharCode(26));

      parser.once('data', response => {
        if (response.includes('OK')) resolve(true);
        else reject(new Error('SMS send failed: ' + response));
      });
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = { sendSMSViaSIM };
