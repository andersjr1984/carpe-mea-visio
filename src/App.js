import React, {
  createContext,
  useEffect,
  useState,
  useRef,
} from 'react';
import firebase, { auth } from './utils/firebase';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import '@fortawesome/fontawesome-free/css/all.css';
import { LoadingPage } from './utils/loading/LoadingPage';
import PageDisplay from './Components/Routing/PageDisplay';

export const UserData = createContext();

const App = () => {
  const [userId, setUserId] = useState(null);
  const [emailVerified, setEV] = useState(false);
  const [email, setEmail] = useState(null);
  const [checkedCred, setCC] = useState(false);
  const [notifications, setNotifications] = useState({});
  const [newNotifications, setNN] = useState(false);
  const originalLV = useRef(null);
  const db = firebase.firestore();

  useEffect(() => {
    const updateNot = (notificationData) => {
      // this gets called whenever the notification item is changed in the db
      // test if there is notification data
      if (!notificationData.exists) return null;
      // have to ensure that newNotifications is false
      setNN(false);

      // unpack the notification data
      const notificationsIn = notificationData.data();
      // retrieve timestamp of when notifications were last viewed
      const { lastViewed } = notificationsIn;
      // on initial render, set originalLV equal to the lastViewed timestamp
      if (!originalLV.current) {
        originalLV.current = lastViewed || new Date(0);
      }
      // get list of all the array objects
      // this will also include the lastViewed key
      const notArrList = Object.keys(notificationsIn);
      // set up and run a for loop
      const notArrayCount = notArrList.length;
      for (let i = 0; i < notArrayCount; i += 1) {
        // do nothing when we are at the lastViewed item
        // eslint-disable-next-line no-continue
        if (notArrList[i] === 'lastViewed') continue;
        // get the notification array
        const notArr = notificationsIn[notArrList[i]];
        // set up and run a for loop
        const notLen = notArr.length;
        for (let j = 0; j < notLen; j += 1) {
          // when there is no originalLV or when the user has not seen notification
          if (!originalLV.current || notArr[j].submitted > originalLV.current) {
            // set the viewed item
            notArr[j].viewed = false;
            // if newNotifications has not been set, this sets it as true
            !newNotifications && setNN(true);
          } else {
            // otherwise, we set viewed as true
            notArr[j].viewed = true;
          }
        }
      }

      // set the notification object
      setNotifications(notificationsIn);
    };

    const myNotificationsRef = userId && db.collection('Notifications').doc(userId);
    const myNotificationsSub = userId && myNotificationsRef.onSnapshot(updateNot);

    return () => {
      myNotificationsSub && myNotificationsSub();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  useEffect(() => {
    const authListener = auth.onIdTokenChanged(async (user) => {
      if (user) {
        setUserId(user.uid);
        if (user.email) {
          setEV(user.emailVerified);
          setEmail(user.email);
        }
      } else {
        setUserId(null);
        setEV(false);
        setEmail(null);
      }
      setCC(true);
    });

    return () => {
      authListener && authListener();
    };
  }, []);

  if (!checkedCred) return <LoadingPage message="Checking Credentials" contained />;

  return (
    <UserData.Provider
      value={{
        userId,
        emailVerified,
        email,
        notifications,
        newNotifications,
        originalLV,
      }}
    >
      <PageDisplay />
    </UserData.Provider>
  );
};

export default App;
