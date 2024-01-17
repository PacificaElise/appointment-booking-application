import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import database from '../firebaseConfig';

export const bookAppointment = async (payload) => {
  try {
    await addDoc(collection(database, 'appointments'), payload);
    return {
      success: true,
      message: 'Appointment was booked successfully',
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const getDoctorAppointments = async (doctorId, date) => {
  try {
    const querySnapshot = await getDocs(
      query(
        collection(database, 'appointments'),
        where('doctorId', '==', doctorId),
        where('date', '==', date)
      )
    );
    const data = [];
    querySnapshot.forEach((doc) => data.push(doc.data()));
    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};
