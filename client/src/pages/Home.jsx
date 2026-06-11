import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, Package, Map, Navigation, Route, Briefcase, ArrowRight, ShieldCheck } from 'lucide-react';

const Home = () => {
  return (
    <div className="flex flex-col items-center pb-16 w-full bg-slate-50 min-h-screen">
      {/* Hero Banner Section */}
      <div className="w-full px-4 sm:px-6 lg:px-8 mt-6">
        <div 
          className="relative w-full h-[600px] bg-cover bg-center flex items-center justify-center rounded-[3rem] shadow-2xl overflow-hidden"
          style={{ backgroundImage: "url('/cover-photo.png')" }}
        >
          {/* Advanced Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-900/80 to-transparent"></div>
          
          <div className="relative z-10 w-full max-w-7xl mx-auto px-8 sm:px-12 flex flex-col items-start">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/20 border border-blue-400/30 backdrop-blur-md mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <ShieldCheck className="w-5 h-5 text-blue-300 mr-2" />
              <span className="text-blue-200 font-medium text-sm tracking-wide">India's Trusted Transport Partner</span>
            </div>
            
            <h1 className="mb-6 text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-tight max-w-3xl animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150">
              Modern Logistics <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                Throughout India
              </span>
            </h1>
            
            <p className="mb-10 text-xl text-gray-300 font-medium max-w-2xl leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
              Streamline your entire supply chain with our production-ready platform. Reliable tracking, seamless integration, and advanced analytics all in one place.
            </p>

            <div className="flex space-x-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-500">
              <Link to="/login" className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-lg shadow-lg shadow-blue-600/30 transition-all hover:-translate-y-1 hover:shadow-xl flex items-center">
                Get Started <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Section (Overlapping the hero) */}
      <div className="w-full max-w-7xl px-6 -mt-16 relative z-20 mb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { value: '6+', label: 'Owned Goods Vehicles' },
            { value: '2+', label: 'Transport Branches' },
            { value: '15+', label: 'Years Experience' },
            { value: '12+', label: 'Courier Branches' }
          ].map((stat, idx) => (
            <div key={idx} className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-8 flex flex-col items-center justify-center text-center transform hover:-translate-y-2 hover:shadow-2xl transition duration-500 group">
              <span className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-indigo-600 mb-3 group-hover:scale-110 transition-transform duration-300">{stat.value}</span>
              <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Our Services Section */}
      <div className="w-full bg-white py-24 mb-24 shadow-sm border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">Our Services</h2>
            <div className="h-1.5 w-24 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto rounded-full mb-6"></div>
            <p className="text-xl text-gray-500 font-medium">Delivering excellence across a wide range of logistics and transportation needs with uncompromising reliability.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Navigation, title: 'National Transport', desc: 'Fast and reliable local goods transportation across states.' },
              { icon: Truck, title: 'All Truck Services', desc: 'Perfect solution for small, medium, and heavy loads.' },
              { icon: Route, title: 'Intercity Logistics', desc: 'Safe delivery of goods between major metropolitan areas.' },
              { icon: Briefcase, title: 'Business Supply', desc: 'Dedicated B2B logistics support for growing enterprises.' }
            ].map((Service, idx) => (
              <div key={idx} className="bg-slate-50 rounded-3xl p-8 border border-gray-100 hover:border-blue-200 hover:bg-white transition-all duration-300 group shadow-sm hover:shadow-2xl hover:-translate-y-2">
                <div className="bg-white text-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 shadow-md border border-gray-100 group-hover:bg-gradient-to-br group-hover:from-blue-600 group-hover:to-indigo-600 group-hover:text-white transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <Service.icon size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{Service.title}</h3>
                <p className="text-gray-500 font-medium leading-relaxed">{Service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Core Advantages */}
      <div className="w-full max-w-7xl px-6 mb-24">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">Why Choose Us</h2>
          <div className="h-1.5 w-24 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto rounded-full mb-6"></div>
          <p className="text-xl text-gray-500 font-medium">We combine decades of experience with modern technology to deliver unparalleled service.</p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {[
            { icon: Truck, title: 'Fleet Management', desc: 'Track all your vehicles in real-time with comprehensive routing, live updates, and analytics.' },
            { icon: Package, title: 'Inventory Control', desc: 'Keep exact track of every parcel passing through our secure warehouses with automated logging.' },
            { icon: Map, title: 'National Coverage', desc: 'Seamlessly manage shipments across all states in India with precision and dedicated support lines.' }
          ].map((Advantage, idx) => (
            <div key={idx} className="flex flex-col items-center p-10 bg-white rounded-3xl shadow-lg border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition duration-500 group">
              <div className="p-5 bg-blue-50 rounded-full mb-8 group-hover:bg-blue-100 transition-colors">
                <Advantage.icon className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="text-2xl font-extrabold mb-4 text-gray-900">{Advantage.title}</h3>
              <p className="text-gray-500 text-center text-lg leading-relaxed">{Advantage.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Us Banner */}
      <div className="w-full max-w-7xl px-6 mt-8">
        <div className="w-full">
          <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border border-gray-200">
            <img 
              src="/contact-us-banner.png" 
              alt="Contact Us" 
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
