/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Alert } from 'react-bootstrap';
import { UserData } from '../../../../App';
import Slider from '../../../../utils/slider/Slider';

const GoalPage = ({ goals }) => {
  const goalChoice = ['All', 'My', 'Contributor'];
  const [goalIndex, setGI] = useState(0);
  const [sortedGoals, setSG] = useState([]);
  const { userId } = useContext(UserData);

  const nextTerm = () => {
    if (goalIndex < goalChoice.length - 1) return setGI(goalIndex + 1);
    return setGI(0);
  };

  useEffect(() => {
    const createGL = () => {
      switch (goalChoice[goalIndex]) {
        case 'My':
          return goals.map((goal) => (goal.owner === userId ? goal : null)).filter((x) => x);
        case 'Contributor':
          return goals.map((goal) => (goal.owner !== userId ? goal : null)).filter((x) => x);
        default:
          return [...goals];
      }
    };

    if (goals.length > 0) {
      setSG(createGL().sort((a, b) => a.targetDate - b.targetDate));
    } else setSG([]);
  }, [goalIndex, goals]);

  return (
    <>
      <h1>Goals</h1>
      {goals.length > 0 && <CatSelector goalIndex={goalIndex} nextTerm={nextTerm} goalChoice={goalChoice} />}
      {sortedGoals.length > 0
        ? sortedGoals.map((goal) => <IndGoalDisplay goal={goal} key={`${goalChoice[goalIndex]}-${goal.id}`} />)
        : <h5>No goals to display</h5>
      }
    </>
  );
};

const IndGoalDisplay = ({ goal }) => (
  <Alert variant="secondary">
    <Alert.Heading><Link to={`Goals/${goal.id}`}>{goal.shortDesc}</Link></Alert.Heading>
    <p><b>Target Date: </b>{goal.targetDate.toLocaleDateString()}</p>
  </Alert>
);

const CatSelector = ({ goalIndex, nextTerm, goalChoice }) => (
  <>
    <h3>{goalChoice[goalIndex]} Goals</h3>
    <Slider index={goalIndex} handleClick={nextTerm} options={goalChoice.length} />
  </>
);

export default GoalPage;
