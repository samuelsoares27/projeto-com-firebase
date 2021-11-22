import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyA8S816HQpaCb55WquvoNyBsndBFiNWF-s",
  authDomain: "cursoapp-96e13.firebaseapp.com",
  projectId: "cursoapp-96e13",
  storageBucket: "cursoapp-96e13.appspot.com",
  messagingSenderId: "988104963038",
  appId: "1:988104963038:web:3f30c8d4ccda3c0d2da34f"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);    
}

export default firebase;