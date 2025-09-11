import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import communityimg from '../../assets/community.png';
import demandimg from '../../assets/democracy.png';
import grievanceimg from '../../assets/grievance.png';
import digitalimg from '../../assets/digital.png';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const slides = [
    {
      image: grievanceimg,
      title: "Citizen Grievances",
      description: "People often struggle to get their complaints resolved quickly and fairly."
    },
    {
      image: demandimg,
      title: "Balancing Pressures",
      description: "Democracy must manage diverse demands from citizens while ensuring fair governance."
    },
    {
      image: communityimg,
      title: "Public Engagement",
      description: "Communities participating in local governance"
    },
    {
      image: digitalimg,
      title: "Digital Solutions",
      description: "Technology helps governments respond to issues faster and with greater transparency."
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0D1D25' }}>
      {/* Header */}
      <header className="border-b" style={{ backgroundColor: '#104C64', borderColor: '#C6C6D0' }}>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2" style={{ color: '#C6C6D0' }}>
              Samadhan Sethu
            </h1>
            <p className="text-lg" style={{ color: '#D59D80' }}>
              Connecting Communities Through Technology
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* NEW: Complaint Intro Section */}
        <div className="bg-gradient-to-r from-[#104C64] to-[#053a2b] text-[#C6C6D0] rounded-2xl shadow-lg p-10 mb-12">
          <h2 className="text-3xl font-bold mb-4">Raise Your Voice, Shape Your Locality</h2>
          <p className="text-lg text-[#D59D80] mb-6 leading-relaxed">
            Have you noticed issues in your area—like broken roads, waste management, 
            or lack of basic services? Register a complaint and let the authorities know. 
            Together, we can make our communities stronger and more accountable.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-3 rounded-xl font-semibold shadow-md transition 
                       bg-gradient-to-r from-[#C0754D] to-[#B6410F] text-white 
                       hover:scale-105"
          >
            Register a Complaint
          </button>
        </div>

        {/* Infinite Image Slider */}
        <div className="relative overflow-hidden rounded-3xl shadow-2xl" style={{ height: '75vh' }}>
          {/* Background Blur Layer */}
          <div className="absolute inset-0">
            {slides.map((slide, index) => (
              <div
                key={`blur-${index}`}
                className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                  index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
                }`}
              >
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover filter blur-md scale-110"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(135deg, 
                      rgba(13, 29, 37, 0.85) 0%, 
                      rgba(16, 76, 100, 0.75) 30%, 
                      rgba(192, 117, 77, 0.65) 60%, 
                      rgba(182, 65, 15, 0.75) 100%)`
                  }}
                ></div>
              </div>
            ))}
          </div>

          {/* Main Content Sliding Container */}
          <div className="relative z-10 h-full flex items-center">
            <div
              className="flex transition-transform duration-1000 ease-in-out w-full"
              style={{
                transform: `translateX(-${currentSlide * 100}%)`,
                width: `${slides.length * 100}%`
              }}
            >
              {slides.map((slide, index) => (
                <div key={index} className="flex-shrink-0 w-full flex items-center justify-center px-8">
                  <div className="text-center max-w-5xl">
                    <div className="relative inline-block mb-8">
                      <div
                        className="p-2 rounded-3xl shadow-2xl"
                        style={{
                          background: `linear-gradient(135deg, #C0754D, #B6410F)`,
                        }}
                      >
                        <div className="relative overflow-hidden rounded-2xl">
                          <img
                            src={slide.image}
                            alt={slide.title}
                            className="w-96 h-64 object-cover transform hover:scale-105 transition-transform duration-500"
                            style={{
                              filter: 'brightness(1.1) contrast(1.1)',
                            }}
                          />
                          <div
                            className="absolute inset-0"
                            style={{
                              background: `linear-gradient(135deg, 
                                rgba(13, 29, 37, 0.1) 0%, 
                                rgba(16, 76, 100, 0.1) 50%, 
                                rgba(192, 117, 77, 0.1) 100%)`
                            }}
                          ></div>
                        </div>
                      </div>
                      <div
                        className="absolute -top-4 -left-4 w-8 h-8 rounded-full opacity-80"
                        style={{ backgroundColor: '#D59D80' }}
                      ></div>
                      <div
                        className="absolute -bottom-4 -right-4 w-6 h-6 rounded-full opacity-60"
                        style={{ backgroundColor: '#C0754D' }}
                      ></div>
                    </div>
                    <h2
                      className="text-5xl font-bold mb-4 leading-tight"
                      style={{
                        color: '#C6C6D0',
                        textShadow: '3px 3px 6px rgba(13, 29, 37, 0.9)',
                        letterSpacing: '-0.02em'
                      }}
                    >
                      {slide.title}
                    </h2>
                    <p
                      className="text-xl font-medium leading-relaxed max-w-2xl mx-auto"
                      style={{
                        color: '#D59D80',
                        textShadow: '2px 2px 4px rgba(13, 29, 37, 0.8)'
                      }}
                    >
                      {slide.description}
                    </p>
                    <div className="mt-6 flex justify-center">
                      <div
                        className="w-24 h-1 rounded-full opacity-80"
                        style={{ backgroundColor: '#C0754D' }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-2" style={{ backgroundColor: 'rgba(198, 198, 208, 0.2)' }}>
            <div
              className="h-full transition-all duration-500 rounded-full"
              style={{
                background: `linear-gradient(90deg, #D59D80, #C0754D)`,
                width: `${((currentSlide + 1) / slides.length) * 100}%`,
                boxShadow: '0 0 10px rgba(213, 157, 128, 0.5)'
              }}
            ></div>
          </div>

          {/* Navigation Dots */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <div className="flex space-x-4">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`relative transition-all duration-300 ${
                    index === currentSlide ? 'scale-125' : 'hover:scale-110'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full transition-all duration-300 ${
                      index === currentSlide ? 'opacity-100' : 'opacity-60 hover:opacity-80'
                    }`}
                    style={{
                      backgroundColor: index === currentSlide ? '#D59D80' : '#C6C6D0',
                      boxShadow: index === currentSlide
                        ? '0 0 20px rgba(213, 157, 128, 0.6)'
                        : 'none'
                    }}
                  />
                  {index === currentSlide && (
                    <div
                      className="absolute inset-0 rounded-full animate-pulse"
                      style={{
                        backgroundColor: '#D59D80',
                        opacity: 0.3,
                        transform: 'scale(1.5)'
                      }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Floating decorative elements */}
          <div className="absolute top-1/4 left-12">
            <div
              className="w-20 h-20 rounded-full opacity-20 animate-pulse"
              style={{ backgroundColor: '#C0754D' }}
            ></div>
          </div>
          <div className="absolute bottom-1/4 right-16">
            <div
              className="w-16 h-16 rounded-full opacity-15 animate-pulse"
              style={{
                backgroundColor: '#B6410F',
                animationDelay: '1s'
              }}
            ></div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 text-center">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold mb-6" style={{ color: '#C6C6D0' }}>
              Building Trust with Digital Engagement
            </h3>
            <p className="text-xl leading-relaxed mb-8" style={{ color: '#D59D80' }}>
              Experience the future of citizen-government interaction with our comprehensive platform
              that bridges the gap between communities and civic authorities through smart technology solutions.
            </p>
            <div
              className="w-32 h-1 mx-auto rounded-full"
              style={{ backgroundColor: '#C0754D' }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
