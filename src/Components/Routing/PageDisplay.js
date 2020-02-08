import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Home from '../Home/Home';
import { NavBar } from './NavBar';
import LogIn from '../LogIn/LogIn';
import Unsubscribe from '../Unsubscribe/Unsubscribe';

const PageDisplay = () => (
  <BrowserRouter>
    <Route component={NavBar} />
    <Switch>
      <Route
        exact
        path="/LogIn"
        component={LogIn}
      />
      <Route
        path="/Unsubscribe/:unsubId"
        component={Unsubscribe}
      />
      <Route
        path="/"
        component={Home}
      />
    </Switch>
    {/* todo: Contact Info */}
  </BrowserRouter>
);

export default PageDisplay;
