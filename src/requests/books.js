import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
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

export const getDoctorAppointmentsOnDate = async (doctorId, date) => {
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

export const getDoctorAppointments = async (doctorId) => {
  try {
    const querySnapshot = await getDocs(
      query(
        collection(database, 'appointments'),
        where('doctorId', '==', doctorId)
      )
    );
    const data = [];
    querySnapshot.forEach((doc) =>
      data.push({
        ...doc.data(),
        id: doc.id,
      })
    );
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

export const getUserAppointments = async (userId) => {
  try {
    const querySnapshot = await getDocs(
      query(collection(database, 'appointments'), where('userId', '==', userId))
    );
    const data = [];
    querySnapshot.forEach((doc) =>
      data.push({
        ...doc.data(),
        id: doc.id,
      })
    );
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

export const getAllAppointments = async () => {
  try {
    const appointments = await getDocs(collection(database, 'appointments'));
    const data = [];
    appointments.forEach((doc) =>
      data.push({
        ...doc.data(),
        id: doc.id,
      })
    );
    return {
      success: true,
      data: data,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const updateAppointmentStatus = async (id, status) => {
  try {
    await updateDoc(doc(database, 'appointments', id), {
      status,
    });
    return {
      success: true,
      message: "Appointment's status updated",
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};
