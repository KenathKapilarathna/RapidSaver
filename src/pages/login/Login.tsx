import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { auth, db } from "../../config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useAppDispatch } from "../../redux/hooks";
import { setUser } from "../../redux/features/auth/AuthSlice";
import { APP_TOKEN } from "../../config/conf";
import { TUser } from "../../types/User";
import { FaLock } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Determine role based on path
  const getRoleFromPath = () => {
    if (location.pathname === "/admin-login") return "admin";
    if (location.pathname === "/driver-login") return "driver";
    return "user";
  };
  const role = getRoleFromPath();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // 1) Sign in with Firebase Auth
      const { user } = await signInWithEmailAndPassword(auth, email, password);

      // 2) Fetch their role from Firestore
      const roleSnap = await getDoc(doc(db, "users", user.uid));
      const userData = roleSnap.data();

      if (!roleSnap.exists() || userData?.role !== role) {
        throw new Error(`Unauthorized: This account is not a ${role}.`);
      }

      const userInfo: TUser = {
        _id: user.uid,
        id: user.uid,
        uid: user.uid,
        userId: user.uid,
        name: userData?.name || role.charAt(0).toUpperCase() + role.slice(1),
        email: userData?.email || "",
        password: "",
        phone: userData?.phone || "",
        role,
        address: userData?.address || "",
        createdAt: userData?.createdAt || new Date().toISOString(),
        updatedAt: userData?.updatedAt || new Date().toISOString(),
        __v: 0,
      };

      // 3) Dispatch to Redux
      dispatch(
        setUser({
          user: userInfo,
          token: APP_TOKEN,
        })
      );

      // 4) Success alert + redirect
      Swal.fire({
        icon: "success",
        title: "Login Successful!",
        text: `You have logged in as ${role}.`,
        confirmButtonColor: "#10B981",
      });

      // Redirect based on role
      const redirectPath = 
        role === "admin" ? "/admin-dashboard" :
        role === "driver" ? "/driver-dashboard" : 
        "/";
      navigate(redirectPath);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Login failed. Please check your credentials.";
      setError(msg);
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: msg,
        confirmButtonColor: "#EF4444",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getHeaderTitle = () => {
    switch(role) {
      case "admin": return "Admin Portal";
      case "driver": return "Driver Portal";
      default: return "Welcome Back";
    }
  };

  const getHeaderSubtitle = () => {
    switch(role) {
      case "admin": return "Secure access to administration dashboard";
      case "driver": return "Secure access to driver dashboard";
      default: return "Login to your account";
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen lg:mt-[62px]">
      {/* Background Image with Gradient Overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-emerald-900/70 to-black/80"
        style={{
          backgroundImage:
            "url('https://i.ibb.co/NrYkcBd/washing-process-self-service-car-wash-1124848-16980.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundBlendMode: "overlay",
          zIndex: -1,
        }}
      />

      {/* Login Form Card */}
      <div className="relative w-full max-w-md mx-4 overflow-hidden bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl transition-all duration-300 ease-in-out">
        {/* Card Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-green-500 py-6 px-8">
          <div className="flex justify-center mb-2">
            <div className="bg-white p-3 rounded-full shadow-lg">
              <FaLock className="text-3xl text-emerald-600" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white text-center">
            {getHeaderTitle()}
          </h2>
          <p className="text-green-100 text-center mt-2">
            {getHeaderSubtitle()}
          </p>
        </div>

        {/* Card Body */}
        <div className="p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
              <p className="text-red-700 font-medium text-sm flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-gray-700 text-sm font-medium mb-2"
              >
                {role.charAt(0).toUpperCase() + role.slice(1)} Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder={`${role}@example.com`}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-gray-700 text-sm font-medium mb-2"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex items-center justify-center space-x-2 text-white bg-gradient-to-r from-emerald-600 to-green-500 px-3 py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:translate-y-px ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? (
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
                  Logging in...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  {role.charAt(0).toUpperCase() + role.slice(1)} Login
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ml-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              )}
            </button>
          </form>

          <div className="mt-8 text-center space-y-2">
            {role === "user" && (
              <p className="text-sm text-gray-600">
                New user?
                <Link
                  to="/register"
                  className="text-emerald-600 ml-2 hover:text-emerald-800 font-medium transition-colors"
                >
                  Create an account
                </Link>
              </p>
            )}
            {role !== "admin" && (
              <p className="text-sm text-gray-600">
                Are you an admin?
                <Link
                  to="/admin-login"
                  className="text-emerald-600 ml-2 hover:text-emerald-800 font-medium transition-colors"
                >
                  Admin Login
                </Link>
              </p>
            )}
            {role !== "driver" && (
              <p className="text-sm text-gray-600">
                Are you a driver?
                <Link
                  to="/driver-login"
                  className="text-emerald-600 ml-2 hover:text-emerald-800 font-medium transition-colors"
                >
                  Driver Login
                </Link>
              </p>
            )}
            {role !== "user" && (
              <p className="text-sm text-gray-600">
                Are you a user?
                <Link
                  to="/login"
                  className="text-emerald-600 ml-2 hover:text-emerald-800 font-medium transition-colors"
                >
                  User Login
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

