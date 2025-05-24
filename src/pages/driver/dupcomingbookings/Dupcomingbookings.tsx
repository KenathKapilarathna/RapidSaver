/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Table } from "antd";
import {
  getRecentUserBookingsByDriver,
} from "../../../config/BookingFunctions";
import { RootState } from "../../../redux/store";
import { useSelector } from "react-redux";
import { STEPS } from "../../../config/conf";
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
  userName?: string;
  userPhone?: string;
  userEmail?: string;
}

const DriverUpcomingBooking = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    const getPastBookings = async () => {
      if (!user) {
      
        return;
      }
      setIsLoading(true);
      try {
        
        const data = await getRecentUserBookingsByDriver(user.uid);
        const formattedData: Booking[] = data.map((item: any) => ({
          id: item.id,
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
          user: user.name || item.user || "",
        }));
        setBookings(formattedData);
      } catch (err) {
        
      } finally {
        setIsLoading(false);
      }
    };
    getPastBookings();
  }, []);

  const columns = [
    {
      title: "Date & Time",
      key: "dateTime",
      render: (_: any, record: Booking) => (
        <ul className="list-none p-0 m-0">
          <li className="font-medium">Date: {record.selectedDate}</li>
          <li className="text-gray-600">
            Time Slot: {record.selectedTimeSlot}
          </li>
          <li>User: {record.userId}</li>
        </ul>
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
      render: (status: string) => (
        <span
          className={`px-2 py-1 rounded ${
            status === "comlpeted"
              ? "bg-green-100 text-green-800"
              : "bg-blue-100 text-blue-800"
          }`}
        >
          {STEPS[status as keyof typeof STEPS]?.label.toUpperCase() || status}
        </span>
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
      <h1 className="text-2xl font-bold mb-4">Upcomming Bookings</h1>
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

export default DriverUpcomingBooking;
