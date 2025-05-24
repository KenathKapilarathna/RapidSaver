// import { get, ref, set, update } from "firebase/database";
import {
  addDoc,
  collection,
  doc,
  //   doc,
  //   getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebase";
import { getDriver } from "./DriverFunctions";
// import { realtimeDb } from "./firebase";
// import { RTDB_PATH } from "./conf";

interface Service {
  id: string;
  name: string;
  price: number;
  description: string;
  pic?: string;
}

interface BookingData {
  userId: string;
  services: Service[];
  vehicleType: string;
  vehicleBrand: string;
  vehicleModel: string;
  manufacturingYear: string;
  registrationPlate: string;
  timeSinceLastService: string;
  selectedDate: string;
  selectedTimeSlot: string;
  pickupRequested: boolean;
  pickupAddress?: string;
  totalPrice: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export const addBooking = async (bookingData: BookingData) => {
  await addDoc(collection(db, "bookings"), bookingData);
  return bookingData;
};

export const getUpcommingUserBookings = async (userId: string) => {
  const bookingsRef = collection(db, "bookings");
  const q = query(
    bookingsRef,
    where("userId", "==", userId),
    where("status", "!=", "completed")
  );
  const querySnapshot = await getDocs(q);
  const bookings = await Promise.all(
    querySnapshot.docs.map(async (doc) => ({
      id: doc.id,
      ...doc.data(),
      driver: doc.data().driverId ? await getDriver(doc.data().driverId) : null,
    }))
  );
  return bookings;
};

export const getPastUserBookings = async (userId: string) => {
  const bookingsRef = collection(db, "bookings");
  const q = query(
    bookingsRef,
    where("userId", "==", userId),
    where("status", "==", "completed")
  );
  const querySnapshot = await getDocs(q);
  const bookings = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return bookings;
};

export const getPastUserBookingsByDriver = async (driverId: string) => {
  const bookingsRef = collection(db, "bookings");
  const q = query(
    bookingsRef,
    where("driverId", "==", driverId),
    where("status", "==", "completed")
  );
  const querySnapshot = await getDocs(q);
  const bookings = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return bookings;
};

export const getRecentUserBookingsByDriver = async (driverId: string) => {
  const bookingsRef = collection(db, "bookings");
  const q = query(
    bookingsRef,
    where("driverId", "==", driverId),
    where("status", "!=", "completed")
  );
  const querySnapshot = await getDocs(q);
  const bookings = await Promise.all(
    querySnapshot.docs.map(async (doc) => ({
      id: doc.id,
      ...doc.data(),
      driver: doc.data().driverId ? await getDriver(doc.data().driverId) : null,
    }))
  );
  return bookings;
};

export const getPastUserBookingsByAdmin = async () => {
  const bookingsRef = collection(db, "bookings");
  const q = query(bookingsRef, where("status", "==", "completed"));
  const querySnapshot = await getDocs(q);
  const bookings = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return bookings;
};

export const getRecentBookingsByAdmin = async () => {
  const bookingsRef = collection(db, "bookings");
  const q = query(bookingsRef, where("status", "!=", "completed"));
  const querySnapshot = await getDocs(q);
  const bookings = await Promise.all(
    querySnapshot.docs.map(async (doc) => ({
      id: doc.id,
      ...doc.data(),
      driver: doc.data().driverId ? await getDriver(doc.data().driverId) : null,
    }))
  );
  return bookings;
};

// status change
export const setBookingStatus = async (bookingId: string, status: string) => {
  const bookingRef = doc(db, "bookings", bookingId);
  await updateDoc(bookingRef, {
    status: status,
    updatedAt: new Date().toISOString(),
  });
  const data = await getRecentBookingsByAdmin();
  return data;
};

export const setBookingStatusByDriver = async (
  driverId: string,
  bookingId: string,
  status: string
) => {
  const bookingRef = doc(db, "bookings", bookingId);
  await updateDoc(bookingRef, {
    status: status,
    updatedAt: new Date().toISOString(),
  });
  const data = await getRecentUserBookingsByDriver(driverId);
  return data;
};

export const setBookingStatusOnPastBookings = async (
  bookingId: string,
  status: string
) => {
  const bookingRef = doc(db, "bookings", bookingId);
  await updateDoc(bookingRef, {
    status: status,
    updatedAt: new Date().toISOString(),
  });
  const data = await getPastUserBookingsByAdmin();
  return data;
};

// driver change
export const setDriverOnPastBooking = async (
  bookingId: string,
  driverId: string
) => {
  const bookingRef = doc(db, "bookings", bookingId);
  await updateDoc(bookingRef, {
    driverId: driverId,
    updatedAt: new Date().toISOString(),
  });
  const data = await getPastUserBookingsByAdmin();
  return data;
};

export const setDriverOnRecentBooking = async (
  bookingId: string,
  driverId: string
) => {
  const bookingRef = doc(db, "bookings", bookingId);
  await updateDoc(bookingRef, {
    driverId: driverId,
    updatedAt: new Date().toISOString(),
  });
  const data = await getRecentBookingsByAdmin();
  return data;
};

export const getBookingsByDate = async (date: string) => {
  const bookingsRef = collection(db, "bookings");
  const q = query(bookingsRef, where("selectedDate", "==", date));
  const querySnapshot = await getDocs(q);
  const bookings = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return bookings;
};
