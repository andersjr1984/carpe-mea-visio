/* eslint-disable global-require */
const functions = require('firebase-functions');

exports.functions = functions;

const { testAuth } = require('./utils/testAuth');
const { firestoreRef, fsOtherRef } = require('./utils/admin');

exports.checkUpdate = functions.firestore.document('Goals/{goalId}').onUpdate(async (change) => {
  const newGoal = change.after.data();
  const {
    conList,
  } = newGoal;

  const prevGoal = change.before.data();
  const prevConList = prevGoal.conList;

  const { id } = change.after;

  if (conList.length > prevConList.length) {
    const { findNewCon } = require('./utils/findNewCon');
    return findNewCon(newGoal, prevGoal, id);
  }

  return null;
});

exports.submitGoal = functions.https.onCall(async (data, context) => {
  const { submitGoalFun } = require('./submitFunctions/submitGoal');

  const userId = testAuth(context);
  if (userId) {
    const email = context.auth.token.email || undefined;
    const name = context.auth.token.name || undefined;
    return submitGoalFun(data, userId, email, name);
  }
  return null;
});

exports.submitToDo = functions.https.onCall(async (data, context) => {
  const { submitToDoFun } = require('./submitFunctions/submitToDo');

  const userId = testAuth(context);
  if (userId) {
    const email = context.auth.token.email || undefined;
    const name = context.auth.token.name || undefined;
    return submitToDoFun(data, userId, email, name);
  }
  return null;
});

exports.completeToDo = functions.https.onCall(async (data, context) => {
  const { id } = data;
  const userId = testAuth(context);
  if (userId) {
    const todoRef = firestoreRef.collection('ToDo').doc(id);
    const completed = fsOtherRef.Timestamp.now();
    return todoRef.set({
      completed,
    }, { merge: true });
  }
  return null;
});

exports.completeGoal = functions.https.onCall(async (data, context) => {
  // todo: update notifications and send message
  const { id } = data;
  const userId = testAuth(context);
  if (userId) {
    const goalRef = firestoreRef.collection('Goals').doc(id);
    const completed = fsOtherRef.Timestamp.now();
    return goalRef.set({
      completed,
    }, { merge: true });
  }
  return null;
});

exports.submitActionItem = functions.https.onCall(async (data, context) => {
  const { submitActionItemFun } = require('./submitFunctions/submitActionItem');

  const userId = testAuth(context);
  if (userId) {
    const email = context.auth.token.email || null;
    const name = context.auth.token.name || null;
    return submitActionItemFun(data, userId, email, name);
  }
  return null;
});

exports.submitReply = functions.https.onCall(async (data, context) => {
  const { submitReplyFun } = require('./submitFunctions/submitReply');

  const userId = testAuth(context);
  if (userId) {
    const email = context.auth.token.email || data.email;
    return submitReplyFun(data, userId, email);
  }
  return null;
});

exports.updateGoal = functions.https.onCall(async (data, context) => {
  const { updateGoalFun } = require('./submitFunctions/updateGoal');

  const userId = testAuth(context);
  if (userId) {
    return updateGoalFun(data, userId);
  }
  return null;
});

exports.updateLV = functions.https.onCall(async (data, context) => {
  const { updateLVFun } = require('./userActions/updateLV');

  const userId = testAuth(context);
  if (userId) {
    return updateLVFun(userId);
  }
  return null;
});

exports.unsubscribe = functions.https.onCall(async (data) => {
  const { unsubId } = data;
  const { unsubscribeFun } = require('./userActions/unsubscribe');
  return unsubscribeFun(unsubId);
});

exports.requestVer = functions.https.onCall(async (data, context) => {
  const { requestVerFun } = require('./userActions/requestVer');
  const { contributor, email } = data;

  const userId = testAuth(context);
  if (userId) {
    if (email !== context.auth.token.email) return null;

    return requestVerFun(contributor, email);
  }
  return null;
});

exports.welcomeEmail = functions.auth.user().onCreate(async (user) => {
  const { welcomeEmailFun } = require('./userActions/welcomeEmail');
  const { convertFun } = require('./userActions/convert');

  convertFun(user);
  return welcomeEmailFun(user);
});

exports.requestVerEmailTrigger = functions.https.onCall(async (data, context) => {
  const { requestVerEmailTriggerFun } = require('./userActions/requestVerEmailTrigger');
  const userId = testAuth(context);
  if (userId) {
    const { email, name } = context.auth.token;
    if (!email) return 'User does not have email in system.';
    return requestVerEmailTriggerFun(email, name);
  }
  return 'Error retrieving your userId.';
});

exports.sendMessage = functions.https.onCall(async (data) => {
  const { sendMessageFun } = require('./userActions/sendMessage');

  return sendMessageFun(data);
});
