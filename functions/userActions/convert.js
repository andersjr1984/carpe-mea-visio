/* eslint-disable max-len */
const { firestoreRef } = require('../utils/admin');

exports.convertFun = async (user) => {
  const { email, uid } = user;
  if (!email) return null;

  const tempRef = firestoreRef.collection('TempUsers').doc(email);
  const tempData = await tempRef.get();
  if (!tempData.exists) return null;

  const temp = { ...tempData.data() };
  const userRef = firestoreRef.collection('Users').doc(uid);
  const contribLoc = userRef.collection('Contributor').doc('Goals');
  const setData = contribLoc.set(temp);
  const deleteTemp = tempRef.delete();

  return Promise.all([setData, deleteTemp]);
};
