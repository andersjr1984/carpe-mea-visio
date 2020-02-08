import React from 'react';
import collaborateImage from './collaborate.webp';

const collaborateTitle = (
  <h1>Collaborate</h1>
);

const collaborateDetails = (
  <p>
    A collaboration tool perfect for teams and to generate motivation.
    <br />
    Add friends to view your progress.
    <br />
    Invite teammates to contribute and add the goal to their timelines.
  </p>
);

const collaborate = {
  title: collaborateTitle,
  details: collaborateDetails,
  background: collaborateImage,
  pageClass: 'collaborate',
};

export default collaborate;
