import React, { useContext, useEffect } from 'react';
import {
  Accordion,
  Card,
  Button,
  Alert,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import firebase from '../../../../utils/firebase';
import { UserData } from '../../../../App';
import { LoadingPage, LoadingIcon } from '../../../../utils/loading/LoadingPage';
import convertCreated from '../../../../utils/convertCreated';

const Notifications = ({ goals }) => {
  const { notifications, originalLV, newNotifications } = useContext(UserData);
  const {
    actionItemNotifications,
    goalNotifications,
    replyNotifications,
    lastViewed,
  } = notifications;

  // function to convert array to make it easier to render
  const evaluateArrays = (notificationArray) => (
    notificationArray.map((notificationIn) => {
      const notification = { ...notificationIn };
      notification.submitted = convertCreated(notification.submitted).toDate();
      return notification;
    }).sort((a, b) => b.submitted - a.submitted)
  );

  // go through each type of notification array
  const ain = actionItemNotifications && evaluateArrays(actionItemNotifications);
  const gn = goalNotifications && evaluateArrays(goalNotifications);
  const rn = replyNotifications && evaluateArrays(replyNotifications);

  // determine number of new notifications
  const newAin = ain && ain.filter((not) => !not.viewed).length;
  const newGn = gn && gn.filter((not) => !not.viewed).length;
  const newRn = rn && rn.filter((not) => !not.viewed).length;

  useEffect(() => {
    // this will determine if we want to update the lastViewed item
    const updateLVFun = firebase.functions().httpsCallable('updateLV');
    // a new user will have no lastViewed item
    if (lastViewed) {
      // if there is a lastViewed item, determine if it has been updated in the past two minutes
      const now = new Date();
      const updateTime = new Date(now.getFullYear(), now.getMonth(), now.getDay(), now.getHours(), now.getMinutes() - 2, now.getSeconds());
      // convert the lastViewed to a date to compare
      const notTime = lastViewed.toDate();
      // compare the last time the lv was updated and dtermine if it needs updated again
      // also, only update if there are newNotifications
      if (notTime > updateTime && newNotifications) updateLVFun();
    } else {
      // only update if there are newNotifications, don't go crazy.
      newNotifications && updateLVFun();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastViewed]);

  // eslint-disable-next-line arrow-body-style
  useEffect(() => {
    return () => {
      // this is where we update the originalLV, upon leaving the current render of notifications
      originalLV.current = lastViewed;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!notifications || !goals) return (<LoadingPage contained message="Loading Notifications" />);

  return (
    <>
      <h1>Notifications</h1>
      <Accordion>
        <Card className="bg-dark text-white">
          {ain && (
            <>
              <Card.Header>
                <Accordion.Toggle as={Button} variant="link" eventKey="ActionItems">
                  Action Items{newAin > 0 && ` - ${newAin}`}
                </Accordion.Toggle>
              </Card.Header>
              <Accordion.Collapse eventKey="ActionItems">
                <Card.Body>
                  <ViewNotifications type="ActionItems" notifications={ain} goals={goals} />
                </Card.Body>
              </Accordion.Collapse>
            </>
          )}
          {gn && (
            <>
              <Card.Header>
                <Accordion.Toggle as={Button} variant="link" eventKey="Goals">
                  Goals{newGn > 0 && ` - ${newGn}`}
                </Accordion.Toggle>
              </Card.Header>
              <Accordion.Collapse eventKey="Goals">
                <Card.Body>
                  <ViewNotifications type="Goals" notifications={gn} goals={goals} />
                </Card.Body>
              </Accordion.Collapse>
            </>
          )}
          {rn && (
            <>
              <Card.Header>
                <Accordion.Toggle as={Button} variant="link" eventKey="Replies">
                  Replies{newRn > 0 && ` - ${newRn}`}
                </Accordion.Toggle>
              </Card.Header>
              <Accordion.Collapse eventKey="Replies">
                <Card.Body>
                  <ViewNotifications type="Replies" notifications={rn} goals={goals} />
                </Card.Body>
              </Accordion.Collapse>
            </>
          )}
        </Card>
      </Accordion>
    </>
  );
};

// todo: continue here
const ViewNotifications = ({ type, notifications, goals }) => (
  notifications.map((notification) => {
    const { goalId, submitted } = notification;
    const goal = goals.find((indGoal) => indGoal.id === goalId);
    const key = `${type}-${goalId}-${submitted}`;

    if (!goal) return <LoadingIcon key={key} />;

    return (
      <IndNotification type={type} notification={notification} goal={goal} key={key} />
    );
  })
);

const IndNotification = ({ type, notification, goal }) => {
  const { shortDesc } = goal;
  const {
    viewed,
    goalId,
    email,
    submitted,
  } = notification;

  const goalLink = `/Goals/${goalId}`;

  const message = () => {
    switch (type) {
      case 'ActionItems':
        return `${email} has requested your help in acheiving ${shortDesc}`;
      case 'Goals':
        return `${email} has added you as a contributor to ${shortDesc}`;
      case 'Replies':
        return `${email} has replied to ${shortDesc}`;
      default:
        return `${email} has performed an unknown action on ${shortDesc}`;
    }
  };

  const notificationDate = submitted.toLocaleDateString();
  const notificationTime = submitted.toLocaleTimeString();

  const variant = viewed
    ? 'light'
    : 'info';

  return (
    <Link to={goalLink}>
      <Alert variant={variant}>
        {message()}<br />
        {`At ${notificationTime} on ${notificationDate}`}
      </Alert>
    </Link>
  );
};

export default Notifications;
