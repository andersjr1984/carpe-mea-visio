/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useContext, useState } from 'react';
import { UserData } from '../../../../App';
import firebase from '../../../../utils/firebase';
import { LoadingIcon } from '../../../../utils/loading/LoadingPage';

const VerifyEmail = () => {
  const [message, setMessage] = useState(undefined);
  const [requesting, setRequesting] = useState(false);
  const { emailVerified } = useContext(UserData);
  if (emailVerified) return null;

  const handleRequest = async () => {
    setRequesting(true);
    const requestVerEmailTrigger = firebase.functions().httpsCallable('requestVerEmailTrigger');
    const requestRet = await requestVerEmailTrigger();
    setMessage(requestRet.data);
    setRequesting(false);
  };

  if (requesting) return <LoadingIcon />;

  if (message) return <h6 className="req-ver" onClick={() => setMessage(undefined)}>{`${message} Click here to accept.`}</h6>;

  return (
    <h6 className="req-ver" onClick={handleRequest}>Your email is not verified.  Click here to request a verification email!</h6>
  );
};

export default VerifyEmail;
