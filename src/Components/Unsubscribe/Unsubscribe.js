import React, { useEffect, useState } from 'react';
import firebase from '../../utils/firebase';
import { LoadingPage } from '../../utils/loading/LoadingPage';

const Unsubscribe = ({ match }) => {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const { unsubId } = match.params;

  useEffect(() => {
    const unsubscribeUser = async () => {
      const unsubFun = firebase.functions().httpsCallable('unsubscribe');
      try {
        await unsubFun({ unsubId });
      } catch (error) {
        setMessage('Error unsubscribing.');
      }
      setLoading(false);
    };

    if (unsubId) unsubscribeUser();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unsubId]);

  return (
    <div className="home">
      {loading
        ? <LoadingPage contained message="Unsubscribing" />
        : <h1>{message || 'You have been unsubscribed. Thank you.'}</h1>}
    </div>
  );
};

export default Unsubscribe;
