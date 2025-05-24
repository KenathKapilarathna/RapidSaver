
import { Clock, ShieldCheck } from "lucide-react";

const FeaturedServices = () => {
  const services = [
    {
      title: "Full Body Wash",
      price: "Rs.1000",
      duration: "30 Minutes",
      
      
    },
    {
      title: "Oil Filter and Air Filter Change",
      price: "Rs.3000",
      duration: "30 Minutes",
      
      
    },
    {
      title: "Lubricant Check-Up",
      price: "Rs.2500",
      duration: "15 Minutes",
      
      
    },
    {
      title: "Waxing and Polishing",
      price: "Rs.4000",
      duration: "60 Minutes",
      
      
    },
    {
      title: "Interior Detailing",
      price: "Rs.8000",
      duration: "90 Minutes",
      
    },
    {
      title: "Engine Cleaning",
      price: "Rs.2500",
      duration: "30 Minutes",
      
    },
  ];

  return (
    <section className="relative min-h-screen w-full bg-cover bg-center flex flex-col justify-center items-center py-16 lg:py-24">
      {/* Background with improved overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: "url('https://i.ibb.co/Z6z7zH2/man-cleaning-red-sports-car-with-power-washer-rainy-afternoon-garage-area-1090747-488.jpg')",
        }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/90 via-gray-900/85 to-gray-900/90"></div>
      
      {/* Content Container */}
      <div className="relative z-10 w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Our Featured Services
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-emerald-500 mx-auto rounded-full mb-6"></div>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Discover our premium vehicle care services designed to keep your car in perfect condition
          </p>
        </div>
        
        {/* Service Cards Grid with Animation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <div 
              key={index}
              className="transform transition-all duration-300 hover:-translate-y-2"
            >
              <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700/50 shadow-lg hover:shadow-blue-500/10 h-full flex flex-col">
                {/* Card Content */}
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-gradient-to-br from-blue-500 to-emerald-500 p-2 rounded-lg">
                      <ShieldCheck className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">
                      {service.title}
                    </h3>
                  </div>
                  
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-emerald-400 font-semibold text-lg">
                      {service.price}
                    </div>
                    <div className="flex items-center text-gray-400 text-sm">
                      <Clock className="h-4 w-4 mr-1" />
                      {service.duration}
                    </div>
                  </div>
                </div>
                
                
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedServices;