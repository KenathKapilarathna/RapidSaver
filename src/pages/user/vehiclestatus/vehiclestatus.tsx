/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { getUpcommingUserBookings } from "../../../config/BookingFunctions";
import { message } from "antd";
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
  driverId?: string;
  driver: {
    name: string;
    email: string;
    phone: string;
    licenceNo: string;
  } | null;
}

export default function TrackingJourney() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedBookingId, setSelectedBookingId] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (!user) {
      setError("User not found. Please log in.");
      return;
    }

    const fetchUpcomingBookings = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getUpcommingUserBookings(user.uid);
        if (!data || data.length === 0) {
          setIsLoading(false);
          return;
        }
        const formattedData: Booking[] = data.map((item: any) => ({
          id: item.id,
          driverId: item.driverId || "",
          driver: item.driver,
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
        }));
        setBookings(formattedData);
        setSelectedBookingId(formattedData[0]?.id || "");
      } catch (err) {
        setError("Failed to fetch bookings. Please try again later.");
        message.error("Failed to fetch bookings.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUpcomingBookings();
  }, [user]);

  useEffect(() => {
    if (!selectedBookingId) return;
    const booking = bookings.find((b) => b.id === selectedBookingId);
    if (!booking) return;
    setSelectedBooking(booking);
    setCurrentStep(STEPS[booking.status as keyof typeof STEPS].step || 0);
  }, [selectedBookingId, bookings]);

  const buttonStyle = {
    padding: "0.5rem 1rem",
    border: "1px solid #3b82f6",
    borderRadius: "0.375rem",
    backgroundColor: "white",
    color: "#3b82f6",
    cursor: "pointer",
    fontSize: "0.875rem",
    fontWeight: "500",
  } as const;

  const renderStep = (
    step: (typeof STEPS)[keyof typeof STEPS],
    idx: number
  ) => {
    const Icon = step.icon;
    const isActive = idx === currentStep;

    return (
      <React.Fragment key={step.label}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              padding: "1rem",
              borderRadius: "9999px",
              boxShadow: isActive
                ? "0 0 0 4px rgba(59, 130, 246, 0.5)"
                : "0 1px 3px rgba(0,0,0,0.1)",
              backgroundColor: isActive ? "#3b82f6" : "white",
              transform: isActive ? "scale(1.1)" : "scale(1)",
              transition: "all 0.2s",
            }}
          >
            <Icon
              style={{
                width: "2rem",
                height: "2rem",
                color: isActive ? "white" : "#3b82f6",
              }}
            />
          </div>
          <span
            style={{
              marginTop: "0.5rem",
              fontSize: "0.875rem",
              fontWeight: "500",
              textAlign: "center",
              color: isActive ? "#111827" : "#6b7280",
            }}
          >
            {step.label}
          </span>
        </div>
        {idx < Object.keys(STEPS).length - 1 && (
          <ArrowRight
            style={{
              width: "1.5rem",
              height: "1.5rem",
              margin: "0 0.5rem",
              color: "#9ca3af",
              opacity: idx < currentStep ? 1 : 0.5,
            }}
          />
        )}
      </React.Fragment>
    );
  };

  return (
    <>
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#f9fafb",
          padding: "1.5rem",
        }}
      >
        
        <div className="flex justify-between items-center mb-4">
          <h1
            style={{
              fontSize: "1.5rem",
              fontWeight: "700",
              marginBottom: "2rem",
            }}
          >
            Vehicle Wash Journey
          </h1>
          {!isLoading && bookings.length > 0 && (
            <select
              value={selectedBookingId}
              onChange={(e) => setSelectedBookingId(e.target.value)}
              style={{
                ...buttonStyle,
                border: "1px solid #6b7280",
                color: "#374151",
                paddingRight: "2rem",
                appearance: "none",
                backgroundImage:
                  'url(\'data:image/svg+xml;charset=UTF-8,<svg width="10" height="7" xmlns="http://www.w3.org/2000/svg"><path d="M1 1l4 4 4-4" stroke="%236b7280" fill="none" stroke-width="2"/></svg>\')',
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 0.75rem center",
              }}
            >
              {bookings.map((booking) => (
                <option key={booking.id} value={booking.id}>
                  {`${booking.registrationPlate} (${booking.vehicleType})`}
                </option>
              ))}
            </select>
          )}
        </div>

        
        {isLoading && <p>Loading...</p>}

      
        {error && (
          <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>
        )}

        
        {!isLoading && bookings.length === 0 && (
          <p style={{ color: "#6b7280" }}>You have no upcoming bookings.</p>
        )}

        
        {!isLoading && bookings.length > 0 && (
          <>
            
            <section
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "2rem",
              }}
            >
              <div /> 
            </section>

            {/* Journey Steps */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: "1rem",
              }}
            >
              {Object.values(STEPS).map(renderStep)}
            </div>

            {/* Booking Details Section */}
            {selectedBooking && (
              <section
                style={{
                  marginTop: "2rem",
                  backgroundColor: "white",
                  padding: "1.5rem",
                  borderRadius: "0.5rem",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
              >
                {/* Services */}
                <h2
                  style={{
                    fontSize: "1.125rem",
                    fontWeight: "600",
                    marginTop: "1.5rem",
                    marginBottom: "0.25rem",
                  }}
                >
                  Services
                </h2>
                <ul style={{ color: "#4b5563", marginBottom: "1rem" }}>
                  {selectedBooking.services.map((service) => (
                    <li key={service.id}>
                      {service.name} - {service.price} LKR
                    </li>
                  ))}
                  {selectedBooking.pickupRequested && (
                    <li>Pickup Service - 1000 LKR</li>
                  )}
                </ul>

                {/* Pickup Info */}
                {selectedBooking.pickupRequested && (
                  <div>
                    <h2
                      style={{
                        fontSize: "1.125rem",
                        fontWeight: "600",
                        marginBottom: "0.25rem",
                      }}
                    >
                      Pickup Information
                    </h2>
                    <p style={{ color: "#4b5563" }}>
                      Pickup Address: {selectedBooking.pickupAddress || "N/A"}
                    </p>
                  </div>
                )}

                {/* Vehicle Info */}
                <h2
                  style={{
                    fontSize: "1.125rem",
                    fontWeight: "600",
                    marginTop: "1.5rem",
                    marginBottom: "0.25rem",
                  }}
                >
                  Vehicle Details
                </h2>
                <p style={{ color: "#4b5563" }}>
                  Type: {selectedBooking.vehicleType}
                </p>
                <p style={{ color: "#4b5563" }}>
                  Brand: {selectedBooking.vehicleBrand}
                </p>
                <p style={{ color: "#4b5563" }}>
                  Model: {selectedBooking.vehicleModel}
                </p>
                <p style={{ color: "#4b5563" }}>
                  Year: {selectedBooking.manufacturingYear}
                </p>
                <p style={{ color: "#4b5563" }}>
                  Registration Plate: {selectedBooking.registrationPlate}
                </p>

                {/* Booking Info */}
                <h2
                  style={{
                    fontSize: "1.125rem",
                    fontWeight: "600",
                    marginTop: "1.5rem",
                    marginBottom: "0.25rem",
                  }}
                >
                  Booking Info
                </h2>
                <p style={{ color: "#4b5563" }}>User: {user?.name || "N/A"}</p>
                <p style={{ color: "#4b5563" }}>
                  Date: {selectedBooking.selectedDate}
                </p>
                <p style={{ color: "#4b5563" }}>
                  Time: {selectedBooking.selectedTimeSlot}
                </p>
                <p style={{ color: "#4b5563" }}>
                  Total Price: {selectedBooking.totalPrice} LKR
                </p>
                {selectedBooking.driver && (
                  <div className="mt-4">
                    <h2 className="text-lg font-semibold">Driver's Info</h2>
                    <p>Name: {selectedBooking.driver?.name}</p>
                    <p>Phone: {selectedBooking.driver?.phone}</p>
                    <p>Email: {selectedBooking.driver?.email}</p>
                    <p>licence No: {selectedBooking.driver?.licenceNo}</p>
                  </div>
                )}
                {!selectedBooking.driverId && (
                  <div className="mt-4">
                    <p className="text-base font-semibold">
                      Driver is not assigned yet.
                    </p>
                  </div>
                )}
              </section>
            )}
          </>
        )}
      </div>
    </>
  );
}
