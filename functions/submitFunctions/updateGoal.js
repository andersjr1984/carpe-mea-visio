const { firestoreRef } = require('../utils/admin');

exports.updateGoalFun = async (data, userId) => {
  const {
    id,
    item,
    value,
  } = data;
  const goalRef = firestoreRef.collection('Goals').doc(id);
  const goalData = await goalRef.get();
  const goal = goalData.data();
  if (goal.owner !== userId) return null;

  return goalRef.update(
    { [item]: value },
  );
};
