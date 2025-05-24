import { useState, useEffect, useRef } from "react";
import { IoMdLogIn, IoMdLogOut } from "react-icons/io";
import { TbPhoneCall } from "react-icons/tb";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../../redux/store";
import { logout } from "../../../../redux/features/auth/AuthSlice";
import logo from "../../../../assets/Images/rapidsaver4.jpg.jpeg";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const loginDropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.auth.user);
  const userRole = user?.role;
  const isLoggedIn = !!user;

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleLoginDropdown = () => {
    setLoginDropdownOpen(!loginDropdownOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }

      if (
        loginDropdownRef.current &&
        !loginDropdownRef.current.contains(event.target as Node)
      ) {
        setLoginDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef, loginDropdownRef]);

  const navLinks = [
    { name: "HOME", path: "/" },
    { name: "SERVICES", path: "/services" },
    
    { name: "BOOKING", path: "/booking" },
    { name: "ABOUT US", path: "/aboutus" },
    
    isLoggedIn &&
      userRole === "driver" && {
        name: "DRIVER DASHBOARD",
        path: "/driver/dupcomingbookings",
      },
    isLoggedIn &&
      userRole === "admin" && { name: "ADMIN", path: "admin/all-bookings" },
    isLoggedIn &&
      userRole === "user" && {
        name: "DASHBOARD",
        path: "/user/upcoming-bookings",
      },
  ].filter(Boolean);

  return (
    <nav className="bg-gradient-to-r from-gray-900 to-black shadow-lg w-full py-3 px-4 md:px-6 flex items-center justify-between top-0 left-0 z-40 fixed backdrop-blur-sm bg-opacity-95 transition-all duration-300">
      <Link
        to="/"
        className="transition-transform duration-300 hover:scale-105"
      >
        <div className="flex items-center space-x-3">
          <img
            src={logo}
            alt="Logo"
            className="h-10 lg:h-30 w-[120px] lg:w-[150px] rounded-lg shadow-md object-contain"
          />
        </div>
      </Link>

      <ul className="hidden lg:flex space-x-8 text-white font-medium tracking-wide">
        {navLinks.map((link) => link && (
          <li key={link.name} className="relative group">
            <Link
              to={link.path}
              className="py-2 px-1 block hover:text-emerald-400 transition-colors duration-300"
            >
              {link.name}
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-emerald-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="flex items-center space-x-4">
        <Link
          to={"/aboutus"}
          className="flex items-center space-x-2 text-white bg-gradient-to-r from-emerald-600 to-green-500 px-3 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:translate-y-px"
        >
          <TbPhoneCall className="text-white text-lg" />
          <span className="font-medium">Call Now</span>
        </Link>

        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="hidden lg:flex items-center space-x-2 text-white border border-gray-600 hover:border-red-400 hover:bg-red-500/10 px-3 py-2 rounded-full shadow-sm transition-all duration-300"
          >
            <IoMdLogOut className="text-xl text-red-400" />
            <span className="font-medium">Logout</span>
          </button>
        ) : (
          <div className="relative" ref={loginDropdownRef}>
            <button
              onClick={toggleLoginDropdown}
              className="hidden lg:flex items-center space-x-2 text-white border border-gray-600 hover:border-emerald-400 hover:bg-emerald-500/10 px-3 py-2 rounded-full shadow-sm transition-all duration-300"
            >
              <IoMdLogIn className="text-xl text-emerald-400" />
              <span className="font-medium">Login</span>
            </button>

            {loginDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-gray-800 rounded-xl shadow-xl border border-gray-700 overflow-hidden transform origin-top-right transition-all duration-300">
                <ul className="py-1">
                  <li>
                    <Link
                      to="/login"
                      className="text-white flex items-center px-4 py-3 hover:bg-emerald-600/20 transition-colors duration-300"
                      onClick={() => setLoginDropdownOpen(false)}
                    >
                      <span className="font-medium">User Login</span>
                    </Link>
                  </li>
                  <li className="border-t border-gray-700">
                    <Link
                      to="/admin-login"
                      className="text-white flex items-center px-4 py-3 hover:bg-emerald-600/20 transition-colors duration-300"
                      onClick={() => setLoginDropdownOpen(false)}
                    >
                      <span className="font-medium">Admin Login</span>
                    </Link>
                  </li>
                  <li className="border-t border-gray-700">
                    <Link
                      to="/driver-login"
                      className="text-white flex items-center px-4 py-3 hover:bg-emerald-600/20 transition-colors duration-300"
                      onClick={() => setLoginDropdownOpen(false)}
                    >
                      <span className="font-medium">Driver Login</span>
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      <button
        className="lg:hidden text-white focus:outline-none bg-gray-800 p-2 rounded-lg shadow-md hover:bg-gray-700 transition-colors duration-300"
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      <div
        ref={dropdownRef}
        className={`fixed lg:hidden inset-x-0 top-16 bg-gray-900 rounded-b-xl shadow-2xl transition-all duration-300 transform ${
          isOpen
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0 pointer-events-none"
        }`}
        style={{ zIndex: 1000 }}
      >
        <ul className="flex flex-col text-white py-4 px-4">
          {navLinks.map((link) => link && (
            <li
              key={link.name}
              className="w-full border-b border-gray-800 last:border-none"
            >
              <Link
                to={link.path}
                className="block py-3 px-4 rounded-lg hover:bg-gray-800 transition-all duration-300 font-medium"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            </li>
          ))}

          {isLoggedIn ? (
            <li className="w-full border-t border-gray-800 mt-2">
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="flex items-center w-full py-3 px-4 rounded-lg text-white hover:bg-red-900/30 transition-all duration-300 font-medium"
              >
                <IoMdLogOut className="text-xl text-red-400 mr-2" />
                Logout
              </button>
            </li>
          ) : (
            <>
              <li className="w-full border-t border-gray-800 mt-2">
                <Link
                  to={"/login"}
                  className="flex items-center py-3 px-4 rounded-lg hover:bg-emerald-900/30 transition-all duration-300 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  <IoMdLogIn className="text-xl text-emerald-400 mr-2" />
                  User Login
                </Link>
              </li>
              <li className="w-full">
                <Link
                  to={"/admin-login"}
                  className="flex items-center py-3 px-4 rounded-lg hover:bg-emerald-900/30 transition-all duration-300 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  <IoMdLogIn className="text-xl text-emerald-400 mr-2" />
                  Admin Login
                </Link>
              </li>
              <li className="w-full">
                <Link
                  to={"/driver-login"}
                  className="flex items-center py-3 px-4 rounded-lg hover:bg-emerald-900/30 transition-all duration-300 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  <IoMdLogIn className="text-xl text-emerald-400 mr-2" />
                  Driver Login
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;