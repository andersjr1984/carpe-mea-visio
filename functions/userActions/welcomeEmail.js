/* eslint-disable max-len */
const { firestoreRef, admin } = require('../utils/admin');

exports.welcomeEmailFun = async (user) => {
  const { email, emailVerified } = user;
  const replyTo = 'admin@carpemeavisio.com';
  const pageUrl = 'https://carpemeavisio.com';
  const pageLink = `<a href="${pageUrl}">Carpe Mea Visio</a>`;
  const verificationLink = await admin.auth().generateEmailVerificationLink(email);
  const displayName = user.displayName || 'Valued User';
  const logo = '<img src="https://carpemeavisio.com/logo.png"><br>';

  if (!email) return null;

  const salutation = `<html><p>${displayName},</p>`;
  const intro = `<p>Thanks for taking a minute to check out ${pageLink}, the digital vision board!</p>`;
  const verify = `<p>Your email requires verification before you can use the full suite of features.  <a href="${verificationLink}">Please click here.</a></p>`;
  const closing = `<p>Regards,</p><p>The ${pageLink} Team</p>${logo}</html>`;

  const html = emailVerified ? salutation.concat(intro, closing) : salutation.concat(intro, verify, closing);

  const subject = 'Carpe Mea Visio: The Digital Vision Board';

  const message = { html, subject };

  const mailRef = firestoreRef.collection('mail');

  return mailRef.add({ message, to: email, replyTo });
};
