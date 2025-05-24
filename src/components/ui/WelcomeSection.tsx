
import { Sparkles } from "lucide-react";

const WelcomeSection = () => {
  return (
    <section className="relative bg-gradient-to-br from-gray-900 to-gray-800 text-white overflow-hidden">
      {/* Abstract background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(30,64,175,0.3)_0%,transparent_50%)]"></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(16,185,129,0.3)_0%,transparent_50%)]"></div>
      </div>
      
      {/* Content container */}
      <div className="relative py-16 md:py-24 lg:py-32 px-6 md:px-12 max-w-screen-xl mx-auto">
        <div className="flex flex-col items-center text-center md:items-start md:text-left">
          {/* Heading with icon */}
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="h-8 w-8 text-emerald-400" />
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-300">
              Welcome to RapidSaver Services
            </h2>
          </div>
          
          {/* Decorative accent line */}
          <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full my-6"></div>
          
          {/* Description with better visibility on all devices */}
          <div className="max-w-2xl">
            <p className="text-base md:text-lg text-gray-300 leading-relaxed mt-4 font-light md:font-normal">
              Your smart and convenient vehicle care solution. We offer seamless online booking, real-time updates, secure payments, and AI-driven feedback analysis to enhance your service experience. With vehicle pickup and delivery, accurate cost estimation, and automated service reminders, we ensure hassle-free car care anytime, anywhere.
            </p>
          </div>
          
          {/* Additional highlight cards - only visible on larger screens */}
          <div className="hidden lg:grid grid-cols-3 gap-6 w-full mt-12">
            {[
              { icon: "🔄", title: "Seamless Booking", desc: "Book services in minutes" },
              { icon: "🚚", title: "Pickup & Drop Off", desc: "We come to you" },
              { icon: "🔔", title: "Smart Reminders", desc: "Never miss maintenance" }
            ].map((item, index) => (
              <div 
                key={index} 
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 shadow-lg hover:shadow-emerald-500/10 transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="text-2xl mb-3">{item.icon}</div>
                <h3 className="font-medium text-lg text-white mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Background element - decorative circles */}
      <div className="absolute -bottom-24 -right-24 w-64 h-64 rounded-full bg-gradient-to-r from-emerald-500/20 to-blue-500/20 blur-3xl"></div>
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-3xl"></div>
    </section>
  );
};

export default WelcomeSection;