import React from 'react';
import './Welcome.css';
import {
  faSignInAlt,
  faHome,
  faRoad,
  faBullseye,
  faCheckCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import introduction from './Introduction/Introduction';
import setGoals from './SetGoals/SetGoals';
import roadmap from './Roadmap/Roadmap';
import vision from './Vision/Vision';
import collaborate from './Collaborate/Collaborate';

const pages = [
  introduction,
  setGoals,
  roadmap,
  vision,
  collaborate,
];

const Welcome = () => (
  <>
    <Introduction />
    <HowToStart />
  </>
);

const Introduction = () => (pages.map((page, index) => <Details {...page} side={index % 2 === 0 ? 'left' : 'right'} key={page.pageClass} />));

const Details = ({
  title, details, background, pageClass, side,
}) => (
  <div className={`main ${pageClass} ${side}`}>
    <div className="title">
      <div className="background" style={{ backgroundImage: `url(${background})` }} />
      {title}
    </div>
    <div className="details">
      {details}
    </div>
  </div>
);

const HowToStart = () => (
  <div className="main how-to">
    <h1>How do I get started?</h1>
    <p>The Carpe Mea Visio team asks you to create an account by clicking on the <Link to="/LogIn"><FontAwesomeIcon icon={faSignInAlt} /></Link> button in the navigation bar.</p>
    <p>Once you have created your account, you can explore the site and start adding goals. The icons follow the subsequent legend:</p>
    <p><FontAwesomeIcon icon={faHome} /> - Takes you to your vision board.</p>
    <p><FontAwesomeIcon icon={faRoad} /> - Takes you to your roadmap, showing a timeline of your goals.</p>
    <p><FontAwesomeIcon icon={faBullseye} /> - Takes you to a new goal page, allowing you to add goals.</p>
    <p><FontAwesomeIcon icon={faCheckCircle} /> - Takes you to a list of your goals, a simple way to view the details of each.</p>
  </div>
);

export default Welcome;
