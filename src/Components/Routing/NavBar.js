/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useContext, useState } from 'react';
import './NavBar.css';

import { Link } from 'react-router-dom';
import {
  Navbar, Nav, OverlayTrigger, Tooltip,
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSignInAlt, faSignOutAlt, faBars, faRoad, faBullseye, faCheckCircle, faEnvelopeOpen, faEnvelope, faEye, faTachometerAlt, faHome,
} from '@fortawesome/free-solid-svg-icons';
import { auth } from '../../utils/firebase';
import { UserData } from '../../App';
import logo from '../../logo.png';


export const NavBar = () => {
  const [mobile, setMobile] = useState(false);
  const { userId, newNotifications } = useContext(UserData);

  const linkObjArr = [
    {
      key: 'home',
      link: '/',
      narr: 'Home',
      icon: faHome,
      className: 'icon',
      trigger: userId === null,
    },
    {
      key: 'dashboard',
      link: '/',
      narr: 'Dashboard',
      icon: faTachometerAlt,
      className: 'icon',
      trigger: userId !== null,
    },
    {
      key: 'vision',
      link: '/Visions',
      narr: 'Vision Board',
      icon: faEye,
      className: 'icon',
      trigger: userId !== null,
    },
    {
      key: 'roadmap',
      link: '/Roadmap',
      narr: 'My Roadmap',
      icon: faRoad,
      className: 'icon',
      trigger: userId !== null,
    },
    {
      key: 'addGoal',
      link: '/AddGoal',
      narr: 'Add Goal',
      icon: faBullseye,
      className: 'icon',
      trigger: userId !== null,
    },
    {
      key: 'goals',
      link: '/Goals',
      narr: 'My Goals',
      icon: faCheckCircle,
      className: 'icon',
      trigger: userId !== null,
    },
    {
      key: 'notifications',
      link: '/Notifications',
      narr: 'Notifications',
      icon: newNotifications ? faEnvelopeOpen : faEnvelope,
      className: `icon ${newNotifications && 'newNotifications'}`,
      trigger: userId !== null,
    },
  ];

  const mobileNav = mobile ? 'ml-auto mobile-nav mobile-nav-show' : 'ml-auto mobile-nav mobile-nav-hide';

  return (
    <Navbar fixed="top" bg="dark" variant="dark">
      <Link to="/"><Navbar.Brand><img src={logo} alt="logo" /> Carpe Mea Visio</Navbar.Brand></Link>
      <Nav className="ml-auto pc-nav">
        <PCNav linkObjArr={linkObjArr} />
        { userId ? <LogOutIcon /> : <LogInIcon />}
      </Nav>
      <Nav className={mobileNav}>
        <FontAwesomeIcon icon={faBars} onClick={() => setMobile(!mobile)} />
        <div className="mobile-dropdown">
          <MobileNav linkObjArr={linkObjArr} setMobile={setMobile} />
          { userId ? <MobLogOut setMobile={setMobile} /> : <MobLogIn setMobile={setMobile} />}
        </div>
        {mobile && <div className="cover" onClick={() => setMobile(false)} />}
      </Nav>
    </Navbar>
  );
};

const MobileNav = ({ linkObjArr, setMobile }) => linkObjArr.map((navObj) => {
  const {
    key, link, narr, icon, trigger, className,
  } = navObj;

  if (!trigger) return null;

  return (
    <Link to={link} key={key} onClick={() => setMobile(false)}>
      <FontAwesomeIcon icon={icon} className={className} /> - {narr}
    </Link>
  );
});

const MobLogIn = (props) => (
  <Link to="/LogIn" style={{ border: 'none' }} onClick={() => props.setMobile(false)}>
    <FontAwesomeIcon icon={faSignInAlt} className="icon" /> - Log In
  </Link>
);

const MobLogOut = (props) => (
  <Link to="/" style={{ border: 'none' }} onClick={() => { auth.signOut(); props.setMobile(false); }}>
    <FontAwesomeIcon icon={faSignOutAlt} className="icon" /> - Log Out
  </Link>
);

const PCNav = ({ linkObjArr }) => linkObjArr.map((navObj) => {
  const {
    key, link, narr, icon, trigger, className,
  } = navObj;

  if (!trigger) return null;

  return (
    <Link to={link} key={key}>
      <OverlayTrigger
        placement="left"
        overlay={(
          <Tooltip>
            {narr}
          </Tooltip>
        )}
      >
        <FontAwesomeIcon icon={icon} className={className} />
      </OverlayTrigger>
    </Link>
  );
});

const LogInIcon = () => (
  <Link to="/LogIn">
    <OverlayTrigger
      placement="left"
      overlay={(
        <Tooltip>
          Log In
        </Tooltip>
      )}
    >
      <FontAwesomeIcon icon={faSignInAlt} />
    </OverlayTrigger>
  </Link>
);

const LogOutIcon = () => (
  <Link to="/" onClick={() => auth.signOut()}>
    <OverlayTrigger
      placement="left"
      overlay={(
        <Tooltip>
          Log Out
        </Tooltip>
      )}
    >
      <FontAwesomeIcon icon={faSignOutAlt} />
    </OverlayTrigger>
  </Link>
);

export default NavBar;
