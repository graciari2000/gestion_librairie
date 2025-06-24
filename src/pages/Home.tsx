import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Clock, Star } from 'lucide-react';

const Home: React.FC = () => {
  const features = [
    {
      icon: <BookOpen className="h-8 w-8 text-[#06402B]" />,
      title: 'Vast Collection',
      description: 'Access thousands of books across multiple genres and categories'
    },
    {
      icon: <Clock className="h-8 w-8 text-green-600" />,
      title: 'Flexible Rental',
      description: 'Borrow books for as long as you need with affordable daily rates'
    },
    {
      icon: <Users className="h-8 w-8 text-teal-600" />,
      title: 'Community Driven',
      description: 'Join a community of book lovers and discover new favorites'
    },
    {
      icon: <Star className="h-8 w-8 text-teal-600" />,
      title: 'Premium Service',
      description: 'Enjoy a seamless reading experience with our digital library'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-teal-600 bg-clip-text text-transparent">
              Your Digital
            </span>
            <br />
            <span className="text-gray-800">Library Awaits</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Discover, borrow, and enjoy thousands of books with our modern library system. 
            Pay only for what you read, when you read it.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/books"
              className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-4 rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Browse Books
            </Link>
            <Link
              to="/register"
              className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl hover:border-emerald-600 hover:text-[#06402B] transition-all duration-300 font-semibold text-lg"
            >
              Join Today
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">
            Why Choose BookVault?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-8 rounded-2xl">
              <div className="text-4xl font-bold text-[#06402B] mb-2">10,000+</div>
              <div className="text-gray-700 font-medium">Books Available</div>
            </div>
            <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-8 rounded-2xl">
              <div className="text-4xl font-bold text-teal-600 mb-2">5,000+</div>
              <div className="text-gray-700 font-medium">Happy Readers</div>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-8 rounded-2xl">
              <div className="text-4xl font-bold text-[#06402B] mb-2">$0.50</div>
              <div className="text-gray-700 font-medium">Starting Daily Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-emerald-600 to-teal-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Reading?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of readers who have discovered their next favorite book with us.
          </p>
          <Link
            to="/register"
            className="bg-white text-[#06402B] px-8 py-4 rounded-xl hover:bg-gray-100 transition-all duration-300 font-semibold text-lg shadow-lg inline-block transform hover:scale-105"
          >
            Create Your Account
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;