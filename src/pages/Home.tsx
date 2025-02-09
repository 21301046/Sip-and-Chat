import React from 'react';
import { Link } from 'react-router-dom';
import { Coffee, Package, Truck, Star, MapPin, Phone, Mail, ChevronRight, MessageCircle } from 'lucide-react';
import { ProductCarousel } from '../components/ProductCarousel';

export function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div
        className="h-screen bg-cover bg-center relative"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1495474472287-4d71bcdd2085)',
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Discover Premium Coffee
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              From Bean to Cup, Experience Excellence
            </p>
            <Link
              to="/shop"
              className="bg-primary-600 text-white px-8 py-3 rounded-md text-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>

      {/* Latest Products Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Latest Products</h2>
            <p className="mt-4 text-lg text-gray-600">
              Discover our newest selections of premium coffee and equipment
            </p>
          </div>
          <ProductCarousel />
          <div className="text-center mt-8">
            <Link
              to="/shop"
              className="inline-flex items-center text-primary-600 hover:text-primary-700"
            >
              View All Products
              <ChevronRight className="h-5 w-5 ml-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Why Choose Us</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <Coffee className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Premium Beans</h3>
              <p className="text-gray-600">
                Carefully selected beans from the world's finest coffee regions
              </p>
            </div>
            <div className="text-center p-6">
              <Package className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Fresh Roasting</h3>
              <p className="text-gray-600">
                Roasted to order for maximum freshness and flavor
              </p>
            </div>
            <div className="text-center p-6">
              <Truck className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">
                Quick and reliable shipping straight to your door
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* About Us Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="https://images.unsplash.com/photo-1442512595331-e89e73853f31"
                alt="Coffee Shop"
                className="rounded-lg shadow-lg"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-gray-600 mb-6">
                In the year of 2013 Jan 22nd Shri C.Saminathan who has packed 35 years of experience in FMCG Industry laid the foundation for his Coffee Decoccion under the brand name of TANJORE DEGREE COFFEE.
              </p>
              <p className="text-gray-600 mb-6">
                Coffee is plucked, roasted and ground before being drip brewed the authentic way, and has no added preservatives, colour or artificial flavours. Just snip, pour, mix with whole milk, and enjoy the perfect cup of nostalgia, no matter where you are.
              </p>
              <Link
                to="/about"
                className="inline-flex items-center text-primary-600 hover:text-primary-700"
              >
                Learn More About Us
                <ChevronRight className="h-5 w-5 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">What Our Customers Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Coffee Enthusiast",
                image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
                quote: "The best coffee I've ever tasted. Their attention to detail and quality is unmatched."
              },
              {
                name: "Michael Chen",
                role: "Cafe Owner",
                image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
                quote: "As a cafe owner, I trust their beans for my business. Consistent quality and excellent service."
              },
              {
                name: "Emily Rodriguez",
                role: "Home Barista",
                image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
                quote: "Their brewing equipment and coffee beans have transformed my morning routine."
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="ml-4">
                    <h3 className="font-semibold">{testimonial.name}</h3>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 italic">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-6">
            {[
              {
                question: "What makes your coffee special?",
                answer: "Our coffee beans are carefully selected from the finest coffee regions, roasted in small batches to ensure quality, and delivered fresh to your doorstep."
              },
              {
                question: "How do you ensure freshness?",
                answer: "We roast our coffee beans in small batches and ship them within 24 hours of roasting to ensure maximum freshness and flavor."
              },
              {
                question: "Do you offer international shipping?",
                answer: "Yes, we ship to select international locations. Shipping rates and delivery times vary by destination."
              },
              {
                question: "What is your return policy?",
                answer: "We offer a 30-day return policy for unopened products. Please contact our customer service for more details."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Get in Touch</h2>
            <p className="mt-4 text-lg text-gray-600">
              Have questions? We're here to help!
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <MapPin className="h-8 w-8 text-primary-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Visit Us</h3>
              <p className="text-gray-600">
                364,37th street TVS Avenue,<br />
                Anna Nagar West Extn.,<br />
                Chennai-600101
              </p>
            </div>
            <div className="text-center p-6">
              <Phone className="h-8 w-8 text-primary-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Call Us</h3>
              <p className="text-gray-600">(+91) 9003106755</p>
            </div>
            <div className="text-center p-6">
              <Mail className="h-8 w-8 text-primary-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Email Us</h3>
              <p className="text-gray-600">tanjoredegreecoffee@yahoo.in</p>
            </div>
          </div>
          <div className="text-center mt-8">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-md hover:bg-primary-700 transition-colors"
            >
              <MessageCircle className="h-5 w-5" />
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}