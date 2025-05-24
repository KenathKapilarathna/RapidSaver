import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../components/layouts/MainLayout";
import PrivateRoute from "../components/routes/PrivateRoute";


// Pages
import Home from "../pages/home/home/Home";
import Login from "../pages/login/Login";
import UserLogin from "../pages/login/Userlogin";
import AdminLogin from "../pages/login/Adminlogin";
import DriverLogin from "../pages/login/Driverlogin";
import Register from "../pages/register/Register";
import Services from "../pages/services/Services";
import Booking from "../pages/booking/Booking";
import NotFoundPage from "../pages/error/NotFoundPage";

// Admin
import Admin from "../pages/admin/admin/Admin";
import AllBookings from "../pages/admin/allBookings/AllBookings";
import ServiceManagement from "../pages/admin/serviceManagement/ServiceManagement";
import SlotManagement from "../pages/admin/slotManagement/SlotManagement";
import UserManagement from "../pages/admin/userManagement/UserManagement";
import Vehiclestatusup from "../pages/admin/vehiclestatusup/vehiclestatusup";
import AddDrivers from "../pages/admin/AddDrivers/AddDrivers";
import AdminPastBooking from "../pages/admin/apastbooking/apastbooking";
import FeedBackReviews from "../pages/admin/feedbackreviews/FeedBackReviews";

// User
import User from "../pages/user/user/User";
import PastBooking from "../pages/user/pastBooking/PastBooking";
import UpcomingBooking from "../pages/user/upcomingBooking/UpcomingBooking";
import AccountInfo from "../pages/user/accountInfo/AccountInfo";
import SlotCountdown from "../pages/user/slotCountdown/SlotCountdown";
import Vehiclestatus from "../pages/user/vehiclestatus/vehiclestatus";

// Driver
import Driver from "../pages/driver/driver/Driver";
import DriverFutureBookings from "../pages/driver/dupcomingbookings/Dupcomingbookings";
import DriverPastBookings from "../pages/driver/dpastbookings/Dpastbookings";
import DriverInfo from "../pages/driver/driveinfo/Driverinfo";
import Vehiclestatusdrive from "../pages/driver/vehiclestatusdrive/Vehiclestatusdrive";

// Misc

import AboutUs from "../pages/aboutus/AboutUs";


const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/services", element: <Services /> },
      { path: "/booking", element: <Booking /> },     
      { path: "/login", element: <Login /> },
      { path: "/login/user", element: <UserLogin /> },
      { path: "/admin-login", element: <AdminLogin /> },
      { path: "/driver-login", element: <DriverLogin /> },
      { path: "/register", element: <Register /> },
      { path: "/aboutus", element: <AboutUs /> },
      { path: "*", element: <NotFoundPage /> },

      // 🔐 ADMIN ROUTES
      {
        path: "/admin",
        element: (
          <PrivateRoute role="admin">
            <Admin />
          </PrivateRoute>
        ),
        children: [
          { path: "all-bookings", element: <AllBookings /> },
          { path: "services-management", element: <ServiceManagement /> },
          { path: "slots-management", element: <SlotManagement /> },
          { path: "users-management", element: <UserManagement /> },
          { path: "vehiclestatusup", element: <Vehiclestatusup /> },
          { path: "add-drivers", element: <AddDrivers /> },
          { path: "apast-bookings", element: <AdminPastBooking /> },
          { path: "feedback-reviews", element: <FeedBackReviews /> },
        ],
      },

      // 👤 USER ROUTES
      {
        path: "/user",
        element: (
          <PrivateRoute role="user">
            <User />
          </PrivateRoute>
        ),
        children: [
          { path: "past-bookings", element: <PastBooking /> },
          { path: "upcoming-bookings", element: <UpcomingBooking /> },
          { path: "account-info", element: <AccountInfo /> },
          { path: "service-slot-countdown", element: <SlotCountdown /> },
          { path: "vehiclestatus", element: <Vehiclestatus /> },
        ],
      },

      // 👤 DRIVER ROUTES
      {
        path: "/driver",
        element: (
          <PrivateRoute role="driver">
            <Driver />
          </PrivateRoute>
        ),
        children: [
          { path: "dpastbookings", element: <DriverPastBookings /> },
          { path: "dupcomingbookings", element: <DriverFutureBookings /> },
          { path: "vehiclestatusdrive", element: <Vehiclestatusdrive /> },
          { path: "driver-info", element: <DriverInfo /> },
        ],
      },
    ],
  },
]);




export default router;
