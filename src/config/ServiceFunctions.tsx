import { get, push, ref, remove, set } from "firebase/database";
import { realtimeDb } from "./firebase";
import { RTDB_PATH } from "./conf";

interface serviceDataI {
  name: string;
  description: string;
  price: number;
  duration: number;
  pic: string;
  id?: string;
}

export const addService = async (serviceData: serviceDataI) => {
  const serviceFullData = {
    name: serviceData.name,
    description: serviceData.description,
    price: serviceData.price,
    duration: serviceData.duration,
    pic: serviceData.pic,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const _serviceRef = ref(realtimeDb, `${RTDB_PATH}/services`);
  const newServiceRef = push(_serviceRef);
  await set(newServiceRef, serviceFullData);
  return {
    ...serviceFullData,
    id: newServiceRef.key,
  };
};

export const getService = async (id: string) => {
  const snapshot = await get(ref(realtimeDb, `${RTDB_PATH}/services/${id}`));
  if (snapshot.exists()) {
    const rawData = snapshot.val();
    return {
      ...(rawData as serviceDataI),
      id: id,
    };
  } else {
    console.log("No data available");
   return null;
  }
};

export const getServicesAsList = async () => {
  const snapshot = await get(ref(realtimeDb, `${RTDB_PATH}/services`));
  if (snapshot.exists()) {
    const rawData = snapshot.val();
    const data: serviceDataI[] = [];
    Object.entries(rawData).forEach(([id, serviceData]) => {
      data.push({
        ...(serviceData as serviceDataI),
        id: id,
      });
    });
    // console.log(data);
    return data;
  } else {
    console.log("No data available");
    return [];
  }
};

export const deleteService = async (id: string) => {
  const slotRef = ref(realtimeDb, `${RTDB_PATH}/services/${id}`);
  await remove(slotRef);
  return true;
};
