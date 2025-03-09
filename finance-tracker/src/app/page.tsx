'use client';

import { useTheme } from '../context/ThemeContext';
import { useCurrency } from '../context/CurrencyContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const { currency, symbol, setCurrency } = useCurrency();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar transactions={[]} searchQuery="" setSearchQuery={() => {}} />

      {/* Hero Section with Background Image */}
      <section
        className="relative bg-cover bg-center h-[600px] sm:h-[400px] flex items-center justify-center text-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1554224155-8d04cb21a1c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80')`,
          backgroundColor: theme === 'dark' ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)',
          backgroundBlendMode: 'overlay',
        }}
      >
        <div className="hero-overlay"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 animate-fade-in text-white drop-shadow-lg">
            Welcome to Finance Tracker
          </h1>
          <p className="text-base sm:text-lg md:text-xl mb-8 max-w-2xl mx-auto text-white drop-shadow-md">
            Take control of your finances with our cutting-edge, enterprise-grade tracking tool. Designed by top MNC web developers, Finance Tracker offers seamless monitoring of income, expenses, and savings with powerful insights.
          </p>
          <div className="space-x-4 flex flex-col sm:flex-row justify-center">
            <button
              onClick={() => (window.location.href = '/transactions')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-full shadow-lg transition duration-300 mb-2 sm:mb-0 w-full sm:w-auto"
            >
              Get Started
            </button>
            <button
              onClick={() => (window.location.href = '/reports/summary')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-full shadow-lg transition duration-300 w-full sm:w-auto"
            >
              View Summary
            </button>
          </div>
        </div>
      </section>

      {/* Features Section with Larger Icons */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10 text-gray-900 dark:text-gray-100">Why Choose Finance Tracker?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-2 text-center">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3003/3003039.png"
              alt="Real-Time Tracking"
              className="w-16 h-16 mx-auto mb-6"
            />
            <h3 className="text-xl sm:text-2xl font-semibold mb-3 text-gray-900 dark:text-gray-100">Real-Time Tracking</h3>
            <p className="text-gray-600 dark:text-gray-400 text-center">
              Monitor your income and expenses with real-time updates, powered by robust backend technology.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-2 text-center">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3161/3161358.png"
              alt="Advanced Analytics"
              className="w-16 h-16 mx-auto mb-6"
            />
            <h3 className="text-xl sm:text-2xl font-semibold mb-3 text-gray-900 dark:text-gray-100">Advanced Analytics</h3>
            <p className="text-gray-600 dark:text-gray-400 text-center">
              Gain deep insights with detailed reports and interactive charts, crafted by MNC experts.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-2 text-center">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3062/3062634.png"
              alt="Secure & Scalable"
              className="w-16 h-16 mx-auto mb-6"
            />
            <h3 className="text-xl sm:text-2xl font-semibold mb-3 text-gray-900 dark:text-gray-100">Secure & Scalable</h3>
            <p className="text-gray-600 dark:text-gray-400 text-center">
              Built with enterprise-level security and scalability, trusted by finance professionals worldwide.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section with Avatars */}
      <section className="bg-gray-100 dark:bg-gray-900 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-10 text-gray-900 dark:text-gray-100">What Our Users Say</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
              <img
                src="https://randomuser.me/api/portraits/men/32.jpg"
                alt="User Avatar"
                className="w-16 h-16 rounded-full mx-auto mb-4"
              />
              <p className="text-gray-600 dark:text-gray-400 italic mb-4">
                "Finance Tracker transformed how I manage my finances. The real-time updates are a game-changer!"
              </p>
              <p className="font-semibold text-gray-900 dark:text-gray-100">- John Doe, CFO at TechCorp</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
              <img
                src="https://randomuser.me/api/portraits/women/44.jpg"
                alt="User Avatar"
                className="w-16 h-16 rounded-full mx-auto mb-4"
              />
              <p className="text-gray-600 dark:text-gray-400 italic mb-4">
                "The analytics are top-notch, and the design feels like it’s from a top MNC. Highly recommend!"
              </p>
              <p className="font-semibold text-gray-900 dark:text-gray-100">- Jane Smith, Freelancer</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
              <img
                src="https://randomuser.me/api/portraits/men/65.jpg"
                alt="User Avatar"
                className="w-16 h-16 rounded-full mx-auto mb-4"
              />
              <p className="text-gray-600 dark:text-gray-400 italic mb-4">
                "A must-have tool for anyone serious about financial planning. It’s intuitive and powerful!"
              </p>
              <p className="font-semibold text-gray-900 dark:text-gray-100">- Alex Brown, Entrepreneur</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-gray-900 dark:text-gray-100">Ready to Take Control?</h2>
        <p className="mb-8 max-w-2xl mx-auto text-base sm:text-lg text-gray-700 dark:text-gray-300">
          Start managing your finances today with Finance Tracker. Explore your transactions, generate reports, and visualize your progress with ease.
        </p>
        <div className="space-x-4 flex flex-col sm:flex-row justify-center">
          <button
            onClick={() => (window.location.href = '/transactions')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-full shadow-lg transition duration-300 mb-2 sm:mb-0 w-full sm:w-auto"
          >
            Get Started
          </button>
          <button
            onClick={() => (window.location.href = '/reports/summary')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-full shadow-lg transition duration-300 w-full sm:w-auto"
          >
            View Reports
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}