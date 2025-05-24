import { get, ref, set, update } from "firebase/database";
import { doc, setDoc, updateDoc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import { realtimeDb } from "./firebase";
import { RTDB_PATH } from "./conf";
import { createUserWithEmailAndPassword } from "firebase/auth";

interface driverDataI {
  name: string;
  email: string;
  phone: string;
  staffId?: string; // Assuming staffId is a string
  licenceNo?: string; // Assuming licenceNo is a string
  password: string;
}

export const registerDriver = async (driverData: driverDataI) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    driverData.email,
    driverData.password
  );
  const driver = userCredential.user;
  const driverUID = driver.uid;
  const driverRef = doc(db, "users", driverUID);

  const driverFullData = {
    userId: driverUID,
    uid: driverUID,
    name: driverData.name,
    email: driverData.email,
    email2: "",
    phone: driverData.phone,
    role: "driver",
    password: driverData.password,
    staffId: driverData.staffId || "",
    licenceNo: driverData.licenceNo || "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await setDoc(driverRef, driverFullData);
  const _driverRef = ref(realtimeDb, `${RTDB_PATH}/drivers/${driverUID}`);
  await set(_driverRef, driverFullData);

  return driverFullData;
};

export const getDrivers = async () => {
  const driversRef = ref(realtimeDb, `${RTDB_PATH}/drivers`);
  const snapshot = await get(driversRef);
  if (snapshot.exists()) {
    const driversData = snapshot.val();
    return driversData;
  } else {
    console.log("No data available");
    return null;
  }
};

export const getDriver = async (driverId: string) => {
  const driverRef = doc(db, "users", driverId); // Firestore reference - driver is a user
  const snapshot = await getDoc(driverRef);
  if (snapshot.exists()) {
    const driverData = snapshot.data();
    return driverData;
  } else {
    console.log("No data available");
    return null;
  }
};

interface updateDriverI {
  name: string;
  email2: string;
  phone: string;
  address: string;
}

export const updateDriver = async (
  driverId: string,
  driverData: updateDriverI
) => {
  const driverRef = doc(db, "users", driverId); // Firestore reference - driver is a user
  await updateDoc(driverRef, {
    ...driverData,
    updatedAt: new Date().toISOString(),
  });
  const _userRef = ref(realtimeDb, `${RTDB_PATH}/drivers/${driverId}`);
  await update(_userRef, {
    ...driverData,
    updatedAt: new Date().toISOString(),
  });

  type DriverProfileResponse = {
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
    address?: string;
    staffId?: string;
    licenceNo?: string;
  };
  const updatedUser = await getDoc(driverRef);
  const userDataFromFirestore = updatedUser.data() as DriverProfileResponse;
  return userDataFromFirestore;
};
