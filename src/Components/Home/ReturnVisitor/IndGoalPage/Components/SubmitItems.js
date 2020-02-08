import React, { useState, useContext } from 'react';
import {
  Form, Row, Col, Button, Accordion, Card, AccordionToggle, AccordionCollapse,
} from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';
import { LoadingIcon } from '../../../../../utils/loading/LoadingPage';
import firebase from '../../../../../utils/firebase';
import { UserData } from '../../../../../App';

const SubmitItems = ({ goalId, conList }) => (
  <Accordion>
    <Card className="bg-dark text-white goal-submissions">
      <Card.Header>
        <AccordionToggle as={Button} variant="link" eventKey="submit-replies">
        Submit Reply
        </AccordionToggle>
      </Card.Header>
      <AccordionCollapse eventKey="submit-replies">
        <Card.Body>
          <SubmitReply goalId={goalId} />
        </Card.Body>
      </AccordionCollapse>
      <Card.Header>
        <AccordionToggle as={Button} variant="link" eventKey="submit-action">
        Submit Action Item
        </AccordionToggle>
      </Card.Header>
      <AccordionCollapse eventKey="submit-action">
        <Card.Body>
          <SubmitActionItem goalId={goalId} conList={conList} />
        </Card.Body>
      </AccordionCollapse>
    </Card>
  </Accordion>
);

const SubmitActionItem = ({ goalId, conList }) => {
  const [actionItem, setAI] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [contributor, setCon] = useState([]);
  const [message, setMessage] = useState(null);
  const { email } = useContext(UserData);
  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    if (contributor.length !== 1) {
      setMessage('Please add valid contributor');
      setSubmitting(false);
      return null;
    }
    if (actionItem === '') {
      setMessage('Please add action item.');
      setSubmitting(false);
      return null;
    }
    const actionItemFun = firebase.functions().httpsCallable('submitActionItem');
    try {
      await actionItemFun({
        actionItem,
        contributor: contributor[0],
        goalId,
        email,
      });
      setMessage(null);
      setAI('');
      setCon([]);
    } catch (error) {
      setMessage('Error submitting action item!');
    }
    setSubmitting(false);
  };
  return (
    <Form onSubmit={handleSubmit}>
      {message && <small>{message}</small>}
      <Form.Group as={Row}>
        <Form.Label column sm="2">
        Action Item:
        </Form.Label>
        <Col sm={10}>
          <Form.Control as="textarea" rows="3" value={actionItem} onChange={(event) => setAI(event.target.value)} />
        </Col>
      </Form.Group>
      <Form.Group as={Row}>
        <Form.Label column sm="2">
        Contributor:
        </Form.Label>
        <Form.Label column sm="10">
          <Typeahead id="choose-contributor" onChange={(selected) => setCon(selected)} options={conList} />
        </Form.Label>
      </Form.Group>
      {submitting
        ? <LoadingIcon />
        : <Button type="submit">Submit</Button>}
    </Form>
  );
};

const SubmitReply = ({ goalId }) => {
  const [response, setRe] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const { email } = useContext(UserData);
  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    const replyFun = firebase.functions().httpsCallable('submitReply');
    try {
      await replyFun({
        response,
        goalId,
        email,
      });
      setMessage(null);
      setRe('');
    } catch (error) {
      setMessage('Error submitting response!');
    }
    setSubmitting(false);
  };
  return (
    <Form onSubmit={handleSubmit}>
      {message && <small>{message}</small>}
      <Form.Group as={Row}>
        <Form.Label column sm="2">
        Response:
        </Form.Label>
        <Col sm={10}>
          <Form.Control as="textarea" rows="3" value={response} onChange={(event) => setRe(event.target.value)} />
        </Col>
      </Form.Group>
      {submitting
        ? <LoadingIcon />
        : <Button type="submit">Submit</Button>}
    </Form>
  );
};

export default SubmitItems;
