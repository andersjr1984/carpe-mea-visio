import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import './LogIn.css';
import { Form, Button, ButtonToolbar } from 'react-bootstrap';
import firebase from '../../utils/firebase';
import logo from '../../logo.png';

import GoogleAuthButton from './GoogleButton/GoogleAuthButton';

const LogIn = () => {
  const [redirect, setRedirect] = useState(false);

  if (redirect) {
    return <Redirect to="/" />;
  }
  return (
    <div className="log-in">
      <Helmet id="Carpe Mea Visio Login">
        <title>Join the community</title>
        <meta name="description" content="Carpe Mea Visio Login" />
        <meta property="og:title" content="Carpe Mea Visio Login" />
      </Helmet>
      <img src={logo} alt="Carpe Mea Visio" />
      <EmailPassAuth setRedirect={setRedirect} />
      <SocialAuth setRedirect={setRedirect} />
    </div>
  );
};

const SocialAuth = ({ setRedirect }) => (
  <ButtonToolbar>
    <GoogleAuthButton
      setRedirect={setRedirect}
    />
  </ButtonToolbar>
);

const EmailPassAuth = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPass] = useState('');
  const [message, setMessage] = useState(undefined);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newOrExisting = event.target.id;
    if (newOrExisting === 'new') {
      try {
        // eslint-disable-next-line import/no-named-as-default-member
        await firebase.auth().createUserWithEmailAndPassword(email, password);
        return props.setRedirect(true);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        setMessage(error.message);
      }
    } else if (newOrExisting === 'existing') {
      try {
        // eslint-disable-next-line import/no-named-as-default-member
        await firebase.auth().signInWithEmailAndPassword(email, password);
        return props.setRedirect(true);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        setMessage(error.message);
      }
    } else {
      setMessage('An unknown error has occurred. Please contact administrator if this continues.');
    }
  };

  return (
    <>
      <h3>Log-in Options:</h3>
      {message && <h5>{message}</h5>}
      <Form>
        <Form.Group controlId="formBasicEmail">
          <Form.Label><i className="fas fa-at" /></Form.Label>
          <Form.Control
            autoComplete="email"
            type="email"
            placeholder="Enter email"
            value={email}
            name="email"
            onChange={(event) => setEmail(event.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="formBasicPassword">
          <Form.Label><i className="fas fa-lock" /></Form.Label>
          <Form.Control
            type="password"
            autoComplete="current-password"
            placeholder="Password"
            value={password}
            name="password"
            onChange={(event) => setPass(event.target.value)}
          />
        </Form.Group>
        <ButtonToolbar>
          <Button
            variant="outline-success"
            size="sm"
            id="existing"
            onClick={(event) => handleSubmit(event)}
          >
            Sign In
          </Button>
          <Button
            variant="outline-success"
            size="sm"
            id="new"
            onClick={(event) => handleSubmit(event)}
          >
            Create
          </Button>
        </ButtonToolbar>
      </Form>
    </>
  );
};

export default LogIn;
