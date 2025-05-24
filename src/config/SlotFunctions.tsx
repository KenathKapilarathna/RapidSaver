/* eslint-disable @typescript-eslint/no-explicit-any */
import { get, push, ref, set, remove } from "firebase/database";
import { realtimeDb } from "./firebase";
import { RTDB_PATH } from "./conf";
import { getBookingsByDate } from "./BookingFunctions";

interface slotDataI {
  date: "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";
  startTime: string;
  endTime: string;
  id?: string;
}

export const addSlot = async (slotData: slotDataI) => {
  const slotFullData = {
    date: slotData.date,
    startTime: slotData.startTime,
    endTime: slotData.endTime,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const _slotRef = ref(realtimeDb, `${RTDB_PATH}/slots/${slotData.date}`);
  const newSlotRef = push(_slotRef);
  await set(newSlotRef, slotFullData);
  return {
    ...slotFullData,
    id: newSlotRef.key,
  };
};

export const getSlotsAsList = async () => {
  const snapshot = await get(ref(realtimeDb, `${RTDB_PATH}/slots`));
  if (snapshot.exists()) {
    const rawData = snapshot.val();
    const data: slotDataI[] = [];
    Object.entries(rawData).forEach(([day, slots]) => {
      // Iterate over each slot in the day
      Object.entries(slots as Record<string, any>).forEach(([id, slotData]) => {
        data.push({
          ...slotData,
          id: id,
          date: day as "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun",
        });
      });
    });
    // console.log(data);
    return data;
  } else {
    console.log("No data available");
    return [];
  }
};

interface Booking {
  userId: string;
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
export const getSlotsAsObject = async (
  selectedDate: string,
  dayKey: string
) => {
  const snapshot = await get(ref(realtimeDb, `${RTDB_PATH}/slots`));
  const allDays = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
  const result: Record<string, string[]> = {};
  allDays.forEach((day) => {
    result[day] = [];
  });

  if (snapshot.exists()) {
    const rawData = snapshot.val();
    Object.entries(rawData).forEach(([day, slots]) => {
      const formattedSlots: string[] = Object.values(
        slots as Record<string, any>
      ).map((slot: any) => {
        return `${slot.startTime} - ${slot.endTime}`;
      });
      result[day] = formattedSlots;
    });
  } else {
    console.log("No data available");
  }
  const rawBookingData = await getBookingsByDate(selectedDate);
  const bookingData: Booking[] = rawBookingData.map((booking: any) => ({
    ...booking,
    selectedDate: booking.selectedDate || "",
    selectedTimeSlot: booking.selectedTimeSlot || "",
  }));
  bookingData.forEach((booking: Booking) => {
    const index = result[dayKey].indexOf(booking.selectedTimeSlot);
    if (index > -1) {
      result[dayKey].splice(index, 1);
    }
  });
  return result[dayKey] || [];
};

export const deleteSlot = async (date: string, id: string) => {
  const slotRef = ref(realtimeDb, `${RTDB_PATH}/slots/${date}/${id}`);
  await remove(slotRef);
  return true;
};
