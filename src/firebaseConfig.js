import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyD5hBmOgJdJkVioy_gQ9Ps7sL4rMllsQx8',
  authDomain: 'medconnect-a5fe7.firebaseapp.com',
  projectId: 'medconnect-a5fe7',
  storageBucket: 'medconnect-a5fe7.appspot.com',
  messagingSenderId: '987582642569',
  appId: '1:987582642569:web:7b5a5f9f75d94333bec958',
  measurementId: 'G-8022PF1DWF',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getFirestore(app);

export default database;
