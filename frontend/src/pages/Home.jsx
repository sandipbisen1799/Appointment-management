import React, { useEffect, useState } from 'react';
import { Calendar, Clock, Users, Star, ArrowRight, CheckCircle } from 'lucide-react';
import { getServiceApi } from '../services/admin.service';
import { getAllAdmin } from '../services/visitor.service';

function Home() {
  const [services, setServices] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesRes, adminsRes] = await Promise.all([
          getServiceApi(),
          getAllAdmin()
        ]);
        setServices(servicesRes.service || []);
        setAdmins(adminsRes.admin || []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const features = [
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Easy Booking",
      description: "Book appointments in just a few clicks with our simple scheduling system"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Real-time Availability",
      description: "See available time slots in real-time and choose what works best for you"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Expert Professionals",
      description: "Connect with verified and experienced professionals in your area"
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "Quality Service",
      description: "Get guaranteed quality service with our trusted network of providers"
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Choose a Service",
      description: "Browse through our wide range of services and select what you need"
    },
    {
      number: "02",
      title: "Select a Professional",
      description: "Pick from our verified professionals based on availability and ratings"
    },
    {
      number: "03",
      title: "Pick a Time Slot",
      description: "Choose a convenient time slot from the available options"
    },
    {
      number: "04",
      title: "Confirm Booking",
      description: "Confirm your appointment and receive instant confirmation"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20 lg:py-32">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Book Your Appointments with Ease
            </h1>
            <p className="text-lg md:text-xl mb-8 text-blue-100">
              Connect with professionals, book appointments, and manage your schedule - all in one place
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#services"
                className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors inline-flex items-center justify-center gap-2"
              >
                Explore Services <ArrowRight className="w-5 h-5" />
              </a>
              <a
                href="#how-it-works"
                className="px-8 py-4 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors inline-flex items-center justify-center"
              >
                How It Works
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white shadow-md -mt-10 relative z-20 mx-4 lg:mx-8 rounded-xl">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl lg:text-4xl font-bold text-blue-600">{admins.length}+</div>
              <div className="text-gray-600 mt-1">Professionals</div>
            </div>
            <div>
              <div className="text-3xl lg:text-4xl font-bold text-blue-600">{services.length}+</div>
              <div className="text-gray-600 mt-1">Services</div>
            </div>
            <div>
              <div className="text-3xl lg:text-4xl font-bold text-blue-600">500+</div>
              <div className="text-gray-600 mt-1">Happy Clients</div>
            </div>
            <div>
              <div className="text-3xl lg:text-4xl font-bold text-blue-600">4.9</div>
              <div className="text-gray-600 mt-1">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20" id="features">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Why Choose Us</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We provide a seamless appointment booking experience with features designed for your convenience
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50" id="services">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Our Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover a wide range of services offered by our verified professionals
            </p>
          </div>
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              No services available at the moment
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <div
                  key={service._id}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-gray-100"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold text-gray-800 capitalize">
                        {service.serviceName}
                      </h3>
                      <span className="text-lg font-bold text-blue-600">
                        ₹{service.price}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {service.description}
                    </p>
                    <a
                      href="/appointment"
                      className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                    >
                      Book Now <ArrowRight className="w-4 h-4 ml-2" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20" id="how-it-works">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Booking an appointment is easy - just follow these simple steps
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 h-full">
                  <div className="text-5xl font-bold text-blue-100 mb-4">{step.number}</div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-blue-300">
                    <ArrowRight className="w-8 h-8" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Professionals Section */}
      <section className="py-20 bg-gray-50" id="professionals">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Our Professionals</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Meet our team of verified and experienced professionals
            </p>
          </div>
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : admins.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              No professionals available at the moment
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {admins.map((admin) => (
                <div
                  key={admin._id}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-gray-100 text-center"
                >
                  <div className="p-6">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-blue-600">
                        {admin.name?.charAt(0) || 'A'}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">
                      {admin.name || 'Professional'}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">{admin.email}</p>
                    <div className="flex items-center justify-center gap-1 text-yellow-400">
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-blue-100 max-w-2xl mx-auto mb-8">
            Book your first appointment today and experience the convenience of our platform
          </p>
          <a
            href="/appointment"
            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
          >
            Book an Appointment Now
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Appointment Booking</h3>
              <p className="text-gray-400">
                Your trusted platform for booking appointments with verified professionals
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#services" className="hover:text-white transition-colors">Services</a></li>
                <li><a href="#professionals" className="hover:text-white transition-colors">Professionals</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Email: sandipbisen1799@gmail.com</li>
                <li>Phone: +1 234 567 890</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Appointment Booking. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
