import {
  CalendarCheck,
  Truck,
  MapPin,
  Clock,
  Wrench,
  CheckCircle,
  Home,
} from "lucide-react";

export const RTDB_PATH = "app";
export const APP_TOKEN = "my_token";

export const STEPS = {
  pending: {
    icon: Clock,
    label: "Pending",
    status: "pending",
    step: 0,
  },
  bookingConfirmed: {
    icon: CalendarCheck,
    label: "Booking Confirmed",
    status: "bookingConfirmed",
    step: 1,
  },
  vehiclePickedUp: {
    icon: Truck,
    label: "Vehicle Picked Up",
    status: "vehiclePickedUp",
    step: 2,
  },
  enRouteToServiceStation: {
    icon: Truck,
    label: "En Route to Service Station",
    status: "enRouteToServiceStation",
    step: 3,
  },
  arrivedAtServiceStation: {
    icon: MapPin,
    label: "Arrived at Service Station",
    status: "arrivedAtServiceStation",
    step: 4,
  },
  waiting: {
    icon: Clock,
    label: "Waiting",
    status: "waiting",
    step: 5,
  },
  serviceInProgress: {
    icon: Wrench,
    label: "Service in Progress",
    status: "serviceInProgress",
    step: 6,
  },
  serviceCompleted: {
    icon: CheckCircle,
    label: "Service Completed",
    status: "serviceCompleted",
    step: 7,
  },
  enRouteToCustomer: {
    icon: Truck,
    label: "En Route to Customer",
    status: "enRouteToCustomer",
    step: 8,
  },
  completed: {
    icon: Home,
    label: "Drop Off Completed",
    status: "completed",
    step: 9,
  },
};
