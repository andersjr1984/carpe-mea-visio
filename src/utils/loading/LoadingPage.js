import React from 'react';
import './LoadingPage.css';

export const LoadingPage = (props) => {
  const { contained, message } = props;
  const isContained = contained ? 'loadingContained' : 'loadingFullPage';
  return (
    <div className={isContained}>
      <div className="spinHolderPage">
        <Spinner message={message} />
      </div>
    </div>
  );
};

export const LoadingIcon = ({ message }) => (
  <div className="spinHolderIcon">
    <Spinner />{message && ` - ${message}`}
  </div>
);

const Spinner = ({ message }) => (
  <div className="theSpins">
    <div className="spinners initial">
      {message && <span>{message}</span>}
    </div>
    <div className="spinners secondary" />
    <div className="spinners tertiary" />
  </div>
);
