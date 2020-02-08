const { firestoreRef, fsOtherRef } = require('../utils/admin');
const { getUnsubId, checkDND } = require('../submitFunctions/submitGoal');

const buildMessage = (unsubRef, email) => {
  const pageUrl = 'https://carpemeavisio.com';
  const link = `<a href="${pageUrl}">Carpe Mea Visio</a>`;

  const intro = '<html><p>Greetings from Carpe Mea Visio</p>';
  const message = `<p>Your assistance has been requested by ${email} to complete their goal!</p>`;
  const messageTwo = `<p>Create an account at ${link} to help them along thier journey!</p>`;
  const messageThree = '<p>If you feel you have received this message in error, please respond with the words stop!</p>';
  const outro = '<p>Thank you!</p>';
  const logo = '<img src="https://carpemeavisio.com/logo.png"><br>';
  const unsubLinkHtml = `<small><a href="${pageUrl}/Unsubscribe/${unsubRef}">Unsubscribe</a></small></html>`;

  return intro.concat(message, messageTwo, messageThree, outro, logo, unsubLinkHtml);
};

exports.requestVerFun = async (contributor, email) => {
  const mailRef = firestoreRef.collection('mail');
  const recentVerRef = mailRef.where('to', '==', contributor);
  const promiseArr = [recentVerRef.get(), getUnsubId(contributor), checkDND(contributor)];

  const [recentVerData, unsubRef, isDND] = await Promise.all(promiseArr);

  if (isDND) return null;

  if (!recentVerData.empty) {
    const emails = recentVerData.docs.length;
    for (let i = 0; i < emails; i += 1) {
      const secondsInDay = 86400;
      const lastMessage = recentVerData.docs[i];
      // eslint-disable-next-line no-underscore-dangle
      const lastMessageDelivered = lastMessage.updateTime;
      const now = fsOtherRef.Timestamp.now();
      if (lastMessageDelivered + secondsInDay > now) {
        throw new Error('User has already received request in past day.');
      }
    }
  }

  const html = buildMessage(unsubRef, email);
  const subject = 'Help your friends acheive their goals!';

  return mailRef.add({
    message: {
      html,
      subject,
    },
    to: contributor,
    replyTo: 'admin@carpemeavisio.com',
  });
};
