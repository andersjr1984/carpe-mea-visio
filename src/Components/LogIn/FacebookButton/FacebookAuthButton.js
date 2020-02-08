import React from 'react';
import firebase, { auth } from '../../../utils/firebase';
import fbIcon from './fbIcon.png';

// eslint-disable-next-line import/prefer-default-export
export const FacebookAuthButton = (props) => {
  const fbSignIn = async () => {
    // eslint-disable-next-line import/no-named-as-default-member
    const authProRef = new firebase.auth.FacebookAuthProvider();
    try {
      await auth.signInWithPopup(authProRef);
      props.setRedirect(true);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  return (
    // eslint-disable-next-line
    <div className="fb-auth-button" onClick={fbSignIn}>
      <div className="logo-container">
        <img src={fbIcon} alt="facebook logo" />
      </div>
      <span className="button-text">
        Continue with Facebook
      </span>
    </div>
  );
};
