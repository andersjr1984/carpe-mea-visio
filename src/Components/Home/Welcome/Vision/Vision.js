import React from 'react';
import chess from './chess.webp';

const visionTitle = (
  <h1>Add your vision</h1>
);

const visionDetails = (
  <p>
    Is there a picture that perfectly sums up your goals?  Add a vision to inspire you to reach your goals.
  </p>
);

const vision = {
  title: visionTitle,
  details: visionDetails,
  background: chess,
  pageClass: 'vision',
};

export default vision;
