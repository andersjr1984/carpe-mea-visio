const { firestoreRef, fsOtherRef, admin } = require('../utils/admin');
const { getUnsubId, checkDND } = require('../submitFunctions/submitGoal');
const { updateNotifications } = require('../utils/updateNotifications');

const createMessage = async (contributor, name, actionItem, goalId) => {
  const user = await admin.auth().getUserByEmail(contributor);
  const displayName = user.displayName || 'Valued User';
  const mailRef = firestoreRef.collection('mail');
  const recentMessageRef = mailRef.where('to', '==', contributor);
  const promiseArr = [recentMessageRef.get(), getUnsubId(contributor), checkDND(contributor)];
  const [recentMessageData, unsubRef, isDND] = await Promise.all(promiseArr);
  if (isDND) return null;

  if (!recentMessageData.empty) {
    const emails = recentMessageData.docs.length;
    for (let i = 0; i < emails; i += 1) {
      const secondsInDay = 86400;
      const lastMessage = recentMessageData.docs[i];
      // eslint-disable-next-line no-underscore-dangle
      const lastMessageDelivered = lastMessage.updateTime;
      const now = fsOtherRef.Timestamp.now();
      if (lastMessageDelivered + secondsInDay > now) {
        return null;
      }
    }
  }

  const pageUrl = 'https://carpemeavisio.com';
  const goalUrl = `${pageUrl}/Goals/${goalId}`;
  const link = `<a href="${pageUrl}">Carpe Mea Visio</a>`;
  const unsubLinkHtml = `<small><a href="${pageUrl}/Unsubscribe/${unsubRef}">Unsubscribe</a></small></html>`;
  const logo = '<img src="https://carpemeavisio.com/logo.png"><br>';

  const html = (
    `
    <html>
      <p>
        Greetings ${displayName}
      </p>
      <p>
        ${name} has assigned a new action item relating to a goal you are a contributor to.
      </p>
      <p>
        <a href="${goalUrl}">
          <b>Action Item: </b>${actionItem}
        </a>
      </p>
      <p>Regards,</p>
      <p>The ${link} Team</p>
      ${logo}
      ${unsubLinkHtml}
    </html>
    `
  );

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

exports.submitActionItemFun = async (data, userId, email, name) => {
  const aiObj = { ...data };
  const submitted = fsOtherRef.Timestamp.now();
  aiObj.owner = userId;
  aiObj.submitted = submitted;
  aiObj.email = email;
  const { goalId, contributor, actionItem } = aiObj;

  createMessage(contributor, name, actionItem, goalId);

  const item = 'actionItemNotifications';
  const notificationObj = {
    email,
    submitted,
    goalId,
  };
  updateNotifications(contributor, item, notificationObj);

  const actionItemRef = firestoreRef.collection('ActionItems');
  return actionItemRef.add(aiObj);
};
