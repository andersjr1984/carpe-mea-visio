const { firestoreRef, fsOtherRef } = require('../utils/admin');

exports.unsubscribeFun = async (unsubId) => {
  const unsubRef = firestoreRef.collection('unsub').doc(unsubId);
  const unsubData = await unsubRef.get();
  if (!unsubData.exists) return true;
  const { email } = unsubData.data();
  const dndRef = firestoreRef.collection('PageInfo').doc('dndList');
  const updateDND = dndRef.update({
    unsubbed: fsOtherRef.FieldValue.arrayUnion(email),
  });
  const deleteUnsub = unsubRef.delete();
  await Promise.all([updateDND, deleteUnsub]);
  return true;
};
