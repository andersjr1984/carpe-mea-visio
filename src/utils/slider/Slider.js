/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import './Slider.css';

const Slider = ({
  index, handleClick, options, sliderBG, circleBG,
}) => {
  const sliderWidth = `${60 + (options - 2) * 20}px`;
  const sliderStyle = {
    width: sliderWidth,
    background: sliderBG || '#010001',
  };

  const circleMarginLeft = `${index * 20}px`;
  const circleStyle = {
    marginLeft: circleMarginLeft,
    background: circleBG || '#BC5F04',
  };

  return (
    <div className="slider" onClick={handleClick} style={sliderStyle}>
      <div className="circle" style={circleStyle} />
    </div>
  );
};

export default Slider;
