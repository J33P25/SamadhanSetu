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
    <div className="min-h-screen bg-gradient-to-br from-[#0b3f35] via-[#134e42] to-[#1a5a4e] relative overflow-hidden">
      
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-orange-400 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-orange-300 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-teal-300 rounded-full blur-3xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-20 right-1/3 w-24 h-24 bg-orange-500 rounded-full blur-3xl animate-pulse delay-3000"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-gradient-to-r from-[#0b3f35] to-[#134e42] shadow-2xl border-b border-orange-200/20">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center relative">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400/5 to-teal-400/5 blur-xl rounded-3xl"></div>
            <div className="relative">
              <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-orange-300 via-orange-200 to-orange-100 bg-clip-text text-transparent drop-shadow-lg">
                Samadhan Sethu
              </h1>
              <p className="text-xl font-medium text-orange-200/90 tracking-wide">
                Connecting Communities Through Technology
              </p>
              <div className="mt-4 w-24 h-1 bg-gradient-to-r from-orange-400 to-orange-300 mx-auto rounded-full shadow-lg"></div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        {/* Enhanced Complaint Intro Section */}
        <div className="bg-gradient-to-br from-[#0b3f35] via-[#134e42] to-[#1a5a4e] text-white rounded-3xl shadow-2xl p-12 mb-16 border border-orange-200/10 relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-orange-400/10 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-teal-400/10 to-transparent rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <h2 className="text-4xl font-bold mb-6 text-orange-100">
              Raise Your Voice, Shape Your Locality
            </h2>
            <p className="text-xl text-orange-200/90 mb-8 leading-relaxed max-w-4xl">
              Have you noticed issues in your area—like broken roads, waste management, 
              or lack of basic services? Register a complaint and let the authorities know. 
              Together, we can make our communities stronger and more accountable.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="group relative px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl transition-all duration-300 
                         bg-gradient-to-r from-orange-500 via-orange-400 to-orange-500 text-white 
                         hover:from-orange-400 hover:via-orange-300 hover:to-orange-400
                         hover:scale-105 hover:shadow-orange-400/30
                         border border-orange-300/20"
            >
              <span className="relative z-10">Register a Complaint</span>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-500 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>

        {/* Enhanced Image Slider */}
        <div className="relative overflow-hidden rounded-3xl shadow-2xl border border-orange-200/20" style={{ height: '75vh' }}>
          {/* Enhanced Background Blur Layer */}
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
                      rgba(11, 63, 53, 0.9) 0%, 
                      rgba(19, 78, 66, 0.85) 30%, 
                      rgba(26, 90, 78, 0.8) 60%, 
                      rgba(245, 158, 11, 0.3) 100%)`
                  }}
                ></div>
              </div>
            ))}
          </div>

          {/* Enhanced Main Content Sliding Container */}
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
                    <div className="relative inline-block mb-10">
                      <div
                        className="p-3 rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-500"
                        style={{
                          background: `linear-gradient(135deg, #f59e0b, #d97706, #92400e)`,
                        }}
                      >
                        <div className="relative overflow-hidden rounded-2xl ring-4 ring-orange-300/30">
                          <img
                            src={slide.image}
                            alt={slide.title}
                            className="w-96 h-64 object-cover transform hover:scale-110 transition-transform duration-700"
                            style={{
                              filter: 'brightness(1.15) contrast(1.1) saturate(1.1)',
                            }}
                          />
                          <div
                            className="absolute inset-0 bg-gradient-to-tr from-teal-900/20 via-transparent to-orange-900/20"
                          ></div>
                        </div>
                      </div>
                      {/* Enhanced Decorative Elements */}
                      <div className="absolute -top-6 -left-6 w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full opacity-80 animate-bounce"></div>
                      <div className="absolute -bottom-6 -right-6 w-8 h-8 bg-gradient-to-br from-teal-400 to-teal-500 rounded-full opacity-70 animate-pulse"></div>
                      <div className="absolute top-4 -right-8 w-6 h-6 bg-gradient-to-br from-orange-300 to-orange-400 rounded-full opacity-60 animate-ping"></div>
                    </div>
                    
                    <h2
                      className="text-5xl font-bold mb-6 leading-tight bg-gradient-to-r from-orange-200 via-orange-100 to-white bg-clip-text text-transparent"
                      style={{
                        textShadow: '3px 3px 6px rgba(11, 63, 53, 0.9)',
                        letterSpacing: '-0.02em'
                      }}
                    >
                      {slide.title}
                    </h2>
                    <p
                      className="text-xl font-medium leading-relaxed max-w-2xl mx-auto text-orange-200/95"
                      style={{
                        textShadow: '2px 2px 4px rgba(11, 63, 53, 0.8)'
                      }}
                    >
                      {slide.description}
                    </p>
                    <div className="mt-8 flex justify-center">
                      <div className="w-32 h-1.5 bg-gradient-to-r from-orange-400 via-orange-300 to-orange-400 rounded-full shadow-lg opacity-90"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced Progress Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-r from-teal-900/30 to-orange-900/30 backdrop-blur-sm">
            <div
              className="h-full transition-all duration-500 rounded-full shadow-lg"
              style={{
                background: `linear-gradient(90deg, #f59e0b, #d97706, #b45309)`,
                width: `${((currentSlide + 1) / slides.length) * 100}%`,
                boxShadow: '0 0 20px rgba(245, 158, 11, 0.6)'
              }}
            ></div>
          </div>

          {/* Enhanced Navigation Dots */}
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
            <div className="flex space-x-4 bg-black/20 backdrop-blur-md rounded-full px-6 py-3 border border-white/10">
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
                      backgroundColor: index === currentSlide ? '#f59e0b' : '#d1d5db',
                      boxShadow: index === currentSlide
                        ? '0 0 25px rgba(245, 158, 11, 0.8), inset 0 0 10px rgba(245, 158, 11, 0.3)'
                        : '0 0 10px rgba(0,0,0,0.2)'
                    }}
                  />
                  {index === currentSlide && (
                    <div
                      className="absolute inset-0 rounded-full animate-ping"
                      style={{
                        backgroundColor: '#f59e0b',
                        opacity: 0.4,
                        transform: 'scale(1.8)'
                      }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Enhanced floating decorative elements */}
          <div className="absolute top-1/4 left-12 animate-float">
            <div className="w-24 h-24 bg-gradient-to-br from-orange-400/30 to-orange-500/20 rounded-full blur-sm animate-pulse"></div>
          </div>
          <div className="absolute bottom-1/4 right-16 animate-float-delayed">
            <div className="w-20 h-20 bg-gradient-to-br from-teal-400/25 to-teal-500/15 rounded-full blur-sm animate-pulse"></div>
          </div>
          <div className="absolute top-1/3 right-24 animate-float-slow">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-300/20 to-orange-400/10 rounded-full blur-sm animate-pulse"></div>
          </div>
        </div>

        {/* Enhanced Bottom Section */}
        <div className="mt-20 text-center">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-[#0b3f35]/50 to-[#134e42]/30 rounded-3xl p-12 border border-orange-200/10 backdrop-blur-sm">
            <h3 className="text-4xl font-bold mb-8 bg-gradient-to-r from-orange-200 to-orange-100 bg-clip-text text-transparent">
              Building Trust with Digital Engagement
            </h3>
            <p className="text-xl leading-relaxed mb-10 text-orange-200/90 max-w-3xl mx-auto">
              Experience the future of citizen-government interaction with our comprehensive platform
              that bridges the gap between communities and civic authorities through smart technology solutions.
            </p>
            <div className="flex justify-center">
              <div className="w-40 h-1.5 bg-gradient-to-r from-orange-400 via-orange-300 to-orange-400 rounded-full shadow-lg"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite 2s;
        }
        .animate-float-slow {
          animation: float-slow 10s ease-in-out infinite 4s;
        }
      `}</style>
    </div>
  );
};

export default Home;