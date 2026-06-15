import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Truck, Package, Map, Navigation, Route, Briefcase, ArrowRight, ShieldCheck, Search, Loader2, MapPin, User, CheckCircle2, Star, Quote } from 'lucide-react';
import { trackLR } from '../services/lr.service';

const Home = () => {
  const [trackInput, setTrackInput] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const [trackResult, setTrackResult] = useState(null);
  const [trackError, setTrackError] = useState('');

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!trackInput.trim()) return;
    
    setIsTracking(true);
    setTrackError('');
    setTrackResult(null);
    
    try {
      const res = await trackLR(trackInput.trim());
      if (res.success) {
        setTrackResult(res.data);
      } else {
        setTrackError('Lorry Receipt not found. Please check the number.');
      }
    } catch (err) {
      setTrackError(err.response?.data?.message || 'Failed to track parcel. Please try again.');
    } finally {
      setIsTracking(false);
    }
  };

  return (
    <div className="flex flex-col items-center pb-16 w-full bg-slate-50 min-h-screen">
      {/* Hero Banner Section */}
      <div className="w-full px-4 sm:px-6 lg:px-8 mt-6">
        <div 
          className="relative w-full h-[600px] bg-cover bg-center flex items-center justify-center rounded-[3rem] shadow-2xl overflow-hidden"
          style={{ backgroundImage: "url('/cover-photo.png')" }}
        >
          {/* Advanced Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-stone-900/95 via-stone-900/80 to-transparent"></div>
          
          <div className="relative z-10 w-full max-w-7xl mx-auto px-8 sm:px-12 flex flex-col items-start">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-amber-500/20 border border-amber-400/30 backdrop-blur-md mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <ShieldCheck className="w-5 h-5 text-amber-300 mr-2" />
              <span className="text-amber-200 font-medium text-sm tracking-wide">India's Trusted Transport Partner</span>
            </div>
            
            <h1 className="mb-6 text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-tight max-w-3xl animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150">
              Modern Logistics <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
                Throughout India
              </span>
            </h1>
            
            <p className="mb-10 text-xl text-stone-200 font-medium max-w-2xl leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
              Streamline your entire supply chain with our production-ready platform. Reliable tracking, seamless integration, and advanced analytics all in one place.
            </p>

            <div className="flex space-x-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-500">
              <Link to="/login" className="px-8 py-4 bg-amber-700 hover:bg-amber-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-amber-900/30 transition-all hover:-translate-y-1 hover:shadow-xl flex items-center">
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
            { value: '5+', label: 'Years Experience' },
            { value: '12+', label: 'Courier Branches' }
          ].map((stat, idx) => (
            <div key={idx} className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-amber-100/50 p-8 flex flex-col items-center justify-center text-center transform hover:-translate-y-2 hover:shadow-2xl transition duration-500 group">
              <span className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-amber-700 to-orange-700 mb-3 group-hover:scale-110 transition-transform duration-300">{stat.value}</span>
              <span className="text-sm font-bold text-stone-600 uppercase tracking-widest">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Track Parcel Section */}
      <div className="w-full max-w-4xl px-6 mb-24 mx-auto relative z-20">
        <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl border border-amber-100/50">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-stone-900 mb-4">Track Your Parcel</h2>
            <p className="text-stone-500 text-lg">Enter your LR Number to get real-time status updates.</p>
          </div>
          
          <form onSubmit={handleTrack} className="relative flex items-center mb-8">
            <Search className="absolute left-6 text-amber-500 w-6 h-6" />
            <input 
              type="text" 
              placeholder="e.g. AN10023"
              className="w-full pl-16 pr-32 py-5 bg-slate-50 border border-stone-200 rounded-full text-lg font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all uppercase placeholder-stone-400"
              value={trackInput}
              onChange={(e) => setTrackInput(e.target.value)}
            />
            <button 
              type="submit" 
              disabled={isTracking || !trackInput.trim()}
              className="absolute right-2 top-2 bottom-2 px-8 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-full font-bold shadow-md shadow-amber-900/20 transition-all disabled:opacity-70 flex items-center justify-center"
            >
              {isTracking ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Track'}
            </button>
          </form>

          {trackError && (
            <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-center font-medium animate-in fade-in slide-in-from-top-2">
              {trackError}
            </div>
          )}

          {trackResult && (
            <div className="bg-slate-50 rounded-3xl p-6 md:p-10 border border-stone-100 shadow-inner animate-in zoom-in-95 fade-in duration-500">
              <div className="flex flex-col md:flex-row items-center justify-between mb-8 pb-8 border-b border-stone-200 border-dashed gap-6">
                <div className="flex flex-col items-center md:items-start text-center md:text-left">
                  <span className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-1">From</span>
                  <div className="flex items-center text-2xl font-extrabold text-stone-800 uppercase">
                    <MapPin className="w-6 h-6 text-amber-500 mr-2" />
                    {trackResult.fromPlace}
                  </div>
                </div>
                
                <div className="flex flex-col items-center flex-1 w-full md:px-8">
                  <div className="w-full flex items-center">
                    <div className="w-3 h-3 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50"></div>
                    <div className="flex-1 h-1 bg-gradient-to-r from-amber-400 to-orange-400"></div>
                    <Truck className="w-10 h-10 text-orange-600 mx-3 animate-bounce drop-shadow-md" />
                    <div className="flex-1 h-1 bg-gradient-to-r from-orange-400 to-amber-400"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50"></div>
                  </div>
                  <span className="mt-6 px-6 py-2 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-900 border border-amber-200 rounded-full text-sm font-black uppercase tracking-widest shadow-sm">
                    {trackResult.status}
                  </span>
                </div>
                
                <div className="flex flex-col items-center md:items-end text-center md:text-right">
                  <span className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-1">To</span>
                  <div className="flex items-center text-2xl font-extrabold text-stone-800 uppercase">
                    {trackResult.toPlace}
                    <MapPin className="w-6 h-6 text-orange-500 ml-2" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
                <div className="flex items-start">
                  <div className="p-3 bg-slate-50 rounded-xl border border-stone-100 mr-4">
                    <User className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-stone-400 uppercase tracking-widest block mb-1">Consignor (Sender)</span>
                    <span className="font-extrabold text-stone-800 text-lg uppercase">{trackResult.consignorName}</span>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="p-3 bg-slate-50 rounded-xl border border-stone-100 mr-4">
                    <User className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-stone-400 uppercase tracking-widest block mb-1">Consignee (Receiver)</span>
                    <span className="font-extrabold text-stone-800 text-lg uppercase">{trackResult.consigneeName}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* About Us Section */}
      <div className="w-full bg-slate-50 py-24 shadow-sm border-b border-stone-200/50 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-100 rounded-full blur-3xl opacity-50 -mt-20 -mr-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-orange-100 rounded-full blur-3xl opacity-50 -mb-20 -ml-20 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="w-full lg:w-1/2">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-amber-100 border border-amber-200 mb-6">
                <span className="text-amber-800 font-bold text-sm tracking-widest uppercase">About Us</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-stone-900 mb-6 tracking-tight leading-tight">
                Uzento Road Transport <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">Logistics (URTL)</span>
              </h2>
              <p className="text-lg text-stone-600 font-medium leading-relaxed mb-6">
                Established with a vision to redefine the transport industry, URTL Logistics has grown into one of India's most trusted logistics partners. We specialize in providing end-to-end supply chain solutions that are both reliable and highly efficient.
              </p>
              <p className="text-lg text-stone-600 font-medium leading-relaxed mb-10">
                Whether it's national freight transport, intercity distribution, or precise inventory management, our dedicated team and modern fleet ensure your goods reach their destination safely, securely, and on time.
              </p>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-700">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900">100% Safe</h4>
                    <p className="text-sm text-stone-500">Secure Transport</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-700">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900">On-Time</h4>
                    <p className="text-sm text-stone-500">Fast Delivery</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="w-full lg:w-1/2 relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-200 to-orange-200 rounded-[3rem] transform rotate-3 scale-105 opacity-50"></div>
              <img 
                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop" 
                alt="Logistics Fleet" 
                className="relative z-10 w-full h-[500px] object-cover rounded-[3rem] shadow-2xl border-4 border-white"
              />
              
              <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-3xl shadow-xl z-20 border border-stone-100 animate-bounce" style={{ animationDuration: '3s' }}>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-orange-500/30">
                    <span className="text-xl font-bold">5+</span>
                  </div>
                  <div>
                    <h4 className="font-extrabold text-stone-900">Years of</h4>
                    <p className="text-amber-600 font-bold">Excellence</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Services Section */}
      <div className="w-full bg-white py-24 mb-24 shadow-sm border-y border-stone-200/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-extrabold text-stone-900 mb-6 tracking-tight">Our Services</h2>
            <div className="h-1.5 w-24 bg-gradient-to-r from-amber-700 to-orange-700 mx-auto rounded-full mb-6"></div>
            <p className="text-xl text-stone-600 font-medium">Delivering excellence across a wide range of logistics and transportation needs with uncompromising reliability.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Navigation, title: 'National Transport', desc: 'Fast and reliable local goods transportation across states.' },
              { icon: Truck, title: 'All Truck Services', desc: 'Perfect solution for small, medium, and heavy loads.' },
              { icon: Route, title: 'Intercity Logistics', desc: 'Safe delivery of goods between major metropolitan areas.' },
              { icon: Briefcase, title: 'Business Supply', desc: 'Dedicated B2B logistics support for growing enterprises.' }
            ].map((Service, idx) => (
              <div key={idx} className="bg-slate-50 rounded-3xl p-8 border border-stone-100 hover:border-amber-300 hover:bg-white transition-all duration-300 group shadow-sm hover:shadow-2xl hover:-translate-y-2">
                <div className="bg-amber-100 text-amber-800 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 shadow-sm border border-amber-200 group-hover:bg-gradient-to-br group-hover:from-amber-700 group-hover:to-orange-700 group-hover:text-white transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <Service.icon size={32} />
                </div>
                <h3 className="text-xl font-bold text-stone-900 mb-3">{Service.title}</h3>
                <p className="text-stone-600 font-medium leading-relaxed">{Service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Core Advantages */}
      <div className="w-full max-w-7xl px-6 mb-24">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-extrabold text-stone-900 mb-6 tracking-tight">Why Choose Us</h2>
          <div className="h-1.5 w-24 bg-gradient-to-r from-amber-700 to-orange-700 mx-auto rounded-full mb-6"></div>
          <p className="text-xl text-stone-600 font-medium">We combine decades of experience with modern technology to deliver unparalleled service.</p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {[
            { icon: Truck, title: 'Fleet Management', desc: 'Track all your vehicles in real-time with comprehensive routing, live updates, and analytics.' },
            { icon: Package, title: 'Inventory Control', desc: 'Keep exact track of every parcel passing through our secure warehouses with automated logging.' },
            { icon: Map, title: 'National Coverage', desc: 'Seamlessly manage shipments across all states in India with precision and dedicated support lines.' }
          ].map((Advantage, idx) => (
            <div key={idx} className="flex flex-col items-center p-10 bg-white rounded-3xl shadow-lg border border-amber-100/60 hover:shadow-2xl hover:-translate-y-2 transition duration-500 group">
              <div className="p-5 bg-amber-100 rounded-full mb-8 group-hover:bg-amber-200 transition-colors">
                <Advantage.icon className="h-12 w-12 text-amber-800" />
              </div>
              <h3 className="text-2xl font-extrabold mb-4 text-stone-900">{Advantage.title}</h3>
              <p className="text-stone-600 text-center text-lg leading-relaxed">{Advantage.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works Section */}
      <div className="w-full bg-slate-900 py-24 mb-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1519003722824-194d4455a60c?q=80&w=2075&auto=format&fit=crop')", backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">How URTL Works</h2>
            <div className="h-1.5 w-24 bg-gradient-to-r from-amber-400 to-orange-400 mx-auto rounded-full mb-6"></div>
            <p className="text-xl text-stone-300 font-medium">A seamless, 3-step process to ensure your goods are transported with maximum efficiency and zero hassle.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-1 bg-gradient-to-r from-amber-500/0 via-amber-500/50 to-orange-500/0"></div>
            
            {[
              { num: '01', title: 'Book Your Shipment', desc: 'Contact our branches or use our portal to book your goods. We generate a unique Lorry Receipt (LR) for tracking.' },
              { num: '02', title: 'Safe Loading & Transit', desc: 'Our team securely loads your goods onto our verified fleet, ensuring safe transit across national routes.' },
              { num: '03', title: 'On-Time Delivery', desc: 'Track your parcel in real-time until it reaches the consignee safely. Fast, reliable, and hassle-free.' }
            ].map((step, idx) => (
              <div key={idx} className="relative flex flex-col items-center text-center group">
                <div className="w-24 h-24 bg-slate-800 border-4 border-slate-900 rounded-full flex items-center justify-center mb-8 relative z-10 shadow-xl group-hover:border-amber-500 transition-colors duration-300">
                  <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-amber-400 to-orange-500">{step.num}</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
                <p className="text-stone-400 text-lg leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Client Testimonials Section */}
      <div className="w-full bg-amber-50 py-24 mb-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-200 rounded-full blur-3xl opacity-30 -mt-10 -mr-10"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-200 rounded-full blur-3xl opacity-30 -mb-20 -ml-20"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-extrabold text-stone-900 mb-6 tracking-tight">What Our Clients Say</h2>
            <div className="h-1.5 w-24 bg-gradient-to-r from-amber-600 to-orange-600 mx-auto rounded-full mb-6"></div>
            <p className="text-xl text-stone-600 font-medium">Don't just take our word for it. Hear from the businesses and individuals who trust us with their goods.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Rajesh Kumar',
                company: 'TechCorp Solutions',
                review: 'URTL Logistics completely transformed our supply chain. Their tracking system is incredibly accurate, and our deliveries are always on time.',
                rating: 5
              },
              {
                name: 'Sneha Reddy',
                company: 'Boutique Exporters',
                review: 'The staff is extremely professional. Even fragile shipments reach their destination in perfect condition. Highly recommend their services!',
                rating: 5
              },
              {
                name: 'Vikram Singh',
                company: 'AgriTech Industries',
                review: 'Finding a reliable logistics partner was tough until we found URTL. They handle our bulk industrial shipments with absolute ease and safety.',
                rating: 5
              }
            ].map((testimonial, idx) => (
              <div key={idx} className="bg-white p-10 rounded-3xl shadow-lg border border-amber-100 relative group hover:-translate-y-2 hover:shadow-2xl transition duration-500">
                <Quote className="absolute top-8 right-8 w-12 h-12 text-amber-100 group-hover:text-amber-200 transition-colors" />
                <div className="flex space-x-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-stone-700 text-lg leading-relaxed mb-8 italic">"{testimonial.review}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold text-xl mr-4 shadow-md">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-stone-900">{testimonial.name}</h4>
                    <p className="text-sm font-bold text-amber-700">{testimonial.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>



      {/* Bottom CTA Section */}
      <div className="w-full max-w-7xl px-6 mb-24 relative">
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 rounded-[3rem] p-12 md:p-20 text-center shadow-2xl relative overflow-hidden">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -mt-10 -mr-10"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl -mb-20 -ml-20"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white opacity-5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-8 tracking-tight leading-tight">
              Ready to Optimize Your Logistics?
            </h2>
            <p className="text-xl text-amber-100 font-medium mb-12 leading-relaxed">
              Join thousands of businesses across India that trust URTL Logistics for fast, secure, and transparent transport services.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link to="/login" className="px-10 py-5 bg-white text-orange-700 hover:bg-stone-50 rounded-2xl font-black text-xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 w-full sm:w-auto flex items-center justify-center group">
                Access Portal
                <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href="tel:+916305746114" className="px-10 py-5 bg-transparent border-2 border-white/30 text-white hover:bg-white/10 rounded-2xl font-bold text-xl transition-all hover:-translate-y-1 w-full sm:w-auto flex items-center justify-center">
                Contact Sales
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
