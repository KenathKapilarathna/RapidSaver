
import { Users, CheckCircle, Clock } from "lucide-react";

const WhyChooseUs = () => {
  return (
    <section className="bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
      {/* Abstract background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(239,68,68,0.3)_0%,transparent_50%)]"></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(220,38,38,0.3)_0%,transparent_50%)]"></div>
      </div>
      
      <div className="relative mx-auto max-w-screen-xl px-6 py-24 sm:px-8 lg:flex lg:min-h-screen lg:items-center lg:px-12">
        <div className="w-full text-center sm:text-left">
          <h1 className="text-4xl font-bold text-white sm:text-5xl mb-16 font-sans tracking-tight relative">
            <span className="relative inline-block pb-3">
              Why Choose Us
              <span className="absolute -bottom-2 left-0 w-32 h-1.5 bg-gradient-to-r from-red-600 to-red-500 rounded-full shadow-lg shadow-red-600/30"></span>
            </span>
          </h1>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Users className="w-6 h-6" />,
                title: "Expert Team",
                description: "Our skilled professionals use the latest techniques and high-quality products to ensure your car gets the best care possible.",
                bgColor: "bg-red-900/30",
                borderColor: "border-red-700/50",
                iconBgColor: "bg-gradient-to-br from-red-600 to-red-500",
                titleColor: "text-red-400"
              },
              {
                icon: <CheckCircle className="w-6 h-6" />,
                title: "Attention to Detail",
                description: "We go the extra mile to ensure every inch of your car is spotless, inside and out. We're not happy until you are.",
                bgColor: "bg-purple-900/30",
                borderColor: "border-purple-700/50",
                iconBgColor: "bg-gradient-to-br from-purple-600 to-purple-500",
                titleColor: "text-purple-400"
              },
              {
                icon: <Clock className="w-6 h-6" />,
                title: "Convenience",
                description: "With flexible service options and quick turnaround times, we make it easy to keep your car looking its best.",
                bgColor: "bg-blue-900/30",
                borderColor: "border-blue-700/50",
                iconBgColor: "bg-gradient-to-br from-blue-600 to-blue-500",
                titleColor: "text-blue-400"
              }
            ].map((item, index) => (
              <div 
                key={index} 
                className="bg-gray-900/80 backdrop-blur-sm rounded-lg p-6 transform transition duration-300 hover:-translate-y-2 hover:shadow-xl border border-gray-800"
              >
                <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-red-600 text-white mx-auto sm:mx-0 shadow-lg">
                  {item.icon}
                </div>
                <h2 className={`text-xl font-bold text-red-500 mb-4 font-sans tracking-wide`}>
                  {item.title}
                </h2>
                <p className="text-gray-300 font-medium font-sans text-base leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute -bottom-24 -right-24 w-64 h-64 rounded-full bg-gradient-to-r from-red-500/20 to-red-700/20 blur-3xl"></div>
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-gradient-to-r from-red-600/10 to-blue-500/10 blur-3xl"></div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;