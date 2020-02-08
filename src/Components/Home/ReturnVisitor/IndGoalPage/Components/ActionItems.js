import React, { useContext } from 'react';
import {
  Button, Accordion, Card, AccordionToggle, AccordionCollapse,
} from 'react-bootstrap';
import { UserData } from '../../../../../App';

const ActionItems = ({ actionItems }) => {
  const { email } = useContext(UserData);
  const myAI = actionItems.filter((actionItem) => actionItem.contributor === email);
  const otherAI = actionItems.filter((actionItem) => actionItem.contributor !== email);
  return (
    <>
      <h2>Action Items</h2>
      {myAI.length > 0 && (
        <>
          <h4>My Action Items</h4>
          <Accordion className="action-items">
            {myAI.map((ai) => <DisplayAI ai={ai} key={ai.id} />)}
          </Accordion>
        </>
      )}
      {myAI.length > 0 && (
        <>
          <h4>Other Action Items</h4>
          <Accordion className="action-items">
            {otherAI.map((ai) => <DisplayAI ai={ai} key={ai.id} />)}
          </Accordion>
        </>
      )}
    </>
  );
};
const DisplayAI = ({ ai }) => {
  const {
    contributor,
    actionItem,
    submitted,
    id,
  } = ai;
  return (
    <Card className="bg-dark text-white goal-submissions">
      <Card.Header>
        <AccordionToggle as={Button} variant="link" eventKey={id}>
          {`${contributor} action item from  ${submitted.toLocaleDateString()}`}
        </AccordionToggle>
      </Card.Header>
      <AccordionCollapse eventKey={id}>
        <Card.Body>
          {actionItem}
        </Card.Body>
      </AccordionCollapse>
    </Card>
  );
};

export default ActionItems;
