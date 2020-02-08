const { admin, firestoreRef, fsOtherRef } = require('../utils/admin');

exports.requestVerEmailTriggerFun = async (email, name) => {
  const mailRef = firestoreRef.collection('notificationEmailRequest');
  const recentVerData = await mailRef.where('to', '==', email).get();
  if (!recentVerData.empty) {
    const emails = recentVerData.docs.length;
    const now = fsOtherRef.Timestamp.now();
    for (let i = 0; i < emails; i += 1) {
      const secondsInDay = 86400;
      const lastMessage = recentVerData.docs[i];
      const lastMessageDelivered = lastMessage.updateTime;
      if (lastMessageDelivered + secondsInDay > now) {
        return 'User has already received request in past day.';
      }
    }
  }

  const verificationLink = await admin.auth().generateEmailVerificationLink(email);
  const pageUrl = 'https://carpemeavisio.com';
  const pageLink = `<a href="${pageUrl}">Carpe Mea Visio</a>`;
  const verLink = `<a href="${verificationLink}">Click Here</a>`;
  const logo = '<img src="https://carpemeavisio.com/logo.png"><br>';

  const html = `
    <html>
      <p>${name ? `Greetings ${name},` : 'Greetings,'}</p>
      <p>You have requested a verification link for your email address associated with your account at ${pageLink}.</p>
      <p>${verLink} to verify your email address!</p>
      <p>Regards,</p>
      <p>The ${pageLink} Team</p>
      ${logo}
    </html>
  `;

  const subject = 'Carpe Mea Visio Email Verification';

  const message = { html, subject };
  const replyTo = 'admin@carpemeavisio.com';


  try {
    await mailRef.add({ message, to: email, replyTo });
    return 'Thanks for requesting, email has been provided.';
  } catch (error) {
    return 'Error sending message, please contact administrator.';
  }
};
