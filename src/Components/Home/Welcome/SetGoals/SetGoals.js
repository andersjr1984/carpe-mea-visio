import React from 'react';
import goals from './goals.webp';

const setGoalsTitle = (
  <h1>Choose your accomplishments and create a timeline.</h1>
);

const setGoalsDetails = (
  <p>
    Create your long-term (over one year), medium-term (between one month and a year), and short-term goals (less than one month) to track your progress.
  </p>
);

const setGoals = {
  title: setGoalsTitle,
  details: setGoalsDetails,
  background: goals,
  pageClass: 'setGoals',
};

export default setGoals;
