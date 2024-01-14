import database from '../firebaseConfig';
import {
  collection,
  addDoc,
  getDoc,
  doc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';

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

export const checkDoctorApplied = async (id) => {
  try {
    const doctors = await getDocs(
      query(collection(database, 'doctors'), where('userId', '==', id))
    );
    if (doctors.size > 0) {
      return {
        success: true,
        message: "Doctor's account is already applied",
      };
    }
    return {
      success: false,
      message: "Doctor's account is not applied yet",
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};
