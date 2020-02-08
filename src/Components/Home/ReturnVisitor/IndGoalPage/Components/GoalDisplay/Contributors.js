/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useContext } from 'react';
import { Table } from 'react-bootstrap';
import firebase from '../../../../../../utils/firebase';
import { UserData } from '../../../../../../App';

const Contributors = ({
  ownerEmail, conList, verifiedCon, unverifiedCon,
}) => (
  <Table striped bordered hover variant="dark" className="contributors">
    <thead>
      <tr>
        <th>
        Contributor
        </th>
        <th>
        Verify?
        </th>
      </tr>
    </thead>
    <tbody>
      {conList.map((contributor) => <IndCon ownerEmail={ownerEmail} contributor={contributor} verifiedCon={verifiedCon} unverifiedCon={unverifiedCon} key={contributor} />)}
    </tbody>
  </Table>
);

const IndCon = ({
  ownerEmail, contributor, verifiedCon, unverifiedCon,
}) => {
  const [message, setMessage] = useState(<td>Checking Status</td>);
  const { email } = useContext(UserData);

  const requestVerification = async () => {
    setMessage(<td>Request Sent</td>);
    const requestVerFun = firebase.functions().httpsCallable('requestVer');
    try {
      await requestVerFun({ contributor, email });
    } catch (error) {
      setMessage(<td>User has received multiple request</td>);
    }
  };

  useState(() => {
    if (ownerEmail === contributor) {
      setMessage(<td>Project Owner!</td>);
    } else if (!verifiedCon && !unverifiedCon) {
      setMessage(<td>Awaiting Confirmations</td>);
    } else if (unverifiedCon.includes(contributor)) {
      if (ownerEmail === email) {
        setMessage(<td onClick={requestVerification} className="req-ver">Request Verification</td>);
      } else {
        setMessage(<td>Unverified</td>);
      }
    } else if (verifiedCon.includes(contributor)) {
      setMessage(<td>Verified!</td>);
    } else {
      setMessage(<td>Page may require refresh.</td>);
    }
  }, [verifiedCon, unverifiedCon]);

  return (
    <tr>
      <td>
        {contributor}
      </td>
      {message}
    </tr>
  );
};

export default Contributors;
