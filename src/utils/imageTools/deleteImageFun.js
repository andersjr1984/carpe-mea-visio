import firebase from '../firebase';

const deleteImageFun = async (ref) => firebase.storage().ref(ref).delete();

export default deleteImageFun;
