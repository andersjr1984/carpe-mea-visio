import React, { useState, useEffect, useContext } from 'react';
import DatePicker from 'react-datepicker';
import {
  Form, Col, Row, Button,
} from 'react-bootstrap';

import firebase from '../../../../utils/firebase';

import 'react-datepicker/dist/react-datepicker.css';
import './NewGoal.css';
import ImageSelector from '../../../../utils/imageTools/ImageSelector';
import deleteImageFun from '../../../../utils/imageTools/deleteImageFun';
import randomString from '../../../../utils/randomString';
import { LoadingIcon } from '../../../../utils/loading/LoadingPage';
import { UserData } from '../../../../App';

export const validateEmail = (testEmail) => {
  const re = /\S+@\S+\.\S+/;
  return re.test(testEmail);
};

const NewGoal = ({ imageList }) => {
  const now = new Date();
  const [targetDate, setTD] = useState(now);
  const [shortDesc, setSD] = useState('');
  const [narrative, setNar] = useState('');
  const [indCon, setIndCon] = useState('');
  const [conList, setCL] = useState([]);
  const [vision, setVision] = useState(null);
  const [deletingVision, setDV] = useState(false);
  const [message, setMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { userId, emailVerified, email } = useContext(UserData);

  const [filename, setFilename] = useState(null);
  const locationRef = `${userId}/${filename}`;

  const newImage = (tempIID) => {
    const indImageData = tempIID;
    indImageData.filename = filename;
    setVision(indImageData);
  };

  const deleteImage = async () => {
    setDV(true);
    await deleteImageFun(vision.locationRef);
    setDV(false);
    setVision(null);
  };

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
    const tempConList = [...conList];
    if (indCon !== '' && validateEmail(indCon)) tempConList.push(indCon);
    const data = {
      targetDate: firebase.firestore.Timestamp.fromDate(targetDate),
      shortDesc,
      narrative,
      conList: tempConList,
      vision,
      ownerEmail: email,
    };
    const submitGoalFun = firebase.functions().httpsCallable('submitGoal');
    try {
      const submitData = await submitGoalFun(data);
      const goalCheck = submitData.data;
      if (goalCheck) {
        setTD(now);
        setSD('');
        setNar('');
        setIndCon('');
        setCL([]);
        setMessage('');
        setSubmitting(false);
        setVision(null);
        setFilename(null);
        return null;
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
    setMessage('Error submitting data; try again later.');
    setSubmitting(false);
  };

  useEffect(() => {
    const createFilename = (randomFilename) => {
      for (let i = 0; i < imageList.length; i += 1) {
        if (imageList.filename === randomFilename) {
          return createFilename(randomString(15));
        }
      }
      setFilename(randomFilename);
    };

    if (!filename && imageList) createFilename(randomString(15));
  }, [imageList, filename]);

  return (
    <>
      <h2>Add Goal</h2>
      {message && <p>{message}</p>}
      <Form className="new-goal" onSubmit={handleSubmit}>
        <ChooseDate
          targetDate={targetDate}
          setTD={setTD}
        />
        <Form.Group as={Row}>
          <Form.Label column sm="2">
            Title (required):
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              size="sm"
              required
              name="shortDesc"
              type="text"
              value={shortDesc}
              onChange={(event) => setSD(event.target.value)}
            />
          </Col>
        </Form.Group>
        {(filename && emailVerified) && vision
          ? <ViewImage deletingVision={deletingVision} vision={vision} deleteImage={deleteImage} />
          : (
            <ImageSelector
              locationRef={locationRef}
              newImage={newImage}
              filename={filename}
              width={1200}
              height={1200}
            />
          )}
        <EditNarrative narrative={narrative} setNar={setNar} />
        <AddContributor
          emailVerified={emailVerified}
          indCon={indCon}
          setIndCon={setIndCon}
          addCon={addCon}
        />
        {conList.length > 0 && <ContributorList conList={conList} removeCon={removeCon} />}
        {submitting
          ? <LoadingIcon />
          : <Button type="submit" size="sm">Submit</Button>
        }
      </Form>
    </>
  );
};

export const EditNarrative = ({ narrative, setNar }) => (
  <Form.Group as={Row}>
    <Form.Label column sm="2">
      Goal Narrative (optional):
    </Form.Label>
    <Col sm={10}>
      <Form.Control
        as="textarea"
        rows="3"
        value={narrative}
        onChange={(event) => setNar(event.target.value)}
      />
    </Col>
  </Form.Group>
);

export const AddContributor = ({
  emailVerified,
  indCon,
  setIndCon,
  addCon,
}) => {
  if (emailVerified) {
    return (
      <Form.Group as={Row}>
        <Form.Label column sm="2">
          Add Contributor
        </Form.Label>
        <Col sm={8}>
          <Form.Control
            size="sm"
            name="indCon"
            type="email"
            value={indCon}
            onChange={(event) => setIndCon(event.target.value)}
          />
        </Col>
        <Col sm={2}>
          <Button size="sm" onClick={addCon}>
            Add
          </Button>
        </Col>
      </Form.Group>
    );
  }

  return (<small>Verify email before adding contributors.</small>);
};

export const ChooseDate = ({ targetDate, setTD }) => {
  const now = new Date();
  const maxDate = new Date(now.getFullYear() + 2, now.getMonth(), now.getDate());
  return (
    <Form.Group className="date-picker-group">
      <Form.Label>
        Target Date:
      </Form.Label>
      <DatePicker
        selected={targetDate}
        onChange={setTD}
        maxDate={maxDate}
      />
      <small style={{ marginLeft: '1rem' }}>Complete by {maxDate.toDateString()}</small>
    </Form.Group>
  );
};

const ViewImage = ({ deletingVision, vision, deleteImage }) => (
  <div className="image-preview">
    <img src={vision.url} alt="vision" />
    {deletingVision
      ? <LoadingIcon />
      : <Button size="sm" onClick={deleteImage}>Delete</Button>
    }
  </div>
);

export const ContributorList = ({ conList, removeCon }) => (
  <Row className="con-list">
    <Col sm="2">
      Contributors:
    </Col>
    <Col sm="10">
      {conList.map((con, index) => (
        <Row key={con} className="con-row">
          <Col sm="10">{con}</Col>
          <Col sm="2"><Button variant="danger" size="sm" onClick={() => removeCon(index)}>Remove</Button></Col>
        </Row>
      ))}
    </Col>
  </Row>
);

export default NewGoal;
