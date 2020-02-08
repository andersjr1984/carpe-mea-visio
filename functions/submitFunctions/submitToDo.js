const { firestoreRef, fsOtherRef } = require('../utils/admin');

exports.submitToDoFun = async (data, userId, email) => {
  const {
    conList,
  } = data;

  const postObj = { ...data };
  const submitted = fsOtherRef.Timestamp.now();
  postObj.owner = userId;
  postObj.ownerEmail = email;
  postObj.verifiedCon = [email];
  postObj.unverifiedCon = [];
  postObj.conList = conList.concat(email);
  postObj.submitted = submitted;

  const toDoRef = firestoreRef.collection('ToDo');
  return toDoRef.add(postObj);
};
