import { FaMapMarkerAlt, FaPhone, FaDirections } from 'react-icons/fa';

const Location = () => {
    return (
        <div className="bg-gradient-to-b from-gray-900 to-black min-h-screen pt-24 pb-16 px-5">
            <div className="max-w-4xl mx-auto w-full">
                <div className="mb-12 text-center">
                    <h1 className="text-3xl font-bold text-white mb-2">
                        About Us & Location
                    </h1>
                </div>
                
                {/* About Us Section */}
                <div className="bg-gray-800 rounded-lg shadow-lg p-8 mb-12">
                    <h2 className="text-xl font-bold text-white mb-6">
                        About RapidSaver
                    </h2>
                    <div className="text-gray-300 space-y-4">
                        <p>
                            At RapidSaver, we believe that vehicle maintenance should be seamless, reliable, and tailored to your needs. We provide premium vehicle care services by combining cutting-edge technology, skilled professionals, and a deep commitment to customer satisfaction.
                        </p>
                        <p>
                            Whether it's routine maintenance or advanced diagnostics, we ensure every vehicle receives the highest standard of service. Our expert team uses modern tools and data-driven insights to identify issues early and keep your vehicle running smoothly.
                        </p>
                        <p>
                            We pride ourselves on being,
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>
                                <span className="font-medium">Customer-Focused:</span> Your time and trust are important to us. That's why we offer transparent pricing, quick service turnarounds, and real-time updates.
                            </li>
                            <li>
                                <span className="font-medium">Technology-Driven:</span> From online booking to smart diagnostics, we leverage innovation to make vehicle care easier and more effective.
                            </li>
                            <li>
                                <span className="font-medium">Environmentally Responsible:</span> We follow eco-friendly practices and use sustainable products wherever possible.
                            </li>
                        </ul>
                        <p>
                            With RapidSaver, you're not just getting a service, you're gaining a trusted partner in vehicle health. Our mission is simple: to extend your vehicle's life, enhance its performance, and ensure your safety on the road.
                        </p>
                    </div>
                </div>
                
                {/* Google Map Embed */}
                <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-12">
                    <div className="w-full h-64">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31691.02888402245!2d79.98561827313075!3d6.8451341218721025!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2518e99e2ee8d%3A0xc3eebfdbc86273ee!2sHomagama!5e0!3m2!1sen!2slk!4v1745333410044!5m2!1sen!2slk"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen={true}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                </div>
                
                <div className="bg-gray-800 rounded-lg shadow-lg p-8">
                    <h2 className="text-xl font-bold text-white mb-6">
                        Our Locations
                    </h2>
                    
                    <ul className="space-y-8">
                        <li className="border-b border-gray-700 pb-6">
                            <div className="flex items-start">
                                <FaMapMarkerAlt className="text-blue-400 text-xl mt-1 mr-3" />
                                <div>
                                    <h3 className="text-lg font-medium text-white mb-2">Address</h3>
                                    <p className="text-gray-300 leading-relaxed mb-1">No: 98,</p>
                                    <p className="text-gray-300 leading-relaxed mb-1">High Level Road,</p>
                                    <p className="text-gray-300 leading-relaxed mb-1">Homagama</p>
                                    <div className="flex items-center text-gray-400 mb-4">
                                        <FaPhone className="mr-2" />
                                        <span>075-8492630</span>
                                    </div>
                                    <a 
                                        href="https://maps.app.goo.gl/qAViR9s37k8VZp5b8" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition duration-300"
                                    >
                                        <FaDirections className="mr-2" />
                                        Get Directions
                                    </a>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Location;