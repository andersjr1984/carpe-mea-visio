import React, { useEffect, useState } from 'react';
import { LoadingPage } from '../../../../utils/loading/LoadingPage';
import GoalDisplay from './Components/GoalDisplay/GoalDisplay';
import firebase from '../../../../utils/firebase';
import convertCreated from '../../../../utils/convertCreated';
import './IndGoalPage.css';
import Replies from './Components/Replies';
import SubmitItems from './Components/SubmitItems';
import ActionItems from './Components/ActionItems';

const IndGoalPage = ({ goals, goalId }) => {
  const [replies, setReplies] = useState([]);
  const [actionItems, setAI] = useState([]);
  const [goal, setGoal] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // even though both do the same thing, need two if else statements
    if (!goal) {
      setLoading(false);
    } else if (goal && Object.keys(goal).length !== 0) { // triggers error if there is no goal
      setLoading(false);
    }
  }, [goal]);

  useEffect(() => {
    // check to see if we have received the goals yet
    if (goals.length > 0 && goalId) {
      // if we have goals, move forward with setting the goal
      const tempGoal = goals.find((currGoal) => currGoal.id === goalId);
      setGoal(tempGoal);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [goals, goalId]);

  useEffect(() => {
    const updateReplies = (querySnapshot) => {
      const replyArr = querySnapshot.docs.map((doc) => {
        const document = doc.data();
        const tempDate = convertCreated(document.submitted);
        document.submitted = tempDate.toDate();
        document.id = doc.id;
        return document;
      });

      setReplies(replyArr);
    };

    const updateAI = (querySnapshot) => {
      const aiArr = querySnapshot.docs.map((doc) => {
        const document = doc.data();
        const tempDate = convertCreated(document.submitted);
        document.submitted = tempDate.toDate();
        document.id = doc.id;
        return document;
      });

      setAI(aiArr);
    };

    const db = firebase.firestore();
    const replyRef = db.collection('Replies').where('goalId', '==', goalId);
    // if there is no goal, skip this step.
    const replySub = goal
      ? (Object.keys(goal).length > 0 && goalId) && replyRef.onSnapshot(updateReplies)
      : undefined;
    const aiRef = db.collection('ActionItems').where('goalId', '==', goalId);
    // if there is no goal, skip this step.
    const aiSub = goal
      ? (Object.keys(goal).length > 0 && goalId) && aiRef.onSnapshot(updateAI)
      : undefined;

    return () => {
      // test to make sure there is a subscription before unsubscribing
      replySub && replySub();
      aiSub && aiSub();
    };
  }, [goal, goalId]);

  if (loading) return <LoadingPage message="Loading Goal" contained />;

  if (!goal) return <h3>Having trouble retrieving that goal.</h3>;

  const { vision, conList } = goal;
  const color = vision ? 'white' : 'black';

  return (
    <div className="goal-page" style={{ color }}>
      {vision && <GoalBackground url={vision.url} />}
      <GoalDisplay goal={goal} />
      {replies.length > 0 && <Replies replies={replies} />}
      {actionItems.length > 0 && <ActionItems actionItems={actionItems} />}
      <h2>Submit New Items</h2>
      <SubmitItems goalId={goalId} conList={conList} />
    </div>
  );
};

const GoalBackground = ({ url }) => (
  <div className="vision-image">
    <div className="background-image" style={{ backgroundImage: `url(${url})`, opacity: '30%' }} />
  </div>
);

export default IndGoalPage;
