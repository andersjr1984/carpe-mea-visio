const testAuth = (context) => {
  if (!context.auth) return null;
  // set the userId to add to postInfo
  const userId = context.auth.uid;
  // escape if there is no user
  if (!userId) return null;

  return userId;
};

exports.testAuth = testAuth;
