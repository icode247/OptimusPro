const nodemailer = require('nodemailer');

// async..await is not allowed in global scope, must use a wrapper
async function sendMail(options) {
  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: 'jacky.ratke87@ethereal.email',
      pass: 'rtpnSuzvmYybRh8Bvm',
    },
  });

  // send mail with defined transport object
  await transporter.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: options.to,
    subject: options.subject,
    text: options.message,
    // html: '<b>Hello world?</b>', // html body
  });
}
module.exports = sendMail;
