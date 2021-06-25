const nodemailer = require("nodemailer");

const activationTemplate = require('./activationTemplate');
const cancelationTemplate = require('./cancelationTemplate');
const vipStartTemplate = require('./vipStartedTemplate');
const vipEndedTemplate = require('./vipEndedTemplate');
const bookingConfirmedTemplate = require('./bookingConfirmedTemplate');
const bookingCanceledTemplate = require('./bookingCanceledTemplate');
const bookingDDJJCancelationTemplate = require('./bookingDDJJCancelationTemplate');

let initialized = false;
let transporter;

// async..await is not allowed in global scope, must use a wrapper
async function main() {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing

  if (initialized) return;

  let testAccount = await nodemailer.createTestAccount();
  initialized = true;
  // create reusable transporter object using the default SMTP transport
  transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });
}

async function sendEmail(to, subject, text, html) {
  const from = '"Equipo de Combi19" <no-reply@combi19.com>';
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from,
    to,
    subject,
    text,
    html
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

function init() {
  main().catch(console.error);
}

function sendActivationEmail(destination) {
  const subject = "Activacion de su cuenta en Combi19";
  const text = "Su cuenta en Combi19 ha sido creada, por favor navegue al sitio y utilice el su email y la contraseña provista por el chofer.";
  const html = activationTemplate.getHtml();
  sendEmail(destination, subject, text, html);
}

function sendTripCancelationEmail(destination, tripOrigin, tripDestination, tripDate, tripHour) {
  const subject = "Su Viaje ha Sido Cancelado";
  const text = "Su cuenta en Combi19 ha sido creada, por favor navegue al sitio y utilice el su email y la contraseña provista por el chofer.";
  cancelationTemplate.setVariables(tripOrigin, tripDestination, tripDate, tripHour);
  const html = cancelationTemplate.getHtml();
  sendEmail(destination, subject, text, html);
}

function sendBookingCancelationEmail(destination, tripOrigin, tripDestination, tripDate, tripHour, ammount) {
  const subject = "Reserva Cancelada";
  const text = "Usted ha cancelado su reserva";
  bookingCanceledTemplate.setVariables(tripOrigin, tripDestination, tripDate, tripHour, ammount)
  const html = bookingCanceledTemplate.getHtml();
  sendEmail(destination, subject, text, html);
}

function sendBookingDDJJCancelation(destination, tripOrigin, tripDestination, tripDate, tripHour, ammount) {
  const subject = "Reserva Cancelada por caso sospechoso";
  const text = "Su reserva ha sido cancelada por ser un caso sospechoso";
  bookingDDJJCancelationTemplate.setVariables(tripOrigin, tripDestination, tripDate, tripHour, ammount)
  const html = bookingDDJJCancelationTemplate.getHtml();
  sendEmail(destination, subject, text, html);
}


function sendBookingConfirmationEmail(destination, tripOrigin, tripDestination, tripDate, tripHour) {
  const subject = "Su Reserva ha Sido Confirmada";
  const text = "Su reserva ha sido confirmada";
  bookingConfirmedTemplate.setVariables(tripOrigin, tripDestination, tripDate, tripHour)
  const html = bookingConfirmedTemplate.getHtml();
  sendEmail(destination, subject, text, html);
}

function vipSubscriptionInitiatedEmail(destination) {
  const subject = "Bienvenido a Combi19 VIP";
  const text = "Usted ahora es VIP";
  const html = vipStartTemplate.getHtml();
  sendEmail(destination, subject, text, html);
}

function vipSubscriptionEndedEmail(destination) {
  const subject = "Cancelacion de VIP";
  const text = "Su subscripcion VIP ha sido cancelada";
  const html = vipEndedTemplate.getHtml();
  sendEmail(destination, subject, text, html);
}

module.exports = {
  init,
  sendActivationEmail,
  sendTripCancelationEmail,
  sendBookingConfirmationEmail,
  sendBookingCancelationEmail,
  vipSubscriptionInitiatedEmail,
  vipSubscriptionEndedEmail,
  sendBookingDDJJCancelation
};
