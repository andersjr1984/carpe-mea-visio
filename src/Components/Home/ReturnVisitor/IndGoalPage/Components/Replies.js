import React from 'react';
import { Button, Accordion, Card } from 'react-bootstrap';

const Replies = ({ replies }) => {
  const sortedReplies = [...replies].sort((a, b) => b.submitted - a.submitted);
  return (
    <>
      <h2>Replies</h2>
      <Accordion className="goal-responses">
        {sortedReplies.map((reply) => <IndReply reply={reply} key={reply.id} />)}
      </Accordion>
    </>
  );
};

const IndReply = ({ reply }) => (
  <Card className="bg-dark text-white">
    <Card.Header>
      <Accordion.Toggle as={Button} variant="link" eventKey={reply.id}>
        {`${reply.email} responded at ${reply.submitted.toLocaleDateString()}`}
      </Accordion.Toggle>
    </Card.Header>
    <Accordion.Collapse eventKey={reply.id}>
      <Card.Body>{reply.response}</Card.Body>
    </Accordion.Collapse>
  </Card>
);

export default Replies;
