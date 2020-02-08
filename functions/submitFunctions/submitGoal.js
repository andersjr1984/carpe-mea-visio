const { addConGoal } = require('./createMessage');

const { firestoreRef, fsOtherRef } = require('../utils/admin');

const getUnsubId = async (email) => {
  // give user an option to unsubscribe
  const unsubRef = firestoreRef.collection('unsub');
  const unsubSearch = unsubRef.where('email', '==', email);
  const unsubData = await unsubSearch.get();
  if (unsubData.empty) {
    const unsubSet = await unsubRef.add({ email });
    return unsubSet.id;
  }
  return unsubData.docs[0].id;
};

exports.getUnsubId = getUnsubId;

const checkDND = async (email) => {
  // do not send email if user has unsubscribed
  const pageInfo = firestoreRef.collection('PageInfo');
  const dndRef = pageInfo.doc('dndList');
  const dndListData = await dndRef.get();
  const dndList = dndListData.data();
  return dndList.unsubbed.includes(email);
};

exports.checkDND = checkDND;

exports.submitGoalFun = async (data, userId, email, ownerName) => {
  const {
    conList,
    shortDesc,
    targetDate,
  } = data;

  const postObj = { ...data };
  const submitted = fsOtherRef.Timestamp.now();
  postObj.owner = userId;
  postObj.verifiedCon = [email];
  postObj.unverifiedCon = [];
  postObj.conList = conList.concat(email);
  postObj.submitted = submitted;

  const goalRef = firestoreRef.collection('Goals');
  const goalWrite = await goalRef.add(postObj);
  const goalId = goalWrite.id;
  if (email) {
    const conListObj = {
      ownerEmail: email,
      shortDesc,
      ownerId: userId,
      id: goalId,
      ownerName,
      targetDate,
      submitted,
    };
    conList.forEach((contributor) => addConGoal(contributor, conListObj));
  }
  return goalId;
};
