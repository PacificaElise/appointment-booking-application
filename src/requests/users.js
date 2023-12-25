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

  const hashedConfirmPassword = CryptoJS.AES.encrypt(
    payload.confirmPassword,
    'medconnect'
  ).toString();

  payload.confirmPassword = hashedConfirmPassword;

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

export const loginUser = async (payload) => {
  try {
    const qry = query(
      collection(database, 'users'),
      where('email', '==', payload.email)
    );
    const userSnapshots = await getDocs(qry);

    if (userSnapshots.metadata.fromCache === true) {
      throw new Error('No Internet connection');
    }

    if (userSnapshots.size === 0) {
      throw new Error("User doesn't exist");
    }

    const user = userSnapshots.docs[0].data();
    const bytes = CryptoJS.AES.decrypt(user.password, 'medconnect');
    const originPassword = bytes.toString(CryptoJS.enc.Utf8);

    if (originPassword !== payload.password) {
      throw new Error('Incorrect password');
    }

    return {
      success: true,
      message: 'User logged successfully',
      data: user,
    };
  } catch (error) {
    return error;
  }
};
