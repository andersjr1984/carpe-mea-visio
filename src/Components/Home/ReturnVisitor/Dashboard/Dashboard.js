/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useState, useContext } from 'react';
import {
  Alert,
  Form,
  Row,
  Col,
  ButtonGroup,
  Button,
  Table,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Dashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faWindowClose } from '@fortawesome/free-solid-svg-icons';
import { AddContributor, validateEmail, ContributorList } from '../NewGoal/NewGoal';
import { UserData } from '../../../../App';
import { LoadingPage } from '../../../../utils/loading/LoadingPage';
import firebase from '../../../../utils/firebase';
import Slider from '../../../../utils/slider/Slider';
import Contributors from '../IndGoalPage/Components/GoalDisplay/Contributors';

const Dashboard = ({
  goals,
  myToDo,
}) => (
  <>
    <h2>Dashboard</h2>
    <div className="dashboard">
      <div className="sub-dashboard">
        <STGoalDashboard goals={goals} />
      </div>
      <div className="sub-dashboard">
        <TasksDashboard myToDo={myToDo} />
      </div>
    </div>
  </>
);

const STGoalDashboard = ({
  goals,
}) => {
  const now = new Date();
  const maxDate = new Date(now.getFullYear(), now.getMonth() + 2, now.getDate());
  const nearTermGoals = goals.filter((goal) => goal.targetDate > now && goal.targetDate < maxDate);

  return (
    <div className="goal-dashboard">
      <h3>My Upcoming Goals</h3>
      {nearTermGoals.map((goal) => (
        <Alert variant="secondary" key={`goal-dashboard-${goal.id}`}>
          <Alert.Heading><Link to={`Goals/${goal.id}`}>{goal.shortDesc}</Link></Alert.Heading>
          <p><b>Target Date: </b>{goal.targetDate.toLocaleDateString()}</p>
        </Alert>
      ))}
    </div>
  );
};

const TasksDashboard = ({
  myToDo,
}) => {
  const [displayAdd, setDA] = useState(false);
  const [displayToDo, setDTD] = useState(null);
  // todo: mark complete
  return (
    <div className="task-dashboard">
      <div className="dash-header">
        <div id="hold" />
        <h3>To-Do List</h3>
        <FontAwesomeIcon id="at-icon" onClick={() => setDA(true)} icon={faPlus} />
      </div>
      {myToDo.length > 0 && <ToDoTable myToDo={myToDo} setDTD={setDTD} />}
      {displayToDo && <DisplayToDo todo={displayToDo} setDTD={setDTD} />}
      {displayAdd && <AddTaskForm setDA={setDA} />}
    </div>
  );
};

const DisplayToDo = ({ todo, setDTD }) => (
  <div id="todoDisp">
    <FontAwesomeIcon icon={faWindowClose} id="closeWindow" onClick={() => setDTD(null)} />
    <FullPageToDo todo={todo} />
  </div>
);

const FullPageToDo = ({ todo }) => {
  const [completing, setCompleting] = useState(false);
  const [message, setMessage] = useState(null);
  const {
    conList,
    verifiedCon,
    unverifiedCon,
    ownerEmail,
  } = todo;

  const markComplete = async () => {
    setCompleting(true);
    const completeToDoFun = firebase.functions().httpsCallable('completeToDo');
    try {
      await completeToDoFun({ id: todo.id });
    } catch (error) {
      setMessage('Error submitting completion.');
    }
    setCompleting(false);
  };

  if (completing) {
    return (
      <div className="full-page-todo">
        <LoadingPage contained message="submitting completion" />
      </div>
    );
  }

  return (
    <div className="full-page-todo">
      {message && <small>{message}</small>}
      <h3>{todo.task}</h3>
      <h4>Owner: {todo.ownerEmail}</h4>
      <p><b>Submitted: </b>{todo.submitted.toLocaleDateString()}</p>
      {todo.completed
        ? <p><b>Completed: </b>{todo.completed.toLocaleDateString()}</p>
        : <p id="mark-complete" onClick={markComplete}>Mark Complete</p>
      }
      {conList && conList.length > 0 && (
        <Contributors
          ownerEmail={ownerEmail}
          conList={conList}
          verifiedCon={verifiedCon}
          unverifiedCon={unverifiedCon}
        />
      )}
    </div>
  );
};

const ToDoTable = ({ myToDo, setDTD }) => {
  const [compInd, setCI] = useState(0);
  const compArr = [false, true];
  const completed = compArr[compInd];

  const nextTerm = () => {
    if (compInd === 0) setCI(1);
    else setCI(0);
  };

  return (
    <>
      <small>Incomplete - Completed</small>
      <Slider index={compInd} handleClick={nextTerm} options={compArr.length} />
      <Table striped bordered hover variant="dark" id="to-do-table">
        <thead>
          <tr>
            <th style={{ width: '10%' }}>#</th>
            <th style={{ width: '45%' }}>Task</th>
            <th style={{ width: '45%' }}>{completed ? 'Completed' : 'Submitted'}</th>
          </tr>
        </thead>
        <tbody>
          {myToDo.filter((todo) => completed === Boolean(todo.completed)).map((todo, index) => (
            <IndToDo
              key={todo.id}
              todo={todo}
              index={index + 1}
              setDTD={setDTD}
            />
          ))}
        </tbody>
      </Table>
    </>
  );
};

const IndToDo = ({ todo, index, setDTD }) => (
  <tr onClick={() => setDTD(todo)}>
    <td>{index}</td>
    <td>{todo.task}</td>
    <td>{todo.completed ? todo.completed.toLocaleDateString() : todo.submitted.toLocaleDateString()}</td>
  </tr>
);

const AddTaskForm = ({ setDA }) => {
  const [task, setTask] = useState('');
  const [conList, setCL] = useState([]);
  const [indCon, setIndCon] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const { emailVerified } = useContext(UserData);

  const addCon = () => {
    if (!conList.includes(indCon) && validateEmail(indCon)) setCL(conList.concat(indCon));
    setIndCon('');
  };

  const removeCon = (index) => {
    setCL(conList.slice(0, index).concat(conList.slice(index + 1)));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    const submitToDoFun = firebase.functions().httpsCallable('submitToDo');
    const postObj = {
      task,
      conList,
    };
    try {
      await submitToDoFun(postObj);
      setSubmitting(false);
      setTask('');
      setCL([]);
      setDA(false);
    } catch (error) {
      setSubmitting(false);
      setMessage('Error Submitting, Please Try Again.');
    }
  };

  if (submitting) {
    return (
      <div id="add-task">
        <LoadingPage contained message="Submitting Task" />
      </div>
    );
  }

  return (
    <div id="add-task">
      <FontAwesomeIcon icon={faWindowClose} id="closeWindow" onClick={() => setDA(false)} />
      {message && <small>{message}</small>}
      <Form onSubmit={handleSubmit}>
        <Form.Group as={Row}>
          <Form.Label column sm="2">
            Task:
          </Form.Label>
          <Col sm="10">
            <Form.Control
              size="sm"
              required
              name="task"
              type="text"
              value={task}
              onChange={(event) => setTask(event.target.value)}
            />
          </Col>
        </Form.Group>
        <AddContributor
          emailVerified={emailVerified}
          indCon={indCon}
          setIndCon={setIndCon}
          addCon={addCon}
        />
        {conList.length > 0 && <ContributorList conList={conList} removeCon={removeCon} />}
        <ButtonGroup>
          <Button size="sm" type="submit">Submit</Button>
          <Button size="sm" onClick={() => setDA(false)} variant="warning">Cancel</Button>
        </ButtonGroup>
      </Form>
    </div>
  );
};

export default Dashboard;
