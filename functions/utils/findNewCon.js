const { admin } = require('./admin');
const { addConGoal } = require('../submitFunctions/createMessage');

const findNewCon = async (newGoal, prevGoal, id) => {
  const {
    conList,
    ownerEmail,
    shortDesc,
    owner,
    targetDate,
    submitted,
  } = newGoal;

  const prevConList = prevGoal.conList;

  const userRecord = await admin.auth().getUserByEmail(ownerEmail);
  const ownerName = userRecord.displayName || ownerEmail;

  const conListObj = {
    ownerEmail,
    shortDesc,
    ownerId: owner,
    id,
    ownerName,
    targetDate,
    submitted,
  };

  for (let i = 0; i < conList.length; i += 1) {
    const con = conList[i];
    if (!prevConList.includes(con)) return addConGoal(con, conListObj);
  }
  return null;
};

exports.findNewCon = findNewCon;
