/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Card, List, message } from "antd";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { getUpcommingUserBookings } from "../../../config/BookingFunctions";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { STEPS } from "../../../config/conf";
import { getDriver } from "../../../config/DriverFunctions";

dayjs.extend(duration);

interface Service {
  id: string;
  name: string;
  price: number;
  description: string;
  pic?: string;
}

interface Booking {
  id: string;
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
  driverId: string;
  driver?: {
    name: string;
    email: string;
    phone: string;
    licenceNo: string;
  } | null;
  updatedAt: string;
}

const UpcomingBooking = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (!user) {
      setError("User not found. Please log in.");
      return;
    }

    const getDriverDetails = async (driverId: string) => {
      const driverData = await getDriver(driverId);
      console.log(driverData);
      if (!driverData) {
        return null;
      }
      return {
        name: driverData.name,
        email: driverData.email,
        phone: driverData.phone,
        licenceNo: driverData.licenceNo,
      };
    };

    const getAllUpcomingBookings = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getUpcommingUserBookings(user.uid);
        const formattedData: Booking[] = await Promise.all(
          data.map(async (item: any) => ({
            driver: item.driverId
              ? await getDriverDetails(item.driverId)
              : null,
            id: item.id,
            driverId: item.driverId || "",
            userId: item.userId || "",
            services: item.services || [],
            vehicleType: item.vehicleType || "",
            vehicleBrand: item.vehicleBrand || "",
            vehicleModel: item.vehicleModel || "",
            manufacturingYear: item.manufacturingYear || "",
            registrationPlate: item.registrationPlate || "",
            timeSinceLastService: item.timeSinceLastService || "",
            selectedDate: item.selectedDate || "",
            selectedTimeSlot: item.selectedTimeSlot || "",
            pickupRequested: item.pickupRequested || false,
            pickupAddress: item.pickupAddress || "",
            totalPrice: item.totalPrice || 0,
            status: item.status || "",
            createdAt: item.createdAt || "",
            updatedAt: item.updatedAt || "",
          }))
        );
        console.log(formattedData);
        setBookings(formattedData);
      } catch (err) {
        setError("Failed to fetch bookings. Please try again later.");
        message.error("Failed to fetch bookings.");
      } finally {
        setIsLoading(false);
      }
    };

    getAllUpcomingBookings();
  }, [user]);

  if (error) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Upcoming Bookings</h1>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Upcoming Bookings</h1>
      <List
        grid={{ gutter: 16, column: 1 }}
        dataSource={bookings}
        loading={isLoading}
        renderItem={(item) => (
          <List.Item>
            <Card
              title={
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Booking Details</span>
                  <span
                    className={`px-4 py-1 rounded-lg flex text-sm justify-center align-middle ${
                      item.status === "pending"
                        ? "bg-yellow-400 text-black"
                        : "bg-blue-500 text-white"
                    }`}
                  >
                    {STEPS[item.status as keyof typeof STEPS]?.label ||
                      "Unknown Status"}
                  </span>
                </div>
              }
              className="rounded-lg shadow-md"
            >
              <div className="mb-4">
                <h2 className="text-lg font-semibold">Services</h2>
                <ul className="list-disc pl-5">
                  {item.services.map((service) => (
                    <li key={service.id}>
                      {service.name} - {service.price} LKR
                    </li>
                  ))}
                </ul>
              </div>
              {item.pickupRequested && (
                <div className="mb-4">
                  <h2 className="text-lg font-semibold">Pickup Information</h2>
                  <p>
                    <strong>Pickup Address:</strong>{" "}
                    {item.pickupAddress || "Not provided"}
                  </p>
                </div>
              )}

              <div className="mb-4">
                <h2 className="text-lg font-semibold">Vehicle Details</h2>
                <p>
                  <strong>Type:</strong> {item.vehicleType}
                </p>
                <p>
                  <strong>Brand:</strong> {item.vehicleBrand}
                </p>
                <p>
                  <strong>Model:</strong> {item.vehicleModel}
                </p>
                <p>
                  <strong>Year:</strong> {item.manufacturingYear}
                </p>
                <p>
                  <strong>Registration Plate:</strong> {item.registrationPlate}
                </p>
              </div>

              <div className="mb-4">
                <h2 className="text-lg font-semibold">Booking Info</h2>
                <p>
                  <strong>User:</strong> {user ? user.name : item.userId}
                </p>
                <p>
                  <strong>Date:</strong> {item.selectedDate}
                </p>
                <p>
                  <strong>Time:</strong> {item.selectedTimeSlot}
                </p>
                <p>
                  <strong>Total Price:</strong> {item.totalPrice} LKR
                </p>
              </div>
              {item.driverId && (
                <div className="mb-4">
                  <h2 className="text-lg font-semibold">Driver's Info</h2>
                  <p>
                    <strong>Name:</strong> {item.driver?.name}
                  </p>
                  <p>
                    <strong>Phone:</strong> {item.driver?.phone}
                  </p>
                  <p>
                    <strong>Email:</strong> {item.driver?.email}
                  </p>
                  <p>
                    <strong>licence No:</strong> {item.driver?.licenceNo}
                  </p>
                </div>
              )}
              {!item.driverId && (
                <div className="mb-4">
                  <p className="text-base font-semibold">
                    Driver is not assigned yet.
                  </p>
                </div>
              )}
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default UpcomingBooking;
