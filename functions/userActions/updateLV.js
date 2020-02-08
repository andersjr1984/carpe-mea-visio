const { firestoreRef, fsOtherRef } = require('../utils/admin');

exports.updateLVFun = async (userId) => {
  const userRef = firestoreRef.collection('Notifications').doc(userId);
  const lastViewed = fsOtherRef.Timestamp.now();
  return userRef.set({ lastViewed }, { merge: true });
};
