import firebase from '../firebase';

const addPhoto = (file, path, updateProgress, displayError, uploadComplete, optMeta) => {
  const storageRef = firebase.storage().ref();
  const tempMeta = optMeta;
  tempMeta.resized = tempMeta.resized ? tempMeta.resized : false;
  const customMetadata = {};
  const metaKeys = Object.keys(tempMeta);
  metaKeys.forEach((key) => {
    customMetadata[`${key}`] = String(tempMeta[key]);
  });

  // Create the file metadata
  const metadata = {
    contentType: file.type,
    customMetadata,
  };

  // Upload file and metadata to the object 'images/mountains.jpg'
  const uploadTask = storageRef.child(path).put(file, metadata);

  // Listen for state changes, errors, and completion of the upload.
  uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
    (snapshot) => {
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      updateProgress(parseInt(progress, 0));
    }, (error) => {
      // eslint-disable-next-line no-console
      console.error(error);
      displayError(error.message);
    }, () => {
    // Upload completed successfully, now we can get the download URL
      uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
        uploadComplete(downloadURL);
      });
    });
};

export default addPhoto;
