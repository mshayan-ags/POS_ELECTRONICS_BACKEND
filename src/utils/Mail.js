const nodemailer = require("nodemailer");
const EmailValidator = require('email-deep-validator');

async function emailVerification({ email }) {
  const emailValidator = new EmailValidator();
  const { wellFormed, validDomain, validMailbox } = await emailValidator.verify(email); // { wellFormed, validDomain, validMailbox } Booleans
  if (wellFormed && validDomain) return Promise.resolve(true);
  else return Promise.resolve(false);
}


// async..await is not allowed in global scope, must use a wrapper
async function sendMail({ ToEmail, Subject, Body }) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();
  console.log({ ToEmail, Subject, Body }, "ToEmail, Subject, Body")
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    // auth: {
    //   user: testAccount.user, // generated ethereal user
    //   pass: testAccount.pass, // generated ethereal password
    // },
    auth: {
      user: "mshayan.ags@gmail.com", // generated ethereal user
      pass: "iqsashsasa1", // generated ethereal password
    },
  });

  console.log(await transporter, "transporter")

  let info = await transporter.sendMail({
    from: 'mshayan.ags@gmail.com', // sender address
    to: ToEmail,
    subject: Subject, // Subject line
    html: Body, // html body
  });

  console.log(info, "info")
  return {
    info,
    getTestMessageUrl: nodemailer.getTestMessageUrl(info),
    // testAccount
  }
}



module.exports = {
  sendMail,
  emailVerification
}