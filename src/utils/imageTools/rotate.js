/* eslint-disable no-mixed-operators */

function rotateImage(image, direction) {
  const canvas = document.createElement('canvas');
  const rotationChoice = () => {
    switch (direction) {
      case 'right':
        return Math.PI / 2;
      default:
        return (3 * Math.PI / 2);
    }
  };

  const { width, height } = image;
  canvas.width = height;
  canvas.height = width;
  const rotation = rotationChoice();
  const ctx = canvas.getContext('2d');
  ctx.translate(height / 2, width / 2);
  ctx.rotate(rotation);
  ctx.drawImage(image, -width / 2, -height / 2);
  // canvas.width = height;
  // canvas.height = width;
  return canvas.toDataURL('image/jpeg', 1);
}

function rotate(file, direction, fn) {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  // eslint-disable-next-line func-names
  reader.onload = function (event) {
    const dataUrl = event.target.result;
    const image = new Image();
    image.src = dataUrl;
    // eslint-disable-next-line func-names
    image.onload = function () {
      const rotatedDataUrl = rotateImage(image, direction);
      fn(rotatedDataUrl);
    };
  };
}

export default rotate;
