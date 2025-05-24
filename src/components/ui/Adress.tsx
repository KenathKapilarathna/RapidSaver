import { Phone, MapPin, Clock, Mail, ExternalLink } from "lucide-react";

const Address = () => {
  return (
    <div className="relative bg-gradient-to-br from-gray-950 via-gray-900 to-emerald-950 py-16 px-6 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-10 left-10 w-64 h-64 bg-emerald-500/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-indigo-500/10 rounded-full filter blur-3xl"></div>
      </div>
      
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200 mb-4">Get in Touch</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-teal-300 mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Call Us Section */}
          <div className="group relative bg-gray-900/50 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl border border-gray-800/50 hover:border-emerald-500/50 transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/5 to-emerald-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="p-8 relative z-10">
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-md transform group-hover:scale-125 transition-transform duration-500"></div>
                  <div className="relative bg-gray-900 rounded-full p-4 border border-emerald-500/50 shadow-lg shadow-emerald-500/10">
                    <Phone className="text-emerald-400 w-6 h-6" />
                  </div>
                </div>
              </div>
              
              <h3 className="text-center text-lg font-bold text-white mb-4 tracking-wide">CALL US</h3>
              
              <div className="space-y-3">
                <a href="tel:+94758492630" className="flex items-center justify-center py-2 px-4 rounded-lg bg-gray-800/50 hover:bg-emerald-900/50 border border-gray-700 hover:border-emerald-500/50 text-gray-300 hover:text-emerald-300 transition-all duration-300">
                  (+94) 75 84 92 630
                </a>
                <a href="tel:+94779872615" className="flex items-center justify-center py-2 px-4 rounded-lg bg-gray-800/50 hover:bg-emerald-900/50 border border-gray-700 hover:border-emerald-500/50 text-gray-300 hover:text-emerald-300 transition-all duration-300">
                  (+94) 77 98 72 615
                </a>
              </div>
            </div>
          </div>
          
          {/* Email Section (New) */}
          <div className="group relative bg-gray-900/50 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl border border-gray-800/50 hover:border-indigo-500/50 transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-indigo-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="p-8 relative z-10">
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-md transform group-hover:scale-125 transition-transform duration-500"></div>
                  <div className="relative bg-gray-900 rounded-full p-4 border border-indigo-500/50 shadow-lg shadow-indigo-500/10">
                    <Mail className="text-indigo-400 w-6 h-6" />
                  </div>
                </div>
              </div>
              
              <h3 className="text-center text-lg font-bold text-white mb-4 tracking-wide">EMAIL US</h3>
              
              <div className="space-y-3">
                <a href="mailto:info@company.com" className="flex items-center justify-center py-2 px-4 rounded-lg bg-gray-800/50 hover:bg-indigo-900/50 border border-gray-700 hover:border-indigo-500/50 text-gray-300 hover:text-indigo-300 transition-all duration-300">
                  rapidsaver@gmail.com
                </a>
                <a href="mailto:support@company.com" className="flex items-center justify-center py-2 px-4 rounded-lg bg-gray-800/50 hover:bg-indigo-900/50 border border-gray-700 hover:border-indigo-500/50 text-gray-300 hover:text-indigo-300 transition-all duration-300">
                  rapidadmin@gmail.com
                </a>
              </div>
            </div>
          </div>
          
          {/* Our Address Section */}
          <div className="group relative bg-gray-900/50 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl border border-gray-800/50 hover:border-violet-500/50 transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 to-violet-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="p-8 relative z-10">
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-violet-500/20 rounded-full blur-md transform group-hover:scale-125 transition-transform duration-500"></div>
                  <div className="relative bg-gray-900 rounded-full p-4 border border-violet-500/50 shadow-lg shadow-violet-500/10">
                    <MapPin className="text-violet-400 w-6 h-6" />
                  </div>
                </div>
              </div>
              
              <h3 className="text-center text-lg font-bold text-white mb-4 tracking-wide">OUR ADDRESS</h3>
              
              <div className="flex flex-col items-center">
                <div className="text-center text-gray-300 mb-3 font-medium">
                  <p className="mb-1">No: 98</p>
                  <p>High Level Road, Homagama</p>
                </div>
                
                <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 mt-2 py-2 px-4 rounded-lg bg-gray-800/50 hover:bg-violet-900/50 border border-gray-700 hover:border-violet-500/50 text-gray-300 hover:text-violet-300 transition-all duration-300">
                  <span>View Map</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
          
          {/* Working Hours Section */}
          <div className="group relative bg-gray-900/50 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl border border-gray-800/50 hover:border-amber-500/50 transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-600/5 to-amber-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="p-8 relative z-10">
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-md transform group-hover:scale-125 transition-transform duration-500"></div>
                  <div className="relative bg-gray-900 rounded-full p-4 border border-amber-500/50 shadow-lg shadow-amber-500/10">
                    <Clock className="text-amber-400 w-6 h-6" />
                  </div>
                </div>
              </div>
              
              <h3 className="text-center text-lg font-bold text-white mb-4 tracking-wide">WORKING HOURS</h3>
              
              

                <div className="flex justify-between py-2 px-4 rounded-lg bg-gray-800/50 border border-gray-700">
                  <span className="text-gray-400">Mon - Fri</span>
                  <span className="text-gray-300">8 AM - 7 PM</span>
                </div>
                <br></br>
                <div className="flex justify-between py-2 px-4 rounded-lg bg-gray-800/50 border border-gray-700">
                  <span className="text-gray-400">Sat - Sun</span>
                  <span className="text-gray-300">9 AM - 6 PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        
      </div>
    
  );
};

export default Address;