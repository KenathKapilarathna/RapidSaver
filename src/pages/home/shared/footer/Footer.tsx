
import { FaTwitter, FaFacebook, FaInstagram, FaYoutube, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import logo from "../../../../assets/Images/rapidsaver4.jpg.jpeg";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-gray-300 py-16 px-5 font-sans">
      <div className="container mx-auto">
        {/* Top Section with Logo and Social */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 pb-8 border-b border-gray-800">
          <div className="flex items-center mb-6 md:mb-0">
            <img
              src={logo}
              alt="AutoCare Logo"
              className="h-12 mr-4 rounded-md"
            />
            <div>
              <h2 className="text-white text-xl font-bold tracking-wider">Rapid<span className="text-blue-400">Saver</span></h2>
              <p className="text-sm text-gray-400 italic">Where Technology Meets Vehicle Care</p>
            </div>
          </div>
          
          <div className="flex space-x-5">
            <a href="#" className="bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white p-3 rounded-full transition-all duration-300 transform hover:scale-110">
              <FaTwitter className="text-lg" />
            </a>
            <a href="#" className="bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white p-3 rounded-full transition-all duration-300 transform hover:scale-110">
              <FaFacebook className="text-lg" />
            </a>
            <a href="#" className="bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white p-3 rounded-full transition-all duration-300 transform hover:scale-110">
              <FaInstagram className="text-lg" />
            </a>
            <a href="#" className="bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white p-3 rounded-full transition-all duration-300 transform hover:scale-110">
              <FaYoutube className="text-lg" />
            </a>
          </div>
        </div>
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* About Section */}
          <div className="flex flex-col">
            <h5 className="text-white text-lg font-bold mb-5 relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-1 after:w-12 after:bg-blue-500 after:rounded-full pb-2">ABOUT US</h5>
            <p className="text-gray-400 mb-4 leading-relaxed">
              RapidSaver provides premium vehicle maintenance services with cutting-edge technology and expert care. We're dedicated to keeping your vehicle in optimal condition.
            </p>
            <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors duration-300 inline-flex items-center">
              Learn more
              <svg className="w-4 h-4 ml-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </a>
          </div>

          {/* Services Section */}
          <div className="flex flex-col">
            <h5 className="text-white text-lg font-bold mb-5 relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-1 after:w-12 after:bg-blue-500 after:rounded-full pb-2">SERVICES</h5>
            <ul className="space-y-3">
              {[
                'Full Body Wash',
                'Oil Filter and Air Filter Change',
                'Lubricant Check-Up',
                'Waxing and Polishing',
                'Interior Detailing',
                'Engine Cleaning'
              ].map((service, idx) => (
                <li key={idx} className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  {service}
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col">
            <h5 className="text-white text-lg font-bold mb-5 relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-1 after:w-12 after:bg-blue-500 after:rounded-full pb-2">QUICK LINKS</h5>
            <ul className="space-y-3">
              {[
                'Home',
                'Services',
                'Booking',
                'About Us'
                
                
              
              ].map((link, idx) => (
                <li key={idx}>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Section */}
          <div className="flex flex-col">
            <h5 className="text-white text-lg font-bold mb-5 relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-1 after:w-12 after:bg-blue-500 after:rounded-full pb-2">CONTACT US</h5>
            <ul className="space-y-4">
              <li className="flex items-start">
                <FaMapMarkerAlt className="text-blue-400 mr-3 mt-1" />
                <span className="text-gray-400">No: 98 High Level Road, Homagama</span>
              </li>
              <li className="flex items-center">
                <FaPhoneAlt className="text-blue-400 mr-3" />
                <span className="text-gray-400">075 8492630</span>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="text-blue-400 mr-3" />
                <span className="text-gray-400">rapidsaver@gmail.com</span>
              </li>
            </ul>
            
          </div>
        </div>
        
        
      </div>
    </footer>
  );
};

export default Footer;