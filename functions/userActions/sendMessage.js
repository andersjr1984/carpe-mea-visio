const { firestoreRef } = require('../utils/admin');

exports.sendMessageFun = (data) => {
  const replyTo = data.email !== '' ? data.email : null;
  const { subject, text } = data;

  const to = 'admin@carpemeavisio.com';

  const message = { text, subject };

  const mailRef = firestoreRef.collection('contactMe');

  return mailRef.add({ message, to, replyTo });
};
