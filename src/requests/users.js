import database from '../firebaseConfig';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import CryptoJS from 'crypto-js';

export const createUser = async (payload) => {
  const qry = query(
    collection(database, 'users'),
    where('email', '==', payload.email)
  );
  const querySnapshot = await getDocs(qry);
  if (querySnapshot.size > 0) {
    throw new Error('Used already exists');
  }

  const hashedPassword = CryptoJS.AES.encrypt(
    payload.password,
    'medconnect'
  ).toString();

  payload.password = hashedPassword;

  try {
    const docRef = collection(database, 'users');
    await addDoc(docRef, payload);
    return {
      success: true,
      message: 'User created successfully',
    };
  } catch (error) {
    return error;
  }
};
