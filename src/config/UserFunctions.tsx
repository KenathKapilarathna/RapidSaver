import { ref, set, update } from "firebase/database";
import {
  doc,
  setDoc,
  updateDoc,
  getDoc,
  collection,
  where,
  getDocs,
  query,
} from "firebase/firestore";
import { db } from "./firebase";
import { realtimeDb } from "./firebase";
import { RTDB_PATH } from "./conf";

interface userDataI {
  uid: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
}

export const registerUser = async (userData: userDataI) => {
  const userRef = doc(db, "users", userData.uid);

  await setDoc(userRef, {
    userId: userData.uid,
    uid: userData.uid,
    name: userData.name,
    email: userData.email,
    email2: "",
    phone: userData.phone,
    role: "user",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  const _userRef = ref(realtimeDb, `${RTDB_PATH}/users/${userData.uid}`);
  await set(_userRef, {
    userId: userData.uid,
    uid: userData.uid,
    name: userData.name,
    email: userData.email,
    email2: "",
    phone: userData.phone,
    role: "user",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  return {
    uid: userData.uid,
    id: userData.uid,
    userId: userData.uid,
    name: userData.name,
    email: userData.email,
    email2: "",
    phone: userData.phone,
    role: "user",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

interface updateUserI {
  name: string;
  email2: string;
  phone: string;
}

export const updateUser = async (userId: string, userData: updateUserI) => {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, {
    ...userData,
    updatedAt: new Date().toISOString(),
  });
  const _userRef = ref(realtimeDb, `${RTDB_PATH}/users/${userId}`);
  await update(_userRef, {
    ...userData,
    updatedAt: new Date().toISOString(),
  });

  type UserProfileResponse = {
    id: string;
    createdAt: string;
    updatedAt: string;
    email: string;
    email2: string;
    name: string;
    phone: string;
    role: string;
    uid: string;
    userId: string;
  };
  const updatedUser = await getDoc(userRef);
  const userDataFromFirestore = updatedUser.data() as UserProfileResponse;
  return userDataFromFirestore;
};

export const getAllUsers = async () => {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("role", "==", "user"));
  const querySnapshot = await getDocs(q);
  const users = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return users;
};
