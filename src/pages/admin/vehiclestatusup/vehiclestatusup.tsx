/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  CalendarCheck,
  Truck,
  MapPin,
  Clock,
  Wrench,
  CheckCircle,
  Home,
  ArrowRight,
} from "lucide-react";
import {
  getRecentBookingsByAdmin,
  setBookingStatus,
} from "../../../config/BookingFunctions";
import { message } from "antd";
import { STEPS } from "../../../config/conf";

const steps = [
  {
    icon: Clock,
    label: "Pending",
    status: "pending",
    step: 0,
  },
  {
    icon: CalendarCheck,
    label: "Booking Confirmed",
    status: "bookingConfirmed",
    step: 1,
  },
  {
    icon: Truck,
    label: "Vehicle Picked Up",
    status: "vehiclePickedUp",
    step: 2,
  },
  {
    icon: Truck,
    label: "En Route to Service Station",
    status: "enRouteToServiceStation",
    step: 3,
  },
  {
    icon: MapPin,
    label: "Arrived at Service Station",
    status: "arrivedAtServiceStation",
    step: 4,
  },
  {
    icon: Clock,
    label: "Waiting",
    status: "waiting",
    step: 5,
  },
  {
    icon: Wrench,
    label: "Service in Progress",
    status: "serviceInProgress",
    step: 6,
  },
  {
    icon: CheckCircle,
    label: "Service Completed",
    status: "serviceCompleted",
    step: 7,
  },
  {
    icon: Truck,
    label: "En Route to Customer",
    status: "enRouteToCustomer",
    step: 8,
  },
  {
    icon: Home,
    label: "Drop Off Completed",
    status: "completed",
    step: 9,
  },
];

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

// which steps driver can control
const driverEditable = [1, 2, 3, 7, 8];
// adminEditable will be all indices 0–8
const adminEditable = steps.map((_, i) => i);

// const role = "driver";

