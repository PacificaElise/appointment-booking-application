import database from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

export const addDoctor = async (payload) => {
  try {
    const docRef = collection(database, 'doctors');
    await addDoc(docRef, payload);
    return {
      success: true,
      message: 'Doctor added successfully, wait for approval, please',
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};
