import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import heroVideo from '../assets/video1.mp4'; // Importing the video file
import { db } from '../firebase/firebase'; // Import your Firebase configuration
import { collection, getDocs } from 'firebase/firestore';

const Home = () => {
  const [topVolunteers, setTopVolunteers] = useState([]);

  useEffect(() => {
    // Fetch volunteers data from Firestore
    const fetchData = async () => {
      try {
        const volunteersSnapshot = await getDocs(collection(db, 'volunteers'));
        const volunteersData = volunteersSnapshot.docs.map((doc) => doc.data());

        // Sort volunteers by hours and get top 3
        const sortedVolunteersByHours = volunteersData.sort((a, b) => b.hours - a.hours);
        const top = sortedVolunteersByHours.slice(0, 3);

        setTopVolunteers(top);
      } catch (error) {
        console.error('Error fetching volunteers:', error);
      }
    };

    fetchData();
  }, []);

  // Utility function to format date
  const formatDate = (date) => {
    if (!(date instanceof Date)) return 'Invalid Date';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

  // Background colors for different ranks
  const rankColors = ['bg-yellow-300', 'bg-gray-300', 'bg-orange-300']; // gold, silver, bronze

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <header className="h-screen flex flex-col justify-center items-center text-center relative overflow-hidden">
        {/* Background Video */}
        <video
          className="absolute inset-0 w-full h-full object-cover z-0"
          src={heroVideo}
          autoPlay
          loop
          muted
        />

        {/* Background Overlay */}
        <div className="absolute inset-0 bg-blue-900 opacity-55 z-10"></div>

        {/* Content */}
        <div className="relative z-20 max-w-4xl px-4 sm:px-6 md:px-8 lg:px-12 py-12 text-white">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Empowering NGOs to Achieve Greater Impact Together
          </h1>
          <p className="text-base sm:text-lg md:text-xl mb-8">
            Your all-in-one platform for managing NGO operations, enhancing collaboration, and driving impactful change across communities.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link
              to="/projects"
              className="bg-cyan-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-cyan-700 transition"
            >
              Make a Donation
            </Link>
            <Link
              to="/projects"
              className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition"
            >
              Volunteer for a Cause
            </Link>
          </div>
        </div>
      </header>

      {/* Introduction Section */}
      <section className="py-16 px-4 bg-blue-100 text-center">
        <h2 className="text-3xl font-bold mb-4 text-sky-800">About Us</h2>
        <p className="text-lg mb-8 max-w-2xl mx-auto text-gray-700">
          We are dedicated to supporting NGOs by providing a comprehensive platform that simplifies management tasks, enhances transparency, and maximizes impact. Our mission is to empower organizations to focus more on their core activities and less on administrative challenges.
        </p>
      </section>

      {/* Top Volunteers Section */}
      <section className="py-16 px-4 bg-white">
        <h2 className="text-3xl font-bold text-center mb-8 text-sky-800">Top Volunteers</h2>
        <div className="flex flex-col items-center">
          {/* Rank 1 Volunteer */}
          {topVolunteers[0] && (
            <div
              className={`${rankColors[0]} p-6 rounded-lg shadow-lg max-w-xs w-full text-center mb-6 border border-gray-200 transform transition hover:scale-105`}
            >
              <h3 className="text-xl font-semibold mb-2 text-sky-800">#1 {topVolunteers[0].name || 'N/A'}</h3>
              <p className="text-gray-600">Hours Contributed: {topVolunteers[0].hours || 0}</p>
              <p className="text-gray-600">Project: {topVolunteers[0].projectId || 'Unknown Project'}</p>
              <p className="text-gray-600">Registered At: {formatDate(topVolunteers[0].registeredAt)}</p>
            </div>
          )}

          {/* Rank 2 and 3 Volunteers */}
          <div className="flex space-x-8">
            {topVolunteers[1] && (
              <div
                className={`${rankColors[1]} p-6 rounded-lg shadow-lg max-w-xs w-full text-center border border-gray-200 transform transition hover:scale-105`}
              >
                <h3 className="text-xl font-semibold mb-2 text-sky-800">#2 {topVolunteers[1].name || 'N/A'}</h3>
                <p className="text-gray-600">Hours Contributed: {topVolunteers[1].hours || 0}</p>
                <p className="text-gray-600">Project: {topVolunteers[1].projectId || 'Unknown Project'}</p>
                <p className="text-gray-600">Registered At: {formatDate(topVolunteers[1].registeredAt)}</p>
              </div>
            )}
            {topVolunteers[2] && (
              <div
                className={`${rankColors[2]} p-6 rounded-lg shadow-lg max-w-xs w-full text-center border border-gray-200 transform transition hover:scale-105`}
              >
                <h3 className="text-xl font-semibold mb-2 text-sky-800">#3 {topVolunteers[2].name || 'N/A'}</h3>
                <p className="text-gray-600">Hours Contributed: {topVolunteers[2].hours || 0}</p>
                <p className="text-gray-600">Project: {topVolunteers[2].projectId || 'Unknown Project'}</p>
                <p className="text-gray-600">Registered At: {formatDate(topVolunteers[2].registeredAt)}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-16 px-4 bg-blue-100 text-center">
        <h2 className="text-3xl font-bold mb-8 text-sky-800">Upcoming Events</h2>
        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 transform transition hover:scale-105">
            <h3 className="text-xl font-semibold mb-2 text-sky-800">Project Eka</h3>
            <p className="text-gray-600">Date: 20 September, 2024</p>
            <p className="text-gray-600 mt-2">Join us as volunteers and learn more about our initiatives. This event will focus on community outreach and support in the form of donations for the poor.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 transform transition hover:scale-105">
            <h3 className="text-xl font-semibold mb-2 text-sky-800">Annamrita Foundation Drive</h3>
            <p className="text-gray-600">Date: 1 February, 2025</p>
            <p className="text-gray-600 mt-2">Participate as a volunteer in our food donation drive. We will be serving food donated and made using donated money to the poor. You can take part as a cook or a server.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 transform transition hover:scale-105">
            <h3 className="text-xl font-semibold mb-2 text-sky-800">Hello Zindagi Health Camp</h3>
            <p className="text-gray-600">Date: 21 October, 2024</p>
            <p className="text-gray-600 mt-2">We are organizing a health camp in Bhopal in October. We request all nurses and doctors to volunteer. Even non-medical background people would be welcome to help us organize this camp.</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 bg-white">
        <h2 className="text-3xl font-bold text-center mb-8 text-sky-800">What Our Partners Say</h2>
        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-gray-100 p-6 rounded-lg shadow-lg text-center border border-gray-200 transform transition hover:scale-105">
            <p className="text-gray-600 mb-4">"NGOHub has revolutionized how we manage our daily operations. The platform is intuitive and has significantly increased our efficiency."</p>
            <p className="font-semibold text-sky-800">John Doe</p>
            <p className="text-gray-500">CEO, Helping Hands Foundation</p>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg shadow-lg text-center border border-gray-200 transform transition hover:scale-105">
            <p className="text-gray-600 mb-4">"Thanks to NGOHub, we've been able to reach more people in need and track our progress in real-time."</p>
            <p className="font-semibold text-sky-800">Jane Smith</p>
            <p className="text-gray-500">Program Director, Community Aid Network</p>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg shadow-lg text-center border border-gray-200 transform transition hover:scale-105">
            <p className="text-gray-600 mb-4">"The features provided by NGOHub have allowed us to better manage our resources and volunteers. We couldn't be happier with the platform."</p>
            <p className="font-semibold text-sky-800">Emily Johnson</p>
            <p className="text-gray-500">Operations Manager, Aid for All</p>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 px-4 bg-blue-100 text-center">
        <h2 className="text-3xl font-bold mb-4 text-sky-800">Get Involved</h2>
        <p className="text-lg mb-8 text-gray-700">
          Whether you want to volunteer, donate, or spread the word, there are many ways to support our mission. Join us in making a difference.
        </p>
        <Link
          to="/signup"
          className="bg-cyan-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-cyan-700 transition"
        >
          Sign Up Now
        </Link>
      </section>
    </div>
  );
};

export default Home;
