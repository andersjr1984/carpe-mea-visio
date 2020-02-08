import React, { useState } from 'react';
import { Form, Button, ButtonGroup } from 'react-bootstrap';
import { LoadingPage } from '../../utils/loading/LoadingPage';

import firebase from '../../utils/firebase';

import './Contact.css';

const Contact = () => (
  <div className="contact">
    <About />
    <ContactMe />
  </div>
);

const About = () => {
  const myPhotoUrl = 'https://firebasestorage.googleapis.com/v0/b/digital-destination-94720.appspot.com/o/Rhb6nHKNAxhxziAsv4nbApVSy4f2%2FProfilePics%2FTG7KP86a?alt=media&token=ab7753b0-9cef-46bc-9ff5-bbbf77986391';
  const myBioPt1 = 'Thank you for visiting Carpe Mea Visio!  This has been a massive work in progress and I am very excited to deploy it to the masses.';

  return (
    <div className="about">
      <h5>About Me:</h5>
      <img src={myPhotoUrl} alt="Creator of Carpe Mea Visio" align="left" />
      <p>{myBioPt1}</p>
    </div>
  );
};

const ContactMe = () => (
  <div className="contact-container">
    <h5>Questions? Comments? Drop me a message!</h5>
    <ContactForm />
  </div>
);

const ContactForm = () => {
  const [email, setEmail] = useState('');
  const [subject, setSub] = useState('');
  const [text, setText] = useState('');
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);

  const reset = () => {
    setEmail('');
    setSub('');
    setText('');
    setError(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSending(true);
    const messageObj = {
      email,
      subject,
      text,
    };
    const sendMessageFun = firebase.functions().httpsCallable('sendMessage');
    try {
      await sendMessageFun(messageObj);
      reset();
      setError('Message sent successfully!');
      setSending(false);
    } catch {
      setError('Whoops! There was an error sending message.');
      setSending(false);
    }
  };

  if (sending) return <LoadingPage message="Sending" contained />;

  return (
    <Form className="contact-form" onSubmit={handleSubmit}>
      {error && <small>{error}</small>}
      <Form.Group>
        <Form.Label>Email address (optional)</Form.Label>
        <Form.Control type="email" value={email} placeholder="name@example.com" onChange={(event) => setEmail(event.target.value)} />
      </Form.Group>
      <Form.Group>
        <Form.Label>Subject (required)</Form.Label>
        <Form.Control required value={subject} onChange={(event) => setSub(event.target.value)} />
      </Form.Group>
      <Form.Group>
        <Form.Label>Message (required)</Form.Label>
        <Form.Control as="textarea" value={text} rows="3" onChange={(event) => setText(event.target.value)} />
      </Form.Group>
      <ButtonGroup size="sm">
        <Button type="submit" variant="outline-primary">Send</Button>
        <Button onClick={reset} variant="outline-danger">Reset</Button>
      </ButtonGroup>
    </Form>
  );
};

export default Contact;
