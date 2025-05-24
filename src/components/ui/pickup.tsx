import React from "react";
import { Truck, Clock, MapPin, Info, Navigation, CornerDownLeft, Shield } from "lucide-react";

const VehiclePickupSection = () => {
  return (
    <section className="relative bg-gradient-to-br from-gray-900 to-black text-white overflow-hidden py-16 px-5">
      {/* Abstract background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.3)_0%,transparent_50%)]"></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(29,78,216,0.3)_0%,transparent_50%)]"></div>
      </div>

      {/* Content container */}
      <div className="relative max-w-screen-xl mx-auto">
        <div className="flex flex-col items-center text-center md:items-start md:text-left">
          {/* Heading with icon */}
          <div className="flex items-center gap-3 mb-4">
            <Truck className="h-8 w-8 text-blue-400" />
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Vehicle Pickup & Delivery
            </h2>
          </div>
          
          {/* Decorative accent line */}
          <div className="w-24 h-1 bg-blue-600 rounded-full my-6"></div>
          
          {/* Description */}
          <div className="max-w-7xl mb-12">
            <p className="text-lg text-gray-300 leading-relaxed">
              Let us handle the logistics. Our professional drivers will pick up your vehicle at your location and return it to you after service is complete, saving you time and hassle.
            </p>
          </div>

          {/* Service requirements cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
            <ServiceRequirementCard 
              icon={<Navigation className="h-6 w-6 text-blue-400" />}
              title="Convenient Pickup"
              description="Our drivers will collect your vehicle at your specified location."
              bgColor="bg-blue-900/20"
              borderColor="border-blue-800/50"
            />
            
            <ServiceRequirementCard 
              icon={<CornerDownLeft className="h-6 w-6 text-green-400" />}
              title="Same Location Return"
              description="We will return your vehicle to the same location where we picked it up."
              bgColor="bg-green-900/20"
              borderColor="border-green-800/50"
            />
            
            <ServiceRequirementCard 
              icon={<Clock className="h-6 w-6 text-amber-400" />}
              title="Early Handover"
              description="Vehicle must be handed over one hour before scheduled service time."
              bgColor="bg-amber-900/20"
              borderColor="border-amber-800/50"
            />
            
            <ServiceRequirementCard 
              icon={<Shield className="h-6 w-6 text-purple-400" />}
              title="Service Area"
              description="Pickup service available within 15 km radius from our service station."
              bgColor="bg-purple-900/20"
              borderColor="border-purple-800/50"
            />
          </div>



          {/* Important notice */}
          <div className="mt-12 flex items-start gap-3 p-5 bg-gray-800/70 rounded-lg border border-gray-700 max-w-full mx-auto">
            <Info className="h-6 w-6 text-blue-400 flex-shrink-0 mt-0.5" />
            <p className="text-gray-300 text-sm">
              <span className="font-medium text-white">Please note:</span> Our pickup and delivery service is subject to driver availability. We recommend booking this service at least 24 hours in advance to ensure availability.
            </p>
          </div>
        </div>
      </div>
      
      {/* Background decorative elements */}
      <div className="absolute -bottom-24 -right-24 w-64 h-64 rounded-full bg-gradient-to-r from-blue-500/20 to-blue-700/20 blur-3xl"></div>
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-gradient-to-r from-blue-600/10 to-blue-400/10 blur-3xl"></div>
    </section>
  );
};

// Reusable card component for service requirements
interface ServiceRequirementCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  bgColor: string;
  borderColor: string;
}

const ServiceRequirementCard = ({ icon, title, description, bgColor, borderColor }: ServiceRequirementCardProps) => {
  return (
    <div className={`${bgColor || "bg-gray-800/50"} backdrop-blur-sm rounded-xl p-6 ${borderColor || "border-gray-700/50"} border shadow-lg hover:shadow-blue-500/10 transition-all duration-300 transform hover:-translate-y-1`}>
      <div className="mb-3">{icon}</div>
      <h3 className="font-medium text-lg text-white mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
};

export default VehiclePickupSection;