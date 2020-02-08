import React from 'react';
import vision from './vision.webp';

const introductionTitle = (
  <h1>Carpe Mea Visio <br />means<br /> Seize My Vision</h1>
);

const introductionDetails = (
  <div className="intro-details">
    <p>
      Carpe Mea Visio is the tool you will need to meet your goals and develop positive habits.
    </p>
    <ul>
      <li>Set your goals</li>
      <li>View your roadmap</li>
      <li>Add your vision</li>
      <li>Collaborate</li>
      <li>Break it down</li>
    </ul>
  </div>
);

const introduction = {
  title: introductionTitle,
  details: introductionDetails,
  background: vision,
  pageClass: 'introduction',
};

export default introduction;
