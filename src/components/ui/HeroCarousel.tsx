import React, { useState, useEffect } from "react";
import { Carousel, CarouselRef } from "antd";
import { useNavigate } from "react-router-dom";
import { ArrowRightCircle } from "lucide-react";

const HeroCarousel = () => {
  const navigate = useNavigate();
  const [direction, setDirection] = useState('right');
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = React.useRef<CarouselRef>(null);
  
  const carouselSlides = [
    {
      image: "/src/assets/Images/wash1.jpg",
      title: "Experience the Ultimate Vehicle Care",
      description: "Fast, reliable, and eco-friendly vehicle wash services tailored to your needs. Book your spot today.!",
      buttonText: "Book Now"
    },
    {
      image: "src/assets/Images/wash2.jpg",
      title: "Experience the Ultimate Vehicle Care",
      description: "Fast, reliable, and eco-friendly vehicle wash services tailored to your needs. Book your spot today.!",
      buttonText: "Book Now"
    },
    {
      image: "src/assets/Images/wash3.jpg",
      title: "Experience the Ultimate Vehicle Care",
      description: "Fast, reliable, and eco-friendly vehicle wash services tailored to your needs. Book your spot today.!",
      buttonText: "Book Now"
    },
    {
      image: "src/assets/Images/wash4.jpg",
      title: "Experience the Ultimate Vehicle Care",
      description: "Fast, reliable, and eco-friendly vehicle wash services tailored to your needs. Book your spot today.!",
      buttonText: "Book Now"
    }
  ];

  // Handle auto-sliding with direction change
  useEffect(() => {
    const interval = setInterval(() => {
      if (direction === 'right') {
        if (currentSlide < carouselSlides.length - 1) {
          carouselRef.current?.next();
          setCurrentSlide(currentSlide + 1);
        } else {
          setDirection('left');
        }
      } else {
        if (currentSlide > 0) {
          carouselRef.current?.prev();
          setCurrentSlide(currentSlide - 1);
        } else {
          setDirection('right');
        }
      }
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, [currentSlide, direction, carouselSlides.length]);

  // Track current slide manually
  const handleBeforeChange = (current: number, next: number): void => {
    setCurrentSlide(next);
  };

  return (
    <section className="relative bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto">
        <Carousel
          ref={carouselRef}
          beforeChange={handleBeforeChange}
          dots={true}
          dotPosition="bottom"
          arrows={true}
          effect="fade"
          autoplay={false} // We're managing our own autoplay with direction changes
          className="carousel-container"
        >
          {carouselSlides.map((slide, index) => (
            <div key={index}>
              <div className="relative h-screen max-h-screen overflow-hidden">
                {/* Background Image with modern overlay */}
                <div 
                  className="absolute inset-0 bg-cover bg-center transform scale-105 transition-transform duration-1000"
                  style={{ backgroundImage: `url('${slide.image}')` }}
                />
                
                {/* Gradient Overlay for better text visibility */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40"></div>
                
                {/* Content Container */}
                <div className="relative flex items-center justify-center h-full px-6 md:px-16 lg:px-24">
                  <div className="max-w-4xl text-center">
                    {/* Heading with animation */}
                    <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl text-white font-bold mb-6 tracking-tight leading-tight">
                      {slide.title}
                    </h1>
                    
                    {/* Description with better typography */}
                    <p className="text-base md:text-xl text-gray-100 mb-8 max-w-2xl mx-auto font-light">
                      {slide.description}
                    </p>
                    
                    {/* Modern Button with hover effect */}
                    <button
                      onClick={() => navigate("/services")}
                      className="group flex items-center justify-center mx-auto px-8 py-4 bg-emerald-500 text-white text-lg font-medium rounded-lg shadow-lg hover:bg-emerald-600 transition-all duration-300 transform hover:translate-y-px focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2"
                    >
                      <span>{slide.buttonText}</span>
                      <ArrowRightCircle className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Carousel>
      </div>
      
      {/* Visual indicator for direction */}
      <div className="absolute bottom-5 right-5 text-white bg-black/30 px-3 py-1 rounded-full text-xs">
        {direction === 'right' ? 'Sliding Right →' : '← Sliding Left'}
      </div>
      
      {/* Custom styling for carousel dots */}
      <style>{`
        .ant-carousel .slick-dots li button {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.4);
        }
        
        .ant-carousel .slick-dots li.slick-active button {
          background: #10b981;
          width: 24px;
          border-radius: 12px;
        }
        
        .ant-carousel .slick-dots-bottom {
          bottom: 30px;
        }
        
        .ant-carousel .slick-dots li {
          margin: 0 6px;
        }
        
        .carousel-container {
          margin-bottom: 0;
        }
        
        .ant-carousel .slick-prev,
        .ant-carousel .slick-next {
          font-size: 20px;
          color: white;
          z-index: 10;
        }
        
        .ant-carousel .slick-prev {
          left: 20px;
        }
        
        .ant-carousel .slick-next {
          right: 20px;
        }
      `}</style>
    </section>
  );
};

export default HeroCarousel;