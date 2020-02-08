/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useContext, useState, useEffect } from 'react';
import { Form, ButtonGroup, Button } from 'react-bootstrap';
import firebase from '../../../../../../utils/firebase';

import './GoalDisplay.css';
import Contributors from './Contributors';
import { UserData } from '../../../../../../App';
import {
  ChooseDate, AddContributor, validateEmail, EditNarrative,
} from '../../../NewGoal/NewGoal';
import { LoadingIcon } from '../../../../../../utils/loading/LoadingPage';

const updateGoal = async (updateObj) => {
  const updateGoalFun = firebase.functions().httpsCallable('updateGoal');
  try {
    await updateGoalFun(updateObj);
    return true;
  } catch (error) {
    return false;
  }
};

const GoalDisplay = ({ goal }) => {
  const [updateStatus, setUS] = useState(null);
  const [completing, setCompleting] = useState(false);
  const [message, setMessage] = useState(null);
  const { userId } = useContext(UserData);

  const {
    conList,
    narrative,
    ownerEmail,
    shortDesc,
    targetDate,
    verifiedCon,
    unverifiedCon,
    owner,
    id,
    completed,
  } = goal;

  const isOwner = userId === owner;

  const markComplete = async () => {
    setCompleting(true);
    const completeGoalFun = firebase.functions().httpsCallable('completeGoal');
    try {
      await completeGoalFun({ id });
    } catch (error) {
      setMessage('Error submitting completion.');
    }
    setCompleting(false);
  };

  return (
    <>
      <h3>{shortDesc}</h3>
      {updateStatus && <p className="update-status" onClick={() => setUS(null)}>{updateStatus}</p>}
      <p><b>Owner: </b>{ownerEmail}</p>
      <ShowDate targetDate={targetDate} owner={owner} id={id} setUS={setUS} isOwner={isOwner} />
      {completed
        ? completed.toLocaleDateString()
        : completing ? <LoadingIcon /> : <small id="complete-goal" onClick={markComplete}>Mark Complete</small>
      }
      {message && <small>{message}</small>}
      <ShowNarrative narrative={narrative} id={id} setUS={setUS} isOwner={isOwner} />
      {conList && conList.length > 0 && <Contributors ownerEmail={ownerEmail} conList={conList} verifiedCon={verifiedCon} unverifiedCon={unverifiedCon} />}
      {isOwner && <AddOrUpdateContributors conList={conList} id={id} setUS={setUS} />}
    </>
  );
};

const AddOrUpdateContributors = ({
  conList,
  id,
  setUS,
}) => {
  const [addUser, setAU] = useState(false);
  const [indCon, setIndCon] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { emailVerified } = useContext(UserData);

  const addCon = () => {
    setSubmitting(true);
    if (conList.includes(indCon) && !validateEmail(indCon)) return null;
    const updateObj = {
      id,
      item: 'conList',
      value: conList.concat(indCon),
    };

    const updateGoalFun = updateGoal(updateObj);
    if (updateGoalFun) {
      setUS('Contributors update successful.  Please allow a moment for changes to propegate.  Click to accept.');
      setIndCon('');
      setSubmitting(false);
      setAU(false);
    } else {
      setUS('Contributors update failed.  Please try again or contact support.  Click to accept.');
      setSubmitting(false);
    }
  };

  if (!addUser) return <p className="update-status" onClick={() => setAU(true)}>Add Contributor</p>;

  if (submitting) return <LoadingIcon />;

  return (
    <Form>
      <AddContributor
        emailVerified={emailVerified}
        indCon={indCon}
        setIndCon={setIndCon}
        addCon={addCon}
        setUS={setUS}
      />
      <Button size="sm" onClick={() => setAU(false)} variant="warning">Cancel</Button>
    </Form>
  );
};

const ShowDate = ({
  targetDate, id, setUS, isOwner,
}) => {
  const [tempTD, setTempTD] = useState(targetDate);
  const [updateTD, setUTD] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    const updateObj = {
      id,
      item: 'targetDate',
      value: firebase.firestore.Timestamp.fromDate(tempTD),
    };
    const updateGoalFun = await updateGoal(updateObj);
    if (updateGoalFun) {
      setUS('Target Date update successful.  Please allow a moment for changes to propegate.  Click to accept.');
      setSubmitting(false);
      setUTD(false);
    } else {
      setUS('Target Date update failed.  Please try again or contact support.  Click to accept.');
      setSubmitting(false);
    }
  };

  if (updateTD && isOwner) {
    return (
      <Form onSubmit={handleSubmit} className="target-date" style={{ marginBottom: '1rem' }}>
        <ChooseDate
          targetDate={tempTD}
          setTD={setTempTD}
        />
        {submitting
          ? <LoadingIcon />
          : (
            <ButtonGroup>
              <Button size="sm" variant="primary" type="submit">
                Accept
              </Button>
              <Button size="sm" variant="warning" onClick={() => setUTD(false)}>
                Cancel
              </Button>
            </ButtonGroup>
          )
        }
      </Form>
    );
  }

  return (
    <p className="target-date">
      <b>Target Date: </b>{targetDate.toLocaleDateString()}
      {isOwner && <small className="update-toggle" onClick={() => setUTD(true)}>Update?</small>}
    </p>
  );
};

const ShowNarrative = ({
  narrative,
  id,
  setUS,
  isOwner,
}) => {
  const [addOrUpdate, setAU] = useState(false);
  const [editNarr, setEN] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const hasNarrative = narrative !== '';

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitting(true);
    const updateObj = {
      id,
      item: 'narrative',
      value: editNarr,
    };
    const updateGoalFun = updateGoal(updateObj);
    if (updateGoalFun) {
      setUS('Narrative update successful.  Please allow a moment for changes to propegate.  Click to accept.');
      setEN('');
      setSubmitting(false);
      setAU(false);
    } else {
      setUS('Narrative update failed.  Please try again or contact support.  Click to accept.');
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (narrative !== '' && editNarr === '') setEN(narrative);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [narrative]);

  if (!addOrUpdate) {
    return (
      <>
        {hasNarrative && (
        <p>
          <b>Narrative: </b>{narrative}
        </p>
        )}
        {isOwner && <p className="update-status" onClick={() => setAU(true)}>Add or update narrative.</p>}
      </>
    );
  }

  if (submitting) return <LoadingIcon />;

  return (
    <Form onSubmit={handleSubmit}>
      <EditNarrative narrative={editNarr} setNar={setEN} />
      <ButtonGroup>
        <Button type="submit" size="sm">Submit Change</Button>
        <Button size="sm" variant="warning" onClick={() => setAU(false)}>Cancel</Button>
      </ButtonGroup>
    </Form>
  );
};

export default GoalDisplay;
