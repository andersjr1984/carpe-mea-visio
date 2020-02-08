/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import firebase, { auth } from '../../../utils/firebase';
import googleLogo from './btn_google_dark_focus_ios.svg';

const GoogleAuthButton = (props) => {
  const googleSignIn = async () => {
    // eslint-disable-next-line import/no-named-as-default-member
    const authProRef = new firebase.auth.GoogleAuthProvider();
    try {
      await auth.signInWithPopup(authProRef);
      props.setRedirect(true);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  return (
    <div className="google-auth-button" onClick={googleSignIn}>
      <div className="logo-container">
        <img src={googleLogo} alt="google logo" />
      </div>
      <span className="button-text">
        Sign in with Google
      </span>
    </div>
  );
};

export default GoogleAuthButton;
