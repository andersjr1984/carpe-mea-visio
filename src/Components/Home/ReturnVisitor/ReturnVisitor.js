/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useState, useEffect, useContext,
} from 'react';
import { Switch, Route } from 'react-router-dom';
import Slider from '../../../utils/slider/Slider';
import Timeline from './Timeline/Timeline';
import NewGoal from './NewGoal/NewGoal';
import './ReturnVisitor.css';
import { UserData } from '../../../App';
import firebase from '../../../utils/firebase';
import convertCreated from '../../../utils/convertCreated';
import GoalPage from './GoalPage/GoalPage';
import IndGoalPage from './IndGoalPage/IndGoalPage';
import VisionBoard from './VisionBoard/VisionBoard';
import Notifications from './Notifications/Notifications';
import VerifyEmail from './VerifyEmail/VerifyEmail';
import Dashboard from './Dashboard/Dashboard';

const ReturnVisitor = () => {
  const [termIndex, setTI] = useState(0);
  const [imageList, setIL] = useState([]);
  const [myGoals, setMG] = useState([]);
  const [contGoals, setCG] = useState([]);
  const [myToDo, setMT] = useState([]);
  const { userId, email } = useContext(UserData);
  const termArr = ['All', 'Short', 'Medium', 'Long', 'Past'];
  const db = firebase.firestore();

  const nextTerm = () => {
    if (termIndex < termArr.length - 1) return setTI(termIndex + 1);
    return setTI(0);
  };

  useEffect(() => {
    const convertData = (querySnapshot) => querySnapshot.docs.map((doc) => {
      const document = doc.data();
      document.id = doc.id;
      const tempDate = convertCreated(document.targetDate);
      document.targetDate = tempDate.toDate();
      if (document.completed) {
        const tempComp = convertCreated(document.completed);
        document.completed = tempComp.toDate();
      }
      return document;
    });

    const updateCons = (querySnapshot) => {
      const goals = convertData(querySnapshot);
      setMG(goals.filter((goal) => goal.owner === userId));
      setCG(goals.filter((goal) => goal.owner !== userId));
    };

    const updateToDo = (querySnapshot) => {
      const tempToDo = querySnapshot.docs.map((doc) => {
        const document = doc.data();
        const tempDate = convertCreated(document.submitted);
        document.submitted = tempDate.toDate();
        if (document.completed) {
          const tempComp = convertCreated(document.completed);
          document.completed = tempComp.toDate();
        }
        document.id = doc.id;
        return document;
      }).sort((a, b) => a.submitted - b.submitted);
      setMT(tempToDo);
    };

    const myConsRef = db.collection('Goals').where('conList', 'array-contains', email).orderBy('targetDate');
    const myConsSub = userId && myConsRef.onSnapshot(updateCons);

    const myToDoRef = db.collection('ToDo').where('conList', 'array-contains', email);
    const myToDoSub = userId && myToDoRef.onSnapshot(updateToDo);

    return () => {
      myConsSub();
      myToDoSub();
    };
  }, [userId]);

  useEffect(() => {
    const getImages = (list) => (
      list.map((goal) => {
        if (!goal.vision) return null;
        const tempVision = { ...goal.vision };
        tempVision.id = goal.id;
        return tempVision;
      }).filter((x) => x)
    );
    setIL(getImages(myGoals));
  }, [myGoals]);

  return (
    <div className="return-visitor">
      <Switch>
        <Route
          exact
          path="/"
          render={() => (
            <>
              <h1>Welcome Back!</h1>
              <VerifyEmail />
              <Dashboard
                goals={myGoals.concat(contGoals)}
                myToDo={myToDo}
              />
            </>
          )}
        />
        <Route
          exact
          path="/Visions"
          render={() => (
            <>
              {imageList && <VisionBoard imageList={imageList} />}
            </>
          )}
        />
        <Route
          exact
          path="/Goals/:goalId"
          render={({ match }) => <IndGoalPage goals={myGoals.concat(contGoals)} goalId={match.params.goalId} />}
        />
        <Route
          exact
          path="/AddGoal"
          render={() => (
            <NewGoal imageList={imageList} />
          )}
        />
        <Route
          exact
          path="/Notifications"
          render={() => <Notifications goals={myGoals.concat(contGoals)} />}
        />
        <Route
          path="/"
          render={() => (
            <>
              <TermSelect termArr={termArr} termIndex={termIndex} nextTerm={nextTerm} />
              <GoalsWithTerms termArr={termArr} termIndex={termIndex} myGoals={myGoals} contGoals={contGoals} />
            </>
          )}
        />
      </Switch>
    </div>
  );
};

const GoalsWithTerms = ({
  termArr, termIndex, myGoals, contGoals,
}) => {
  const term = termArr[termIndex];

  const goals = () => {
    if (term === 'All') {
      const allGoals = myGoals.concat(contGoals);
      return allGoals.sort((a, b) => a.targetDate - b.targetDate);
    }
    const goalList = [];
    const now = new Date();
    const medium = new Date(now.getFullYear(), now.getMonth() + 6, now.getDate());
    const short = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());

    myGoals.concat(contGoals).forEach((doc) => {
      const { targetDate } = doc;
      if (targetDate > medium) {
        term === 'Long' && goalList.push(doc);
      } else if (targetDate > short) {
        term === 'Medium' && goalList.push(doc);
      } else if (targetDate > now) {
        term === 'Short' && goalList.push(doc);
      } else if (targetDate < now) {
        term === 'Past' && goalList.push(doc);
      }
    });

    const sortedGL = goalList.sort((a, b) => a.targetDate - b.targetDate);
    return sortedGL;
  };

  return (
    <Switch>
      <Route
        exact
        path="/Goals"
        render={() => (
          <GoalPage goals={goals()} />
        )}
      />
      <Route
        exact
        path="/Roadmap"
        render={() => (
          <Timeline term={term} goals={goals()} />
        )}
      />
    </Switch>
  );
};

const TermSelect = ({
  termArr, termIndex, nextTerm,
}) => (
  <div className="term-selector">
    <h3>{termArr[termIndex]} Term</h3>
    <Slider index={termIndex} handleClick={nextTerm} options={termArr.length} />
  </div>
);

export default ReturnVisitor;