export default function TrackingJourney() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedBookingId, setSelectedBookingId] = useState<string>("");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [role, setRole] = useState<string>("admin");

  useEffect(() => {
    const getRecentBookings = async () => {
      try {
        const data = await getRecentBookingsByAdmin();
        if (!data || data.length === 0) {
          setIsLoading(false);
          return;
        }
        const formattedData: Booking[] = data.map((item: any) => ({
          id: item.id,
          driverId: item.driverId || "",
          driver: item.driver || null,
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
        setAllBookings(formattedData);
        setSelectedBookingId(formattedData[0]?.id || "");
      } catch (err) {
        setError("Failed to fetch bookings. Please try again later.");
        message.error("Failed to fetch bookings.");
      } finally {
        setIsLoading(false);
      }
    };
    getRecentBookings();
  }, []);

  useEffect(() => {
    if (!selectedBookingId) return;
    const booking = allBookings.find((b) => b.id === selectedBookingId);
    if (!booking) return;
    setSelectedBooking(booking);
    setCurrentStep(STEPS[booking.status as keyof typeof STEPS].step || 0);
  }, [selectedBookingId, allBookings]);

  const editableSteps =
    role === "admin" ? adminEditable : role === "driver" ? driverEditable : [];

  // get next editable for driver/admin, or do nothing for customer
  const getNext = () => {
    if (role === "admin") {
      return Math.min(currentStep + 1, steps.length - 1);
    }
    const next = editableSteps.find((i) => i > currentStep);
    return next ?? currentStep;
  };

  const getPrev = () => {
    if (role === "admin") {
      return Math.max(currentStep - 1, 0);
    }
    const prev = editableSteps.filter((i) => i < currentStep);
    return prev.length ? prev[prev.length - 1] : currentStep;
  };

  const saveChanges = async () => {
    {
      if (selectedBooking) {
        const allData = await setBookingStatus(
          selectedBooking.id,
          steps[currentStep].status
        );

        const formattedData: Booking[] = allData.map((item: any) => ({
          id: item.id,
          driverId: item.driverId || "",
          driver: item.driver || null,
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
        setAllBookings(formattedData);
        setSelectedBooking({
          ...selectedBooking,
          status: steps[currentStep].status,
        });
        // Simulate saving changes (replace with actual API call if needed)
        message.success("Changes saved successfully!");
      }
    }
  };

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

  const disabledStyle = {
    opacity: 0.5,
    cursor: "not-allowed",
  } as const;

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f9fafb",
        padding: "1.5rem",
      }}
    >
      {/* Bookings Selector */}
      <section
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: "700" }}>
            Vehicle Wash Journey
          </h1>
          {isLoading && <p>Loading...</p>}
          {allBookings.length === 0 && !isLoading && (
            <p style={{ color: "#6b7280" }}>No bookings available</p>
          )}
        </div>
        {allBookings.length > 0 && !isLoading && (
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
            {allBookings.map((booking) => (
              <option key={booking.id} value={booking.id}>
                {`${booking.registrationPlate} (${booking.vehicleType})`}
              </option>
            ))}
          </select>
        )}
      </section>
      {!isLoading && allBookings.length > 0 && (
        <section>
          {/* Journey Steps */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "1rem",
            }}
          >
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isActive = idx === currentStep;
              const editable = editableSteps.includes(idx);

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
                      onClick={() => editable && setCurrentStep(idx)}
                      style={{
                        padding: "1rem",
                        borderRadius: "9999px",
                        boxShadow: isActive
                          ? "0 0 0 4px rgba(59, 130, 246, 0.5)"
                          : "0 1px 3px rgba(0,0,0,0.1)",
                        backgroundColor: isActive ? "#3b82f6" : "white",
                        transform: isActive ? "scale(1.1)" : "scale(1)",
                        transition: "all 0.2s",
                        cursor: editable ? "pointer" : "default",
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
                  {idx < steps.length - 1 && (
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
            })}
          </div>

          {/* Role‑based Controls */}
          <div className="flex justify-between mt-4">
            {
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "2rem",
                  gap: "1rem",
                }}
              >
                <button
                  onClick={() => setCurrentStep(getPrev())}
                  disabled={getPrev() === currentStep}
                  style={
                    getPrev() === currentStep
                      ? { ...buttonStyle, ...disabledStyle }
                      : buttonStyle
                  }
                  type="button"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentStep(getNext())}
                  disabled={getNext() === currentStep}
                  style={
                    getNext() === currentStep
                      ? { ...buttonStyle, ...disabledStyle }
                      : buttonStyle
                  }
                  type="button"
                >
                  Next
                </button>
              </div>
            }
            {steps[currentStep].status !== selectedBooking?.status && (
              <div>
                <button
                  onClick={() => saveChanges()}
                  style={buttonStyle}
                  type="button"
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>

          {/* Current Status */}
          <div
            style={{
              marginTop: "2rem",
              backgroundColor: "white",
              padding: "1.5rem",
              borderRadius: "0.5rem",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            <h2
              style={{
                fontSize: "1.125rem",
                fontWeight: "600",
                marginBottom: "0.25rem",
              }}
            >
              Current Status:{" "}
              <span className="text-lg font-medium text-blue-600 bg-blue-100 rounded-full px-2 py-1">
                {selectedBooking?.status &&
                  STEPS[selectedBooking.status as keyof typeof STEPS]?.label}
              </span>
            </h2>
            <p style={{ color: "#4b5563" }}></p>
            <p>Driver: {selectedBooking?.driverId || "N/A"}</p>
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
              {selectedBooking?.services.map((service) => (
                <li key={service.id}>
                  {service.name} - {service.price} LKR
                </li>
              ))}
              {selectedBooking?.pickupRequested && (
                <li>Pickup Service - 1000 LKR</li>
              )}
            </ul>

            {/* Pickup Info */}
            {selectedBooking?.pickupRequested && (
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
                  Pickup Address: {selectedBooking?.pickupAddress || "N/A"}
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
              Type: {selectedBooking?.vehicleType}
            </p>
            <p style={{ color: "#4b5563" }}>
              Brand: {selectedBooking?.vehicleBrand}
            </p>
            <p style={{ color: "#4b5563" }}>
              Model: {selectedBooking?.vehicleModel}
            </p>
            <p style={{ color: "#4b5563" }}>
              Year: {selectedBooking?.manufacturingYear}
            </p>
            <p style={{ color: "#4b5563" }}>
              Registration Plate: {selectedBooking?.registrationPlate}
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
            <p style={{ color: "#4b5563" }}>
              User: {selectedBooking?.userId || "N/A"}
            </p>
            <p style={{ color: "#4b5563" }}>
              Date: {selectedBooking?.selectedDate}
            </p>
            <p style={{ color: "#4b5563" }}>
              Time: {selectedBooking?.selectedTimeSlot}
            </p>
            <p style={{ color: "#4b5563" }}>
              Total Price: {selectedBooking?.totalPrice} LKR
            </p>
            {selectedBooking && selectedBooking.driver ? (
              <div className="mt-4">
                <h2 className="text-lg font-semibold">Driver's Info</h2>
                <p>Name: {selectedBooking.driver?.name}</p>
                <p>Phone: {selectedBooking.driver?.phone}</p>
                <p>Email: {selectedBooking.driver?.email}</p>
                <p>licence No: {selectedBooking.driver?.licenceNo}</p>
              </div>
            ) : (
              <div className="mt-4">
                <p className="text-base font-semibold">
                  Driver is not assigned yet.
                </p>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
