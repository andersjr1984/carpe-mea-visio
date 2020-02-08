/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useRef, useEffect, useState, useContext,
} from 'react';
import * as d3 from 'd3';
import { Link } from 'react-router-dom';

import './Timeline.css';
import { UserData } from '../../../../App';
import Contributors from '../IndGoalPage/Components/GoalDisplay/Contributors';

const Timeline = ({ goals, term }) => {
  const [building, setBuilding] = useState(true);
  const [preview, setPreview] = useState(null);
  const [currLoc, setCL] = useState(0);

  const timelineAnchor = useRef('timeline');
  const svg = useRef(null);
  const axis = useRef(null);
  const pointsAdded = useRef(false);
  const width = 300;
  const height = 400;
  const now = new Date();
  const num = goals.length;

  const margin = {
    top: 10, right: 0, bottom: 10, left: 60,
  };

  const { userId } = useContext(UserData);

  const timeScale = () => {
    switch (term) {
      case 'Short':
        return [now, new Date(now.getFullYear(), now.getMonth() + 1, now.getDate())];
      case 'Medium':
        return [now, new Date(now.getFullYear(), now.getMonth() + 6, now.getDate())];
      case 'Past':
        return [new Date(now.getFullYear() - 2, now.getMonth(), now.getDate()), now];
      default:
        return [now, new Date(now.getFullYear() + 2, now.getMonth(), now.getDate())];
    }
  };

  const yScale = d3.scaleTime()
    .domain(timeScale())
    .range([0, height]);

  useEffect(() => {
    setBuilding(true);

    if (axis.current) d3.select('#curr-term').remove();

    const tickScaleMinor = () => {
      switch (term) {
        case 'Short':
          return d3.timeDay.every(1);
        case 'Medium':
          return d3.timeWeek.every(1);
        default:
          return d3.timeMonth.every(1);
      }
    };

    const tickScaleMajor = () => {
      switch (term) {
        case 'Short':
          return d3.timeDay.every(3);
        case 'Medium':
          return d3.timeWeek.every(3);
        default:
          return d3.timeMonth.every(2);
      }
    };

    const tickDisp = (d) => {
      switch (term) {
        case 'Medium':
          if (d3.timeWeek(d)) {
            return d3.timeWeek(d);
          }
          return null;
        case 'Long':
          if (d3.timeMonth(d)) {
            return d3.timeMonth(d);
          }
          return null;
        default:
          if (d3.timeDay(d)) {
            return d3.timeDay(d);
          }
          return null;
      }
    };

    const yAxis = d3.axisLeft(yScale)
      .ticks(tickScaleMinor())
      .tickSize(-width)
      .ticks(tickScaleMajor())
      .tickFormat((d) => tickDisp(d).toLocaleDateString());

    svg.current = d3.select(timelineAnchor.current).append('svg')
      .attr('id', 'curr-term')
      .attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .style('background', 'grey')
      .style('padding', '10px')
      .style('border-radius', '10px')
      .style('width', '100%');

    axis.current = svg.current.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)
      .call(yAxis);

    pointsAdded.current = false;

    setCL(0);
    setBuilding(false);
  }, [term]);

  const addGoalPoints = () => {
    let count = 0;
    if (svg.current) svg.current.selectAll('.goal-points').remove();
    svg.current.selectAll('dot')
      .data(goals.slice(currLoc, currLoc + 10))
      .enter().append('circle')
      .attr('class', 'goal-points')
      .attr('r', 6)
      .attr('cx', () => {
        count += 1;
        const widthHedge = count / 10;
        return (width) * widthHedge + 54;
      })
      .attr('cy', (d) => yScale(d.targetDate) + margin.top)
      .style('fill', (d) => (d.owner === userId ? 'blue' : 'red'))
      .on('click', (d) => setPreview(d))
      .append('title')
      .text((d) => `${d.shortDesc} - ${d.targetDate.toLocaleDateString()}`);

    pointsAdded.current = true;
  };

  useEffect(() => {
    if (!building && !pointsAdded.current && num > 0) {
      currLoc === 0 ? addGoalPoints() : setCL(0);
    }
  }, [building, goals]);

  useEffect(() => {
    if (!building) addGoalPoints();
  }, [currLoc]);

  return (
    <>
      <h2>My {term} Term Goal Roadmap</h2>
      <div className="goal-timeline">
        <div className="timeline">
          <div ref={timelineAnchor} className="timeline-holder" />
          {num > 10 && <ChangeView num={num} currLoc={currLoc} setCL={setCL} />}
        </div>
        <div className="goal-preview">
          <GoalPreview goal={preview} />
        </div>
      </div>
    </>
  );
};

const ChangeView = ({ num, currLoc, setCL }) => (
  <div className="change-view">
    {currLoc > 0
      ? <div onClick={() => setCL(currLoc - 10)} className="change-loc left">Previous</div>
      : <div />
    }
    <div>{`${currLoc + 1} - ${currLoc + 10}`}</div>
    {num > (currLoc + 10)
      ? <div onClick={() => setCL(currLoc + 10)} className="change-loc right">Next</div>
      : <div />
    }
  </div>
);

const GoalPreview = ({ goal }) => {
  const {
    conList, id, narrative, ownerEmail, shortDesc, targetDate, vision, verifiedCon, unverifiedCon,
  } = goal || {};
  if (!goal) { return (<h3>Click on a goal to view preview</h3>); }
  return (
    <>
      <Link to={`/Goals/${id}`}>
        <h3>{shortDesc}</h3>
      </Link>
      <p><b>Owner: </b>{ownerEmail}</p>
      <p><b>Target Date: </b>{targetDate.toLocaleDateString()}</p>
      {vision && <VisionDisplay vision={vision} shortDesc={shortDesc} />}
      {narrative !== '' && (
      <p>
        <b>Narrative: </b>{narrative}
      </p>
      )}
      {conList && conList.length > 0 && <Contributors ownerEmail={ownerEmail} conList={conList} verifiedCon={verifiedCon} unverifiedCon={unverifiedCon} />}
    </>
  );
};

const VisionDisplay = ({ vision, shortDesc }) => (<img src={vision.url} alt={shortDesc} />);

export default Timeline;
