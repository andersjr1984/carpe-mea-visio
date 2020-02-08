const { firestoreRef, admin, fsOtherRef } = require('../utils/admin');
const { updateNotifications } = require('../utils/updateNotifications');
const { getUnsubId, checkDND } = require('./submitGoal');

const createMessage = async (contributor, ownerName, shortDesc, conName, id) => {
  const pageUrl = 'https://carpemeavisio.com';
  const pageLink = `<a href="${pageUrl}">Carpe Mea Visio</a>`;
  const goalLink = `<a href="${pageUrl}/Goals/${id}">${shortDesc}</a>`;
  const unsubId = await getUnsubId(contributor);
  return `
    <html>
      <p>Greetings ${conName}</p>
      <p>${ownerName} has requested you contribute to meeting a new goal!</p>
      <p>Goal: ${goalLink}</p>
      <p>Please visit ${pageLink}.</p>
      <p>
        Thank you from the Carpe Mea Visio team. If you feel you received this email by mistake, please reply to this message.
      </p>
      <img src="https://carpemeavisio.com/logo.png" /><br />
      <small><a href="${pageUrl}/Unsubscribe/${unsubId}">Unsubscribe</a></small>
    </html>
  `;
};

const sendMessage = async (goal, ownerName, conName, id) => {
  const {
    shortDesc,
    contributor,
  } = goal;
  if (await checkDND(contributor)) return null;

  const subject = ownerName
    ? `${ownerName} has requested your help in achieving a goal!`
    : 'You have received a collaboration request on Carpe Mea Visio!';

  const html = await createMessage(contributor, ownerName, shortDesc, conName, id);
  const mailRef = firestoreRef.collection('mail');
  return mailRef.add({
    message: {
      html,
      subject,
    },
    to: contributor,
    replyTo: 'admin@carpemeavisio.com',
  });
};

const addConGoal = async (contributor, conListObj) => {
  const {
    ownerEmail,
    shortDesc,
    ownerId,
    id,
    ownerName,
    targetDate,
    submitted,
  } = conListObj;

  if (ownerEmail === contributor) return null;

  const item = 'goalNotifications';
  const notificationObj = {
    email: ownerEmail,
    submitted,
    goalId: id,
  };
  updateNotifications(contributor, item, notificationObj);

  const conRef = firestoreRef.collection('Goals').doc(id);
  let verified = false;
  const goal = {
    ownerEmail,
    shortDesc,
    ownerId,
    id,
    contributor,
    targetDate,
    accepted: false,
  };
  let conName;
  try {
    const userData = await admin.auth().getUserByEmail(contributor);
    verified = true;
    conName = userData.displayName || 'Valued User';
  } catch (error) {
    conName = 'Valued User';
  }
  sendMessage(goal, ownerName, conName, id);

  const conArr = verified ? 'verifiedCon' : 'unverifiedCon';
  return conRef.update({
    [conArr]: fsOtherRef.FieldValue.arrayUnion(contributor),
  });
};
exports.addConGoal = addConGoal;
