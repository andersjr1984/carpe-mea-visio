const { firestoreRef, fsOtherRef, admin } = require('./admin');

const updateNotifications = async (contributor, item, notificationObjIn) => {
  const notificationObj = { ...notificationObjIn };
  const userRecord = await admin.auth().getUserByEmail(contributor);
  if (!userRecord) return null;
  const { uid } = userRecord;
  const userRef = firestoreRef.collection('Notifications').doc(uid);
  try {
    const update = await userRef.update({
      [item]: fsOtherRef.FieldValue.arrayUnion(notificationObj),
    });
    return update;
  } catch (error) {
    const set = await userRef.set({ [item]: [notificationObj] }, { merge: true });
    return set;
  }
};

exports.updateNotifications = updateNotifications;
