import database from '../firebaseConfig';
import {
  collection,
  getDocs,
  query,
  where,
  setDoc,
  doc,
  updateDoc,
  getDoc,
  deleteDoc,
} from 'firebase/firestore';

export const addDoctor = async (payload) => {
  try {
    const docRef = doc(database, 'doctors', payload.userId);
    await setDoc(docRef, payload);
    await updateDoc(doc(database, 'users', payload.userId), {
      role: 'doctor',
    });
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
        data: doctors.docs.map((doc) => {
          return {
            ...doc.data(),
            id: doc.id,
          };
        })[0],
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

export const getDoctors = async () => {
  try {
    const doctors = await getDocs(collection(database, 'doctors'));
    return {
      success: true,
      data: doctors.docs.map((doc) => {
        return { key: doc.id, id: doc.id, ...doc.data() };
      }),
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const updateDoctor = async (payload) => {
  try {
    await setDoc(doc(database, 'doctors', payload.id), payload);
    return {
      success: true,
      message: "Doctor's information updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const getDoctorById = async (id) => {
  try {
    const doctor = await getDoc(doc(database, 'doctors', id));
    return {
      success: true,
      data: doctor.data(),
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const deleteDoctor = async (id) => {
  try {
    await deleteDoc(doc(database, 'doctors', id));
    return {
      success: true,
      message: 'Doctor was deleted',
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};
