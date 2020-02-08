import React, { useState, useEffect, useRef } from 'react';
import {
  Form, ProgressBar, ButtonGroup, Button,
} from 'react-bootstrap';
import resize from './resize';
import rotate from './rotate';
import addPhoto from './addPhoto';
import './ImageSelector.css';

const ImageSelector = (props) => {
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [resizing, setRS] = useState(false);
  const [previewUrl, setPU] = useState(null);
  const { filename } = props;

  const getPhoto = async () => {
    setRS(true);
    const file = document.getElementById(filename).files[0];
    resize(file, props.width, props.height, async (resizedDataUrl) => setPU(resizedDataUrl));
    setRS(false);
  };

  if (resizing) return <h5>Resizing</h5>;

  if (progress !== 0) return <ProgressBar now={progress} label={`${progress}`} />;

  if (error) return <h5>{error}</h5>;

  if (previewUrl) {
    const uploadImage = async (width, height) => {
      const uploadComplete = (url) => {
        const indImgData = {
          ref: props.locationRef,
          url,
          width,
          height,
        };
        props.newImage(indImgData);
      };

      const currUpload = await fetch(previewUrl);
      const blobToUpload = await currUpload.blob();
      const metadata = props.metadata ? props.metadata : {};
      addPhoto(blobToUpload, props.locationRef, setProgress, setError, uploadComplete, metadata);
    };

    return <PreviewImage uploadImage={uploadImage} previewUrl={previewUrl} setPU={setPU} />;
  }

  return (
    <Form.Group className="add-image">
      <Button size="sm"><Form.Label htmlFor={filename}>Choose Image</Form.Label></Button>
      <Form.Control type="file" name="photo" accept="image" id={filename} onChange={(event) => getPhoto(event.target.files)} />
    </Form.Group>
  );
};

const PreviewImage = (props) => {
  const { previewUrl, uploadImage, setPU } = props;
  const width = useRef(0);
  const height = useRef(0);

  const rotateImage = async (direction) => {
    const currUpload = await fetch(previewUrl);
    const file = await currUpload.blob();
    rotate(file, direction, (dataUrl) => setPU(dataUrl));
  };

  useEffect(() => {
    const img = new Image();

    img.onload = () => {
      width.current = img.width;
      height.current = img.height;
    };

    img.src = previewUrl;
  }, [previewUrl]);

  return (
    <div className="preview-image">
      <small>Verify Rotation of Image and Accept to Upload.</small>
      <div className="image-holder">
        <img src={previewUrl} alt="preview" className="preview" />
      </div>
      <ButtonGroup size="sm">
        <Button onClick={() => uploadImage(width.current, height.current)}>Accept</Button>
        <Button onClick={() => rotateImage('left')}>Rotate Left</Button>
        <Button onClick={() => rotateImage('right')}>Rotate Right</Button>
        <Button onClick={() => setPU(null)} variant="warning">Cancel</Button>
      </ButtonGroup>
    </div>
  );
};

export default ImageSelector;
