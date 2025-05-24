import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getServicesAsList } from "../../config/ServiceFunctions";

interface Service {
  id?: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  pic: string;
}

const Services = () => {
  const [servicesList, setServicesList] = useState<Service[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCriteria, setFilterCriteria] = useState("services");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    const getAllServices = async () => {
      const data = await getServicesAsList();
      setServicesList(data);
    };
    getAllServices();
  }, []);

  const filteredServices = servicesList
    .filter((service) =>
      service.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((service) => {
      switch (filterCriteria) {
        case "lowPrice":
          return service.price <= 8000;
        case "highPrice":
          return service.price >= 1000;
        case "shortDuration":
          return service.duration >= 15;
        case "longDuration":
          return service.duration <= 90;
        case "services":
        default:
          return true;
      }
    })
    .sort((a, b) => {
      if (filterCriteria === "lowPrice") return a.price - b.price;
      if (filterCriteria === "highPrice") return b.price - a.price;
      if (filterCriteria === "shortDuration") return a.duration - b.duration;
      if (filterCriteria === "longDuration") return b.duration - a.duration;

      return sortOrder === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    });

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center p-4 mt-[52px] lg:mt-[62px]"
      style={{ backgroundImage: "url('/images/bg-carwash.jpg')" }}
    >
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-5xl w-full">
        <h2 className="text-3xl font-serif mb-6 text-center">Our Services</h2>

        <div className="mb-6 flex flex-col lg:flex-row justify-between lg:gap-5 items-center">
          <input
            type="text"
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full lg:w-1/3 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 mb-4 lg:mb-0"
          />
          <select
            value={filterCriteria}
            onChange={(e) => setFilterCriteria(e.target.value)}
            className="w-full lg:w-1/3 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 mb-4 lg:mb-0"
          >
            <option value="services">All Services</option>
            <option value="lowPrice">Price: Low</option>
            <option value="highPrice">Price: High</option>
            <option value="shortDuration">Duration: Short</option>
            <option value="longDuration">Duration: Long</option>
          </select>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="w-full lg:w-1/3 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="asc">Sort: A-Z</option>
            <option value="desc">Sort: Z-A</option>
          </select>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="border rounded-lg shadow-md overflow-hidden flex flex-col hover:shadow-lg transition-shadow"
            >
              <img
                src={service.pic}
                alt={service.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-xl font-serif mb-1">{service.name}</h3>
                <p className="text-gray-700 mb-2">{service.description}</p>
                <p className="text-gray-500 mb-3">
                  <strong>Price:</strong> Rs.{service.price} |{" "}
                  <strong>Duration:</strong> {service.duration} mins
                </p>
                <div className="mt-auto">
                  <Link
                    to={`/booking`}
                    className="block text-center border border-green-500 text-green-600 hover:bg-green-500 hover:text-white px-4 py-2 rounded transition"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
