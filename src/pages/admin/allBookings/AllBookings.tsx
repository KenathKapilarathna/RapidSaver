/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { message, Table } from "antd";
import {
  getRecentBookingsByAdmin,
  setBookingStatus,
  setDriverOnRecentBooking,
} from "../../../config/BookingFunctions";
import { RootState } from "../../../redux/store";
import { useSelector } from "react-redux";
import { STEPS } from "../../../config/conf";
import { getDrivers } from "../../../config/DriverFunctions";
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
  updatedAt: string;
  user?: string;
  driverId?: string;
}
interface Driver {
  name: string;
  email: string;
  phone: string;
  staffId?: string;
  licenceNo?: string;
  id: string;
  password: string;
}

const AllBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const user = useSelector((state: RootState) => state.auth.user);
  const [drivers, setDrivers] = useState<Driver[]>([]);

  useEffect(() => {
    const getRecentBookings = async () => {
      if (!user) {
        setError("User not found. Please log in.");
        return;
      }
      setIsLoading(true);
      try {
        const driverData = await getDrivers();
        const driverList: Driver[] = Object.values(driverData).map(
          (driver: any) => ({
            id: driver.uid,
            name: driver.name,
            email: driver.email,
            phone: driver.phone,
            staffId: driver.staffId || "",
            licenceNo: driver.licenceNo || "",
            password: driver.password,
          })
        );
        setDrivers(driverList);
        const data = await getRecentBookingsByAdmin();
        const formattedData: Booking[] = data.map((item: any) => ({
          id: item.id,
          userId: item.userId || "",
          driverId: item.driverId || "",
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
          user: item.user || "",
        }));
        setBookings(formattedData);
      } catch (err) {
        setError("Failed to fetch past bookings");
      } finally {
        setIsLoading(false);
      }
    };
    getRecentBookings();
  }, []);

  const changeDriver = async (bookingId: string, driverId: string) => {
    setIsLoading(true);
    try {
      const data = await setDriverOnRecentBooking(bookingId, driverId);
      const formattedData: Booking[] = data.map((item: any) => ({
        id: item.id,
        userId: item.userId || "",
        driverId: item.driverId || "",
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
        user: item.name || item.user || "",
      }));
      setBookings(formattedData);
      message.success("Driver changed successfully");
    } catch (err) {
      setError("Failed to change driver");
      message.error("Driver change failed");
    } finally {
      setIsLoading(false);
    }
  };

  const updateBookingStatus = async (
    id: string,
    status: string,
    oldStatus: string
  ) => {
    if (status === oldStatus) return;
    setIsLoading(true);
    try {
      const data = await setBookingStatus(id, status);
      const formattedData: Booking[] = data.map((item: any) => ({
        id: item.id,
        userId: item.userId || "",
        driverId: item.driverId || "",
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
        user: item.name || item.user || "",
      }));
      setBookings(formattedData);
      message.success("Status changed successfully");
    } catch (err) {
      setError("Failed to update booking status");
      message.error("Status change failed");
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    {
      title: "Info",
      key: "dateTime",
      render: (_: any, record: Booking) => (
        <div>
          <div>
            <ul className="list-none p-0 m-0">
              <li className="text-gray-600">Booking ID: {record.id}</li>
              <li className="font-medium">Date: {record.selectedDate}</li>
              <li className="text-gray-600">
                Time Slot: {record.selectedTimeSlot}
              </li>
              <li className="text-gray-600">User: {record.userId}</li>
              <li className="text-gray-600">
                Driver:
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded ml-2">
                  {record.driverId || "N/A"}
                </span>
              </li>
            </ul>
          </div>
          <select
            defaultValue={record.driverId || ""}
            onChange={(e) => changeDriver(record.id, e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 mt-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">N/A</option>
            {drivers.map((driver) => (
              <option key={driver.id} value={driver.id}>
                {driver.name} - {driver.email}
              </option>
            ))}
          </select>
        </div>
      ),
    },
    {
      title: "Services",
      key: "services",
      render: (_: any, record: Booking) => (
        <ul className="list-disc pl-5">
          {record.services.map((service) => (
            <li key={service.id} className="text-gray-700">
              <span className="font-medium">{service.name}</span> -{" "}
              <span className="text-green-600">
                {service.price.toFixed(2)} LKR
              </span>
            </li>
          ))}
          {record.pickupRequested && (
            <li className="text-blue-600">Pickup Service - 1000 LKR</li>
          )}
          {record.pickupRequested && (
            <li className="text-gray-500">
              Pickup location - {record.pickupAddress}
            </li>
          )}
        </ul>
      ),
    },
    {
      title: "Total Price",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (totalPrice: number) => (
        <span className="font-bold text-green-700">
          {totalPrice.toFixed(2)} LKR
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (_: any, record: Booking) => (
        <>
          <p>
            Current:{" "}
            <span
              className={`px-2 py-1 rounded ${
                record.status === "pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {STEPS[record.status as keyof typeof STEPS]?.label.toUpperCase()}
            </span>
          </p>
          <select
            defaultValue={record.status}
            onChange={(e) =>
              updateBookingStatus(record.id, e.target.value, record.status)
            }
            className="border border-gray-300 rounded px-2 py-1 mt-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Object.values(STEPS).map((step) => (
              <option key={step.status} value={step.status}>
                {step.label}
              </option>
            ))}
          </select>
        </>
      ),
    },
    {
      title: "Vehicle Info",
      key: "vehicleInfo",
      render: (_: any, record: Booking) => (
        <ul className="list-none p-0 m-0">
          <li className="font-medium">Type: {record.vehicleType}</li>
          <li className="text-gray-600">Brand: {record.vehicleBrand}</li>
          <li className="text-gray-600">Model: {record.vehicleModel}</li>
          <li className="text-gray-600">Year: {record.manufacturingYear}</li>
          <li className="text-gray-600">Plate: {record.registrationPlate}</li>
          <li className="text-gray-600">
            Last Service: {record.timeSinceLastService}
          </li>
        </ul>
      ),
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Recent Bookings</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <Table
        dataSource={bookings}
        rowKey="id"
        columns={columns}
        loading={isLoading}
        pagination={{ pageSize: 5 }}
        bordered
      />
    </div>
  );
};

export default AllBookings;
