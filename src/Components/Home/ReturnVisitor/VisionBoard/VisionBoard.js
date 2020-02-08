/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useState, useEffect, useRef,
} from 'react';
import { Link } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import { LoadingPage } from '../../../../utils/loading/LoadingPage';

// function to determine the width for each item using fibionachi numbers
const fibSeq = (fib) => {
  // array of widths
  const currWidth = [];
  // go through item that user wants to see
  for (let i = 0; i < fib; i += 1) {
    const values = currWidth.length; // determine how many items have been added
    if (values < 2) {
      currWidth.push(1); // first two values are always 1 unit wide
    } else {
      // fib sequence is the sum of the past two numbers
      currWidth.push(currWidth[values - 1] + currWidth[values - 2]);
    }
  }
  return currWidth;
};

const adjDimsFun = (width, height) => {
  if (width > height) {
    // adjust the height when the width is larger on a 100 scale for percent
    // height actually doesn't matter, it will be set to auto
    // will still change it, could potentially matter in future
    return { width: 100, height: 100 * height / width };
  }
  // adjust width when height is larger on a 100 scale for percent
  return { width: 100 * width / height, height: 100 };
};

const VisionBoard = ({ imageList }) => {
  // todo: randomize images
  const [loading, setLoading] = useState(false);
  const [fib, setFib] = useState(1);
  const [imagesToDisp, setITD] = useState([]);

  // determine how many fibionachi display items
  const iteration = useRef(0);
  // accumulate the amount of rows that have been added
  const totalRows = useRef(0);
  // the maximum rows for each fib display
  const maxRows = useRef(1);
  // the maximum columns for each fib display
  const maxCol = useRef(1);

  useEffect(() => {
    // determine the initial fib number based on how many images are in the list
    const detFib = () => {
      setLoading(true);

      if (imageList.length > 4 && fib === 1) setFib(4);
      else if (fib === 1) setFib(imageList.length);

      setLoading(false);
    };

    if (imageList.length > 0) detFib();
  }, [imageList]);

  useEffect(() => {
    // need to reset these numbers (maxRows and iteration) when user toggles fib number
    maxRows.current = 1;
    iteration.current = 0;

    // call fibSeq to create a width array based on fib number
    const widthArr = fibSeq(fib);

    // determine how many columns and rows we need for each fib display
    if (fib <= 2) {
      // when the fib number is 2, maxRows is 1 and maxCol is equal to fib (1 or 2)
      maxCol.current = fib;
    } else {
      // when fib is greater than 2, maxRows is the width of the largest box
      maxRows.current = widthArr[fib - 1];
      // and maxCol is the sum of the largest two boxes
      maxCol.current = widthArr[fib - 1] + widthArr[fib - 2];
    }

    // logic changes if the fib number is even or odd
    const isOdd = fib % 2 === 1;
    // the row and column each fib display starts on
    let startRow = 1;
    let startCol = 1;
    // the row and column for each image we are displaying
    let currRow = 1;
    let currCol = 1;

    // create an array of images based on the imageList
    const fibCont = imageList.map((image, i) => {
      // a temporary image item that we can change
      const tempImage = { ...image };

      // get the width and height of the image
      const { width, height } = image;
      const adjDims = adjDimsFun(width, height);
      tempImage.width = adjDims.width;
      tempImage.height = adjDims.height;

      // determine column and row start and end for grid layout
      // get some interesting errors with ===
      // first image has interesting attributes
      // eslint-disable-next-line eqeqeq
      if (fib == 1) {
        tempImage.colSE = [0, 1];
        tempImage.rowSE = [currRow, currRow + 1];
        currRow += 1;
        maxRows.current = imageList.length;
        return tempImage;
      }

      const fibMod = i % fib;
      // eslint-disable-next-line eqeqeq
      if (fib == 2) {
        maxRows.current = 1;
        // if odd and (currEven or row 0)
        // new row
        tempImage.colSE = [currCol, currCol + 1];
        tempImage.rowSE = [currRow, currRow + 1];
        if (fibMod === 0) {
          currCol += 1;
        } else {
          currCol = 1;
          currRow += 1;
        }
        return tempImage;
      }

      // determine if the iteration of fib displays is even or odd
      const flipIter = iteration.current % 2 === 0;
      // currFib determines which width to choose from array
      const currFib = flipIter ? fibMod : fib - fibMod - 1;
      // determine widht of current fib element
      const currWidth = widthArr[currFib];
      // is the current element odd or even
      const currEven = currFib % 2 === 0;
      // when fib is an even number, create a new row when flipIter === currEven
      // when fib is an odd number, create a new row when flipIter !== currEven
      const testFlip = flipIter === currEven;
      // can test this by determining if isOdd === testFlip
      const newRow = isOdd === testFlip;

      // column and rows will start on current and end on (current + width)
      tempImage.colSE = [currCol, currCol + currWidth];
      tempImage.rowSE = [currRow, currRow + currWidth];

      // determine what the current should be
      if (newRow) {
        // on new row
        // calculate the next row
        currRow += currWidth;
        // determine if the new row adds to the total
        totalRows.current = Math.max([totalRows.current, currRow]);
        // columns start over at the start column value
        currCol = startCol;
      } else {
        // on new column
        // rows start over at the start row value
        currRow = startRow;
        // if in the flip position, will need to have a start column at each new column
        if (flipIter) {
          startCol = currCol;
          currCol += currWidth;
        } else {
          currCol += currWidth;
          startCol = currCol;
        }
      }

      // a totally new row is required when:
      // regular when currFib === fib - 1;
      // flipped when currFib === 0;
      const checkCurrCol = (flipIter && currFib === fib - 1) || (!flipIter && currFib === 0);
      if (checkCurrCol) {
        iteration.current += 1;
        if (!flipIter && currFib === 0) {
          // currRow is not updated on the !flipIter
          currRow += maxRows.current;
        }
        startRow = currRow;
        startCol = 1;
        currCol = 1;
      }

      return tempImage;
    });
    setITD(fibCont);
  }, [fib]);

  if (loading) {
    return (
      <div className="image-collage">
        <LoadingPage contained />
      </div>
    );
  }

  const gridStyle = {
    gridTemplateRows: `repeat(${totalRows.current}, 1fr)`,
    gridTemplateColumns: `repeat(${maxCol.current}, 1fr)`,
  };

  return (
    <div className="image-collage">
      {imageList.length < 4 && <small>Add more images to unleash the full vision board!</small>}
      {imageList.length > 0 && (
        <Form.Group>
          <Form.Label>
            {fib}
          </Form.Label>
          <Form.Control
            type="range"
            min="1"
            max={imageList.length < 8 ? imageList.length : 8}
            value={fib}
            className="slider"
            id="myRange"
            onChange={(event) => setFib(event.target.value)}
          />
        </Form.Group>
      )}
      <div className="collage-grid" style={gridStyle}>
        {imagesToDisp.map((image, index) => <CollImage image={image} index={index} key={image.filename} />)}
      </div>
    </div>
  );
};

const CollImage = ({ image, index }) => {
  const [gridColumnStart, gridColumnEnd] = image.colSE;
  const [gridRowStart, gridRowEnd] = image.rowSE;
  const divStyle = {
    gridColumnStart,
    gridColumnEnd,
    gridRowStart,
    gridRowEnd,
  };

  const { width } = image;
  const imgStyle = {
    width: `${width}%`,
    height: 'auto',
  };

  return (
    <div style={divStyle}>
      <Link to={`Goals/${image.id}`} style={imgStyle}>
        <img src={image.url} alt={`vision-${index}`} />
      </Link>
    </div>
  );
};

export default VisionBoard;
