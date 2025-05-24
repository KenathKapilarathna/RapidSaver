import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../redux/hooks";
import { setUser } from "../../redux/features/auth/AuthSlice";
import Swal from "sweetalert2";
import { auth } from "../../config/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

import { APP_TOKEN } from "../../config/conf";
import { registerUser } from "../../config/UserFunctions";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: name,
      });

      const res = await registerUser({
        uid: user.uid,
        userId: user.uid,
        name: name,
        email: email,
        phone: phone,
      });

      dispatch(
        setUser({
          user: {
            ...res,
            _id: user.uid,
            role: "user",
            id: user.uid,
            password: "",
            __v: 0,
          },
          token: APP_TOKEN,
        })
      );

      Swal.fire({
        icon: "success",
        title: "Registration Successful!",
        text: "You have registered successfully.",
        confirmButtonColor: "#10B981",
      });

      navigate("/");
    } catch (error: unknown) {
      let errorMessage = "An error occurred. Please try again.";

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: errorMessage,
        confirmButtonColor: "#EF4444",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen pt-20">
      <div
        className="absolute inset-0 bg-black/40"
        style={{
          backgroundImage:
            "url('https://i.ibb.co/KDrsV59/man-washing-car-rain-752325-22767.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundBlendMode: "overlay",
        }}
      ></div>

      <div className="relative bg-white p-8 rounded-lg shadow-xl max-w-md w-full z-10 mx-4">
        <div className="bg-gradient-to-r from-emerald-600 to-green-500 text-white py-6 px-8 rounded-t-lg -mx-8 -mt-8 mb-6 text-center shadow-md">
          <h2 className="text-3xl font-bold mb-1">Create Account</h2>
          <p className="text-white/90">Register to start booking services</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Full Name */}
          <div>
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="name"
            >
              Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Enter your full name"
                className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="email"
            >
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your.email@example.com"
                className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="phone"
            >
              Phone Number
            </label>
            <div className="relative">
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                placeholder="(123) 456-7890"
                className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-6">
            <button
              type="submit"
              className={`w-full flex items-center justify-center space-x-2 text-white bg-gradient-to-r from-emerald-600 to-green-500 px-4 py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:translate-y-px ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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
                <>
                  <span>Register Now</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </>
              )}
            </button>
          </div>

          {/* Links */}
          <div className="mt-6 text-center space-y-2">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Login
              </Link>
            </p>
            <p className="text-gray-600">
              Are you an admin?{" "}
              <Link
                to="/admin-login"
                className="text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Admin Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
