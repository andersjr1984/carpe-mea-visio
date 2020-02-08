const { firestoreRef, fsOtherRef } = require('../utils/admin');
const { updateNotifications } = require('../utils/updateNotifications');

const notifyTheUsers = async (email, goalId, submitted) => {
  const goalRef = firestoreRef.collection('Goals').doc(goalId);
  const goalData = await goalRef.get();
  const goal = goalData.data();
  const { conList } = goal;
  const item = 'replyNotifications';
  const notificationObj = {
    email,
    goalId,
    submitted,
  };
  conList.forEach((contributor) => {
    if (contributor !== email) updateNotifications(contributor, item, notificationObj);
  });
};

exports.submitReplyFun = async (data, userId, email) => {
  const submitted = fsOtherRef.Timestamp.now();
  const replyObj = { ...data };
  replyObj.owner = userId;
  replyObj.submitted = submitted;
  replyObj.email = email;
  const { goalId } = replyObj;

  notifyTheUsers(email, goalId, submitted);

  const replyRef = firestoreRef.collection('Replies');
  return replyRef.add(replyObj);
};
