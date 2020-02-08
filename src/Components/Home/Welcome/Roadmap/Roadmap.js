import React from 'react';
import road from './road.webp';

const roadmapTitle = (
  <h1>Develop a Roadmap</h1>
);

const roadmapDetails = (
  <p>
    Interactive tools to view your progress along the way.<br />Add milestones along the path to measure progress.
  </p>
);

const roadmap = {
  title: roadmapTitle,
  details: roadmapDetails,
  background: road,
  pageClass: 'roadmap',
};

export default roadmap;
