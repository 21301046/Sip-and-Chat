import React from 'react';

export function About() {
  return (
    <div className="min-h-screen pt-16 bg-gray-50">
      <div
        className="h-64 bg-cover bg-center relative"
        style={{
          backgroundImage: 'url(https://t4.ftcdn.net/jpg/03/26/12/23/360_F_326122335_RKvTXMb4RYkIzk94ZoPjkZQe2CUOVnen.jpg)',
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white">Our Story</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Passion for Perfect Coffee
          </h2>
          <p className="text-gray-600 mb-6">
          In the year of 2013 Jan 22nd Shri C.Saminathan who has packed 35 years of experience in FMCG Industry laid the foundation for his Coffee Decoccion under the brand name of TANJORE DEGREE COFFEE.

          At Tanjore Degree Coffee, we are passionate about bringing you the finest coffee experiences from around the world. Our journey started with a simple goal: to make premium, ethically sourced coffee accessible to everyone.
          </p>


          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            About Our Product
          </h2>
          <p className="text-gray-600 mb-6">
          Coffee is plucked, roasted and ground before being drip brewed the authentic way, and has no added preservatives, colour or artificial flavours. Just snip, pour, mix with whole milk, and enjoy the perfect cup of nostalgia, no matter where you are. Theres nothing like waking up to a freshly brewed cup of traditional filter coffee. The aromas are enough to remind you of home. After all, whats not to love about authentic South Indian filter coffee, With our natural filter coffee decoction, everybody can brew perfection.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Our Mission
          </h2>
          <p className="text-gray-600 mb-6">
            We're committed to bringing you the highest quality coffee while
            supporting sustainable farming practices and fair trade relationships
            with our growers. Every bean we select, every roast we perfect, and
            every product we offer is chosen with one goal in mind: to enhance
            your coffee experience.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Quality Promise
          </h2>
          <p className="text-gray-600">
            We personally visit our coffee farms, carefully select each bean, and
            roast in small batches to ensure the highest quality. Our equipment
            and accessories are thoroughly tested to meet our strict standards,
            because we believe that great coffee deserves great tools.
          </p>
        </div>
      </div>
    </div>
  );
}