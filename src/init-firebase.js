import firebase from "firebase/app";
import "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyALJJRY_51-3Ei_4ikOnhKqQt5DuMq_Ogk",
    authDomain: "lighthouse-fl-photo.firebaseapp.com",
    databaseURL: "https://lighthouse-fl-photo.firebaseio.com",
    projectId: "lighthouse-fl-photo",
    storageBucket: "lighthouse-fl-photo.appspot.com",
    messagingSenderId: "346717677885",
    appId: "1:346717677885:web:be4eceec0babf374c7bd54"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();

export { firebase, storage as default };