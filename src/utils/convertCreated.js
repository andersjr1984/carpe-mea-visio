import firebase from './firebase';

const convertCreated = (timestamp) => {
  const { nanoseconds, seconds } = timestamp;
  return new firebase.firestore.Timestamp(seconds, nanoseconds);
};

export default convertCreated;
