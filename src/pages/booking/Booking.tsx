
import {
  message,
  Checkbox,
  Modal,
  Input,
  Radio,
  Spin,
  Form,
  Divider,
} from "antd";
import { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  CarOutlined,
  NumberOutlined,
  ShoppingCartOutlined,
  HistoryOutlined,
  EnvironmentOutlined,
  DeleteOutlined,
  CreditCardOutlined,
  CheckCircleOutlined,
  LockOutlined,
  SafetyOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import * as Geocode from "react-geocode";
import { getSlotsAsObject } from "../../config/SlotFunctions";
import { getServicesAsList } from "../../config/ServiceFunctions";
import { addBooking } from "../../config/BookingFunctions";

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

// Initialize Geocoding
Geocode.setKey(import.meta.env.VITE_GEOCODING_API_KEY);
Geocode.setLanguage("en");
Geocode.setRegion("es");
Geocode.setLocationType("ROOFTOP");

// Coordinates of your car wash center
const SERVICE_CENTER_LOCATION = {
  lat: parseFloat(import.meta.env.VITE_SERVICE_CENTER_LAT),
  lng: parseFloat(import.meta.env.VITE_SERVICE_CENTER_LNG),
};

const MAX_DISTANCE_KM = 15;
const TRANSPORT_FEE = 1000;

const Booking = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [vehicleType, setVehicleType] = useState("");
  const [vehicleBrand, setVehicleBrand] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [manufacturingYear, setManufacturingYear] = useState("");
  const [registrationPlate, setRegistrationPlate] = useState("");
  const [timeSinceLastService, setTimeSinceLastService] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pickupRequested, setPickupRequested] = useState(false);
  const [pickupAddress, setPickupAddress] = useState("");
  const [distance, setDistance] = useState<number | null>(null);
  const [eligibility, setEligibility] = useState<
    "eligible" | "not-eligible" | "unknown" | "loading"
  >("unknown");
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [cardType, setCardType] = useState<string | null>(null);
  const [cardFlipped, setCardFlipped] = useState(false);
  const cvvRef = useRef<any>(null);

  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [availableServices, setAvailableServices] = useState<Service[]>([]);

  const lastServiceOptions = [
    "Less than 1 month",
    "1-3 months",
    "3-6 months",
    "6-12 months",
    "More than 1 year",
    "First service",
  ];

  // service list handling
  useEffect(() => {
    const getAllServices = async () => {
      const data = await getServicesAsList();
      setAvailableServices(
        data.map((service) => ({
          ...service,
          id: service.id || "",
        }))
      );
    };
    getAllServices();
  }, []);

  // time slots handling
  useEffect(() => {
    const getAllSlots = async () => {
      setSelectedTimeSlot("");
      const dayNames: string[] = [
        "sun",
        "mon",
        "tue",
        "wed",
        "thu",
        "fri",
        "sat",
      ];
      const dayIndex = new Date(selectedDate).getDay(); // 0 (Sun) to 6 (Sat)
      const dayKey = dayNames[dayIndex];
      const slotsForDay = await getSlotsAsObject(selectedDate, dayKey);
      setTimeSlots(slotsForDay);
    };
    if (selectedDate) getAllSlots();
  }, [selectedDate]);

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  useEffect(() => {
    if (!pickupRequested || !pickupAddress || pickupAddress.length < 5) {
      setEligibility("unknown");
      setDistance(null);
      return;
    }

    const timer = setTimeout(async () => {
      setEligibility("loading");
      try {
        const response = await Geocode.fromAddress(pickupAddress);
        const { lat, lng } = response.results[0].geometry.location;
        const calculatedDistance = calculateDistance(
          lat,
          lng,
          SERVICE_CENTER_LOCATION.lat,
          SERVICE_CENTER_LOCATION.lng
        );
        setDistance(calculatedDistance);
        setEligibility(
          calculatedDistance <= MAX_DISTANCE_KM ? "eligible" : "not-eligible"
        );
      } catch (error) {
        console.error("Error calculating distance:", error);
        setEligibility("unknown");
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [pickupAddress, pickupRequested]);

  // Detect card type based on number
  useEffect(() => {
    if (!cardNumber) {
      setCardType(null);
      return;
    }

    
    if (/^4/.test(cardNumber)) {
      setCardType("visa");
    }
    
    else if (/^5[1-5]/.test(cardNumber)) {
      setCardType("mastercard");
    }
    
    else if (/^3[47]/.test(cardNumber)) {
      setCardType("amex");
    }
    
    else if (/^6(?:011|5)/.test(cardNumber)) {
      setCardType("discover");
    }
    
    else if (/^3(?:0[0-5]|[68])/.test(cardNumber)) {
      setCardType("diners");
    }
    
    else if (/^(?:2131|1800|35)/.test(cardNumber)) {
      setCardType("jcb");
    } else {
      setCardType(null);
    }
  }, [cardNumber]);

  const handleSlotClick = (slot: string) => {
    setSelectedTimeSlot(slot);
    message.success(`Time slot ${slot} selected`);
  };

  const handleServiceSelection = (service: Service, checked: boolean) => {
    if (checked) {
      setSelectedServices([...selectedServices, service]);
    } else {
      setSelectedServices(selectedServices.filter((s) => s.id !== service.id));
    }
  };

  const calculateTotalPrice = () => {
    const servicesTotal = selectedServices.reduce(
      (total, service) => total + service.price,
      0
    );
    const transportFee =
      pickupRequested && eligibility === "eligible" ? TRANSPORT_FEE : 0;
    return servicesTotal + transportFee;
  };

  const validateForm = () => {
    const missingFields = [];

    if (selectedServices.length === 0)
      missingFields.push("At least one service");
    if (!vehicleType) missingFields.push("Vehicle Type");
    if (!vehicleBrand.trim()) missingFields.push("Vehicle Brand");
    if (!vehicleModel.trim()) missingFields.push("Vehicle Model");
    if (!manufacturingYear) missingFields.push("Manufacturing Year");
    if (!registrationPlate.trim()) missingFields.push("Registration Plate");
    if (!timeSinceLastService) missingFields.push("Time Since Last Service");
    if (!selectedDate) missingFields.push("Appointment Date");
    if (!selectedTimeSlot) missingFields.push("Time Slot");

    return missingFields;
  };

  const handlePaymentSubmit = async () => {
    setPaymentProcessing(true);

  
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setPaymentProcessing(false);
    setPaymentSuccess(true);

    
    await handleBookingSubmission();
  };

  const handleBookingSubmission = async () => {
    if (!user) return;

    const totalPrice = calculateTotalPrice();

    const bookingData: BookingData = {
      userId: user.id || "",
      vehicleType,
      vehicleBrand,
      vehicleModel,
      services: selectedServices,
      manufacturingYear,
      registrationPlate,
      timeSinceLastService,
      selectedDate,
      selectedTimeSlot,
      pickupRequested,
      pickupAddress: pickupRequested ? pickupAddress : "",
      totalPrice,
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await addBooking(bookingData);
      toast.success(
        `${selectedServices.length} service(s) booked successfully!`
      );

    
      setTimeout(() => {
        setPaymentModalVisible(false);
        navigate("/user/upcoming-bookings");
      }, 1500);
    } catch (err) {
      console.error("Error saving booking:", err);
      toast.error("Failed to complete booking. Please try again.");
      setPaymentModalVisible(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      message.warning("Please log in to book a service.");
      Swal.fire({
        title: "",
        html: `
          <div class="text-left">
        <p class="text-sm font-bold">You need to log in to book a service.</p>
        <p class="mb-4 text-sm">Please log in to your account or register if you don't have one.</p>
        <div class="flex justify-center gap-4 mt-4">
          <a href="/login" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all">Login</a>
          <a href="/register" class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all">Register</a>
        </div>
          </div>
        `,
        icon: "warning",
        showConfirmButton: false,
        background: "#fff",
        iconColor: "#f59e0b",
        customClass: {
          htmlContainer: "text-left",
        },
      });
      return;
    }

    const missingFields = validateForm();

    if (missingFields.length > 0) {
      Swal.fire({
        title: "Missing Information",
        html: `
          <div class="text-left">
            <p class="mb-2">Please complete these required fields:</p>
            <ul class="list-disc pl-5">
              ${missingFields.map((field) => `<li>${field}</li>`).join("")}
            </ul>
          </div>
        `,
        icon: "warning",
        confirmButtonText: "OK",
        background: "#fff",
        iconColor: "#f59e0b",
        confirmButtonColor: "#3b82f6",
        customClass: {
          htmlContainer: "text-left",
        },
      });
      return;
    }

    if (pickupRequested && eligibility === "not-eligible") {
      Swal.fire({
        title: "Pickup Not Available",
        text: "Vehicle pickup service is not available for your location",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    setIsSubmitting(true);
    setPaymentModalVisible(true);
  };

  const renderEligibilityMessage = () => {
    if (!pickupRequested) return null;

    switch (eligibility) {
      case "loading":
        return (
          <p className="text-blue-500 text-sm mt-2">Checking distance...</p>
        );
      case "eligible":
        return (
          <div className="text-green-600 text-sm mt-2">
            <p>
              Distance: {distance?.toFixed(1)} km (Eligible for pickup service)
            </p>
          </div>
        );
      case "not-eligible":
        return (
          <div className="text-red-600 text-sm mt-2">
            <p>
              Distance: {distance?.toFixed(1)} km (Not eligible - over 15km)
            </p>
          </div>
        );
      case "unknown":
        return pickupAddress ? (
          <p className="text-yellow-600 text-sm mt-2">
            Could not determine distance
          </p>
        ) : null;
      default:
        return null;
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/[^0-9]/g, "");
    if (v.length >= 3) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return value;
  };

  const getCardIcon = () => {
    switch (cardType) {
      case "visa":
        return (
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
            alt="Visa"
            className="h-6"
          />
        );
      case "mastercard":
        return (
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
            alt="Mastercard"
            className="h-6"
          />
        );
      case "amex":
        return (
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg"
            alt="Amex"
            className="h-6"
          />
        );
      case "discover":
        return (
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/5/57/Discover_Card_logo.svg"
            alt="Discover"
            className="h-6"
          />
        );
      case "diners":
        return (
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/2/22/Diners_Club_International_logo.svg"
            alt="Diners Club"
            className="h-6"
          />
        );
      case "jcb":
        return (
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/4/40/JCB_logo.svg"
            alt="JCB"
            className="h-6"
          />
        );
      default:
        return <CreditCardOutlined className="text-gray-400 text-xl" />;
    }
  };

  const renderCardFront = () => (
    <div
      className={`relative w-full h-48 rounded-xl p-6 shadow-lg transition-all duration-500 ${
        cardFlipped ? "opacity-0 rotate-y-180" : "opacity-100 rotate-y-0"
      }`}
      style={{
        background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
        transformStyle: "preserve-3d",
        backfaceVisibility: "hidden",
        position: cardFlipped ? "absolute" : "relative",
      }}
    >
      <div className="flex justify-between items-start">
        <div className="text-white font-bold text-xl">RapidSaver</div>
        <div className="bg-white p-1 rounded-md">{getCardIcon()}</div>
      </div>

      <div className="mt-8">
        <div className="text-white text-sm opacity-80 mb-1">Card Number</div>
        <div className="text-white text-2xl font-mono tracking-wider">
          {cardNumber ? formatCardNumber(cardNumber) : "•••• •••• •••• ••••"}
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <div>
          <div className="text-white text-sm opacity-80 mb-1">Card Holder</div>
          <div className="text-white text-lg uppercase">
            {cardName || "YOUR NAME"}
          </div>
        </div>
        <div>
          <div className="text-white text-sm opacity-80 mb-1">Expires</div>
          <div className="text-white text-lg">{cardExpiry || "••/••"}</div>
        </div>
      </div>

      <div className="absolute bottom-4 right-6">
        <div className="flex items-center">
          <LockOutlined className="text-white mr-1" />
          <span className="text-white text-xs">Secure Payment</span>
        </div>
      </div>
    </div>
  );

  const renderCardBack = () => (
    <div
      className={`relative w-full h-48 rounded-xl p-6 shadow-lg transition-all duration-500 ${
        cardFlipped ? "opacity-100 rotate-y-0" : "opacity-0 rotate-y-180"
      }`}
      style={{
        background: "linear-gradient(135deg, #6b7280, #4b5563)",
        transformStyle: "preserve-3d",
        backfaceVisibility: "hidden",
        position: cardFlipped ? "relative" : "absolute",
        top: 0,
        left: 0,
      }}
    >
      <div className="h-10 bg-black w-full absolute top-6 left-0"></div>

      <div className="mt-16 flex justify-end">
        <div className="bg-white rounded-md p-2 text-right w-24">
          <div className="text-black text-xs mb-1">CVV</div>
          <div className="text-black font-mono">
            {cardCvv ? "••" + cardCvv.slice(-1) : "•••"}
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-6 right-6">
        <div className="flex justify-between items-center">
          <div className="text-white text-xs opacity-60">
            This is a simulated card for demonstration purposes only
          </div>
          <div className="bg-white p-1 rounded-md">{getCardIcon()}</div>
        </div>
      </div>
    </div>
  );

  const handleCvvFocus = () => {
    setCardFlipped(true);
  };

  const handleCvvBlur = () => {
    setCardFlipped(false);
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, "");
    setCardNumber(value);
    if (value.length > 0) {
      setCardFlipped(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <header className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12 px-4 text-center">
        <div
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1480&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.2,
          }}
          className="absolute inset-0"
        ></div>
        <div className="relative max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
            RapidSaver
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-90 font-light">
            Book your vehicle service with our certified technicians.
          </p>
          <div className="mt-6">
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 text-sm font-medium">
              <ClockCircleOutlined className="mr-2" />
              Fast, reliable service
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="relative bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="font-bold text-xl md:text-2xl">
                  Custom Service Package
                </h3>
                <div className="flex flex-wrap gap-3 text-sm mt-2 text-blue-100">
                  <span className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-3 py-1">
                    <ClockCircleOutlined className="mr-1" /> Multiple services
                    available
                  </span>
                </div>
              </div>
              <div className="text-2xl font-bold bg-white text-blue-600 py-2 px-5 rounded-xl shadow-md flex items-center">
                Rs.{calculateTotalPrice()}
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8">
            <form className="space-y-8">
              {!(user && user.id) && (
                <div>
                  <div className="flex items-center mb-4">
                    <ShoppingCartOutlined className="text-blue-500 mr-2" />
                    <span className="text-base text-gray-600 font-medium">
                      To proceed with booking a service, please{" "}
                      <a
                        href="/login"
                        className="text-blue-600 hover:underline"
                      >
                        log in
                      </a>{" "}
                      to your account or{" "}
                      <a
                        href="/register"
                        className="text-blue-600 hover:underline"
                      >
                        create a new account
                      </a>
                      .
                    </span>
                  </div>
                </div>
              )}

              {/* Services Selection */}
              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-4">
                    1
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    Select Services*
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availableServices.map((service) => (
                    <div
                      key={service.id}
                      className={`p-4 border rounded-lg transition-all cursor-pointer ${
                        selectedServices.some((s) => s.id === service.id)
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-blue-300"
                      }`}
                      onClick={() =>
                        handleServiceSelection(
                          service,
                          !selectedServices.some((s) => s.id === service.id)
                        )
                      }
                    >
                      <div className="flex items-start">
                        <Checkbox
                          checked={selectedServices.some(
                            (s) => s.id === service.id
                          )}
                          onChange={(e) =>
                            handleServiceSelection(service, e.target.checked)
                          }
                          className="mt-1"
                        />
                        <div className="ml-3 flex-1">
                          <div className="flex justify-between items-start">
                            <span className="font-medium text-gray-800">
                              {service.name}
                            </span>
                            <span className="font-bold text-blue-600">
                              Rs.{service.price}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            {service.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Vehicle Information */}
              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-4">
                    2
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    Vehicle Details
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="flex items-center text-gray-700 text-sm font-medium mb-1">
                      <CarOutlined className="mr-2 text-blue-500" /> Vehicle
                      Type*
                    </label>
                    <select
                      value={vehicleType}
                      onChange={(e) => setVehicleType(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg p-3.5 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all hover:border-blue-300 appearance-none bg-white select-with-arrow"
                      required
                    >
                      <option value="">Select Vehicle Type</option>
                      <option value="car">Car</option>
                      <option value="van">Van</option>
                      <option value="jeep">Jeep</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center text-gray-700 text-sm font-medium mb-1">
                      <CarOutlined className="mr-2 text-blue-500" /> Vehicle
                      Brand*
                    </label>
                    <input
                      type="text"
                      value={vehicleBrand}
                      onChange={(e) => setVehicleBrand(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg p-3.5 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all hover:border-blue-300"
                      placeholder="e.g. Toyota, Ford"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-gray-700 text-sm font-medium mb-1 flex items-center">
                      <CarOutlined className="mr-2 text-blue-500" /> Vehicle
                      Model*
                    </label>
                    <input
                      type="text"
                      value={vehicleModel}
                      onChange={(e) => setVehicleModel(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg p-3.5 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all hover:border-blue-300"
                      placeholder="e.g. Corolla, Mustang"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-gray-700 text-sm font-medium mb-1 flex items-center">
                      <CalendarOutlined className="mr-2 text-blue-500" />{" "}
                      Manufacturing Year*
                    </label>
                    <input
                      type="number"
                      value={manufacturingYear}
                      onChange={(e) => setManufacturingYear(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg p-3.5 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all hover:border-blue-300"
                      placeholder="e.g. 2020"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-gray-700 text-sm font-medium mb-1 flex items-center">
                      <NumberOutlined className="mr-2 text-blue-500" />{" "}
                      Registration Plate*
                    </label>
                    <input
                      type="text"
                      value={registrationPlate}
                      onChange={(e) => setRegistrationPlate(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg p-3.5 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all hover:border-blue-300"
                      placeholder="License plate number"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-gray-700 text-sm font-medium mb-1 flex items-center">
                      <HistoryOutlined className="mr-2 text-blue-500" /> Time
                      Since Last Service*
                    </label>
                    <select
                      value={timeSinceLastService}
                      onChange={(e) => setTimeSinceLastService(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg p-3.5 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all hover:border-blue-300 appearance-none bg-white select-with-arrow"
                      required
                    >
                      <option value="">Select time since last service</option>
                      {lastServiceOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Appointment Time */}
              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-4">
                    3
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    Appointment Time
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-gray-700 text-sm font-medium mb-1 flex items-center">
                      <CalendarOutlined className="mr-2 text-blue-500" /> Select
                      Date*
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg p-3.5 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all hover:border-blue-300"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-gray-700 text-sm font-medium mb-1 flex items-center">
                      <ClockCircleOutlined className="mr-2 text-blue-500" />{" "}
                      Time Slot*
                    </label>

                    {selectedTimeSlot ? (
                      <div className="flex items-center justify-between bg-green-50 border border-green-200 px-5 py-3 rounded-lg">
                        <span className="flex items-center text-green-800 font-medium">
                          <ClockCircleOutlined className="mr-3 text-green-600" />{" "}
                          {selectedTimeSlot}
                        </span>
                        <button
                          type="button"
                          onClick={() => setSelectedTimeSlot("")}
                          className="text-sm text-blue-600 hover:text-blue-800 font-medium px-3 py-1 rounded-lg hover:bg-blue-50 transition-all"
                        >
                          Change
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {selectedDate &&
                          timeSlots.map((slot) => (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => handleSlotClick(slot)}
                              className="px-2 py-2.5 rounded-lg transition-all border border-gray-200 hover:bg-blue-500 hover:text-white hover:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm font-medium"
                            >
                              {slot}
                            </button>
                          ))}
                        {!selectedDate && (
                          <p className="text-gray-500 text-sm mt-2 col-span-6">
                            Please select a date first
                          </p>
                        )}
                        {timeSlots.length === 0 && selectedDate && (
                          <p className="text-gray-500 text-sm mt-2 col-span-6">
                            Sorry, no slots available for the selected date
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Attendance Option - Now Optional */}
              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-4">
                    4
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    Attendance Option (Optional)
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <Checkbox
                      checked={pickupRequested}
                      onChange={(e) => setPickupRequested(e.target.checked)}
                      className="mt-1"
                    />
                    <div className="ml-3">
                      <label className="block text-gray-700 font-medium">
                        Request vehicle pickup service
                      </label>
                      <p className="text-sm text-gray-500 mt-1">
                        Our drivers will pick up your vehicle at your specified
                        location.
                      </p>

                      <p className="text-sm text-gray-500 mt-1">
                        We will return the vehicle to you from where we picked
                        it up.
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        The vehicle must be handed over to our drivers one hour
                        before the service is booked.
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        The pick up option is only available within 15 km from
                        our service station.
                      </p>
                    </div>
                  </div>

                  {pickupRequested && (
                    <div className="pl-8">
                      <div className="space-y-2">
                        <label className="text-gray-700 text-sm font-medium mb-1 flex items-center">
                          <EnvironmentOutlined className="mr-2 text-blue-500" />{" "}
                          Pickup Address
                        </label>
                        <input
                          type="text"
                          value={pickupAddress}
                          onChange={(e) => setPickupAddress(e.target.value)}
                          className="w-full border border-gray-200 rounded-lg p-3.5 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all hover:border-blue-300"
                          placeholder="Enter your full address for pickup"
                        />
                        {renderEligibilityMessage()}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Summary Section */}
              <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 mt-8 space-y-4">
                <h3 className="font-semibold text-lg text-gray-800">
                  Booking Summary
                </h3>

                {selectedServices.length > 0 ? (
                  <div className="space-y-3">
                    {selectedServices.map((service) => (
                      <div
                        key={service.id}
                        className="flex justify-between items-center"
                      >
                        <div className="flex items-center">
                          <span className="text-green-500 mr-3">✓</span>
                          <span>{service.name}</span>
                        </div>
                        <div>
                          <span className="font-medium">
                            Rs.{service.price}
                          </span>
                          <DeleteOutlined
                            className="text-red-500 ml-4 cursor-pointer"
                            onClick={() =>
                              setSelectedServices(
                                selectedServices.filter(
                                  (s) => s.id !== service.id
                                )
                              )
                            }
                          />
                        </div>
                      </div>
                    ))}

                    {pickupRequested && eligibility === "eligible" && (
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <span className="text-green-500 mr-3">✓</span>
                          <span>Vehicle Pickup Service</span>
                        </div>
                        <div>
                          <span className="font-medium">
                            Rs.{TRANSPORT_FEE}
                          </span>
                          <DeleteOutlined
                            className="text-red-500 ml-4 cursor-pointer"
                            onClick={() => {
                              setPickupRequested(false);
                              setPickupAddress("");
                              setEligibility("unknown");
                            }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="pt-4 mt-4 border-t border-blue-100 flex justify-between items-center">
                      <span className="font-bold">Total</span>
                      <span className="text-xl font-bold text-blue-600">
                        Rs.{calculateTotalPrice()}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">No services selected yet</p>
                )}

                {selectedDate && (
                  <div className="flex items-start pt-4 mt-4 border-t border-blue-100">
                    <CalendarOutlined className="text-blue-500 mr-3 mt-1" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Appointment Date
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(selectedDate).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                )}

                {selectedTimeSlot && (
                  <div className="flex items-start pt-4 mt-4 border-t border-blue-100">
                    <ClockCircleOutlined className="text-blue-500 mr-3 mt-1" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Time Slot
                      </p>
                      <p className="text-sm text-gray-500">
                        {selectedTimeSlot}
                      </p>
                    </div>
                  </div>
                )}

                {timeSinceLastService && (
                  <div className="flex items-start pt-4 mt-4 border-t border-blue-100">
                    <HistoryOutlined className="text-blue-500 mr-3 mt-1" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Time Since Last Service
                      </p>
                      <p className="text-sm text-gray-500">
                        {timeSinceLastService}
                      </p>
                    </div>
                  </div>
                )}

                {pickupRequested && pickupAddress && (
                  <div className="flex items-start pt-4 mt-4 border-t border-blue-100">
                    <EnvironmentOutlined className="text-blue-500 mr-3 mt-1" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Pickup Address
                      </p>
                      <p className="text-sm text-gray-500">{pickupAddress}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="mt-8">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isSubmitting || selectedServices.length === 0}
                  className={`w-full py-4 px-6 rounded-xl text-white font-medium text-lg transition-all shadow-lg
                    ${
                      isSubmitting
                        ? "bg-gray-400 cursor-not-allowed"
                        : selectedServices.length === 0
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:from-blue-800 active:to-indigo-800 hover:shadow-xl transform hover:-translate-y-0.5"
                    }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      Confirm and Pay
                      <ShoppingCartOutlined className="h-5 w-5 ml-2" />
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <Modal
        title={
          <div className="flex items-center">
            <CreditCardOutlined className="text-blue-500 mr-2" />
            <span>Complete Your Payment</span>
          </div>
        }
        open={paymentModalVisible}
        onCancel={() => !paymentProcessing && setPaymentModalVisible(false)}
        footer={null}
        width={800}
        centered
        closable={!paymentProcessing}
        maskClosable={!paymentProcessing}
        className="payment-modal"
      >
        {paymentSuccess ? (
          <div className="text-center py-8">
            <CheckCircleOutlined className="text-green-500 text-5xl mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Payment Successful!
            </h3>
            <p className="text-gray-600 mb-6">
              Your booking has been confirmed. You'll receive a confirmation
              email shortly.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 max-w-md mx-auto">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Amount Paid:</span>
                <span className="font-bold">Rs.{calculateTotalPrice()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Booking Reference:</span>
                <span className="font-mono">
                  BK-{Math.floor(Math.random() * 1000000)}
                </span>
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-gray-600">Date:</span>
                <span>{new Date().toLocaleDateString()}</span>
              </div>
            </div>
            <Spin spinning={paymentProcessing} />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex justify-between items-center">
              <div>
                <div className="text-sm text-gray-600">Total Amount Due</div>
                <div className="text-2xl font-bold text-blue-600">
                  Rs.{calculateTotalPrice()}
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <LockOutlined className="mr-1" />
                Secure Payment
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Card Visualization */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-700">Payment Card</h4>

                <div className="relative h-52 perspective-1000">
                  {renderCardFront()}
                  {renderCardBack()}
                </div>

                <div className="flex flex-wrap gap-2 justify-center">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
                    alt="Visa"
                    className="h-8 opacity-70 hover:opacity-100 transition-opacity"
                  />
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
                    alt="Mastercard"
                    className="h-8 opacity-70 hover:opacity-100 transition-opacity"
                  />
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg"
                    alt="Amex"
                    className="h-8 opacity-70 hover:opacity-100 transition-opacity"
                  />
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/5/57/Discover_Card_logo.svg"
                    alt="Discover"
                    className="h-8 opacity-70 hover:opacity-100 transition-opacity"
                  />
                </div>
              </div>

              {/* Payment Form */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-700">Payment Method</h4>
                <Radio.Group
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full"
                >
                  <div className="grid grid-cols-2 gap-3">
                    <Radio value="card" className="hidden">
                      <div
                        className={`border rounded-lg p-4 cursor-pointer transition-colors flex items-center ${
                          paymentMethod === "card"
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-blue-300"
                        }`}
                      >
                        <CreditCardOutlined className="mr-2 text-blue-500" />
                        Credit Card
                      </div>
                    </Radio>
                    <Radio value="paypal" className="hidden">
                      <div
                        className={`border rounded-lg p-4 cursor-pointer transition-colors flex items-center ${
                          paymentMethod === "paypal"
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-blue-300"
                        }`}
                      >
                        <img
                          src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
                          alt="PayPal"
                          className="h-5 mr-2"
                        />
                        PayPal
                      </div>
                    </Radio>
                  </div>
                </Radio.Group>

                {paymentMethod === "card" && (
                  <Form layout="vertical" className="space-y-4">
                    <Form.Item label="Card Number" required>
                      <Input
                        placeholder="1234 5678 9012 3456"
                        value={formatCardNumber(cardNumber)}
                        onChange={handleCardNumberChange}
                        maxLength={19}
                        prefix={
                          <CreditCardOutlined className="text-gray-300" />
                        }
                      />
                    </Form.Item>

                    <Form.Item label="Name on Card" required>
                      <Input
                        placeholder="John Smith"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                      />
                    </Form.Item>

                    <div className="grid grid-cols-2 gap-4">
                      <Form.Item label="Expiry Date" required>
                        <Input
                          placeholder="MM/YY"
                          value={formatExpiry(cardExpiry)}
                          onChange={(e) =>
                            setCardExpiry(e.target.value.replace(/\D/g, ""))
                          }
                          maxLength={5}
                        />
                      </Form.Item>

                      <Form.Item label="CVV" required>
                        <Input
                          placeholder="•••"
                          value={cardCvv}
                          onChange={(e) =>
                            setCardCvv(e.target.value.replace(/\D/g, ""))
                          }
                          maxLength={4}
                          type="password"
                          ref={cvvRef}
                          onFocus={handleCvvFocus}
                          onBlur={handleCvvBlur}
                        />
                      </Form.Item>
                    </div>
                  </Form>
                )}

                {paymentMethod === "paypal" && (
                  <div className="text-center py-8">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
                      alt="PayPal"
                      className="h-10 mx-auto mb-4"
                    />
                    <p className="text-gray-600 mb-4">
                      You will be redirected to PayPal to complete your payment.
                    </p>
                    <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-lg transition-colors">
                      Continue to PayPal
                    </button>
                  </div>
                )}

                <Divider className="my-2" />

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-start">
                    <SafetyOutlined className="text-green-500 text-xl mr-3 mt-1" />
                    <div>
                      <div className="font-medium text-gray-800">
                        Secure Payment
                      </div>
                      <p className="text-sm text-gray-600">
                        Your payment information is processed securely. We do
                        not store your credit card details.
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handlePaymentSubmit}
                  disabled={
                    paymentProcessing ||
                    (paymentMethod === "card" &&
                      (!cardNumber || !cardName || !cardExpiry || !cardCvv))
                  }
                  className={`w-full py-3 px-6 rounded-lg text-white font-medium transition-all flex items-center justify-center
                    ${
                      paymentProcessing
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                >
                  {paymentProcessing ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing Payment...
                    </>
                  ) : (
                    `Pay Rs.${calculateTotalPrice()}`
                  )}
                </button>

                <div className="flex items-center justify-center mt-2 text-xs text-gray-500">
                  <LockOutlined className="mr-1" />
                  Payments are secure and encrypted
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Booking;
