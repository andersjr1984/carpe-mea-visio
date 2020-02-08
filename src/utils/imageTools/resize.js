/* eslint-disable no-mixed-operators */

function resizeImage(image, maxWidth, maxHeight, quality) {
  const canvas = document.createElement('canvas');
  let { width } = image;
  let { height } = image;
  if (width > height) {
    if (width > maxWidth) {
      height = Math.round(height * maxWidth / width);
      width = maxWidth;
    }
  } else if (height > maxHeight) {
    width = Math.round(width * maxHeight / height);
    height = maxHeight;
  }
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0, width, height);
  return canvas.toDataURL('image/jpeg', quality);
}

function resize(file, maxWidth, maxHeight, fn) {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  // eslint-disable-next-line func-names
  reader.onload = function (event) {
    const dataUrl = event.target.result;
    const image = new Image();
    image.src = dataUrl;
    // eslint-disable-next-line func-names
    image.onload = function () {
      const resizedDataUrl = resizeImage(image, maxWidth, maxHeight, 0.7);
      fn(resizedDataUrl);
    };
  };
}

export default resize;
