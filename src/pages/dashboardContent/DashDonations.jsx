import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/firebase'; // Ensure correct path to your Firebase configuration
import { collection, getDocs } from 'firebase/firestore'; // Import Firestore functions

const DashDonations = () => {
  const [recentDonations, setRecentDonations] = useState([]);
  const [topDonations, setTopDonations] = useState([]);
  const [totalDonations, setTotalDonations] = useState(0);

  useEffect(() => {
    // Fetch donations from Firestore
    const fetchDonations = async () => {
      try {
        // Fetch data from the 'donations' collection
        const donationsSnapshot = await getDocs(collection(db, 'donations'));
        const donationsData = donationsSnapshot.docs.map(doc => doc.data());
    
        // Function to parse Firestore date format
        const parseDate = (dateStr) => {
          if (!dateStr) return new Date(); // Return current date if dateStr is not provided
          // Check if dateStr is a timestamp or a string that needs conversion
          if (dateStr instanceof Date) {
            return dateStr; // If it's already a Date object, return it as is
          }
          // Convert Firestore date string to a Date object
          const parsedDate = new Date(dateStr);
          return isNaN(parsedDate) ? new Date() : parsedDate;
        };
    
        // Parse and format donations data
        const parsedDonations = donationsData.map(donation => ({
          ...donation,
          date: parseDate(donation.date), // Ensure date is parsed correctly
          amount: parseFloat(donation.donationAmount) || 0 // Convert amount to number
        }));
    
        // Sort donations by date and amount
        const sortedDonationsByDate = parsedDonations.sort((a, b) => b.date - a.date);
        const recent = sortedDonationsByDate.slice(0, 5); // Get the most recent 3 donations
    
        const sortedDonationsByAmount = parsedDonations.sort((a, b) => b.amount - a.amount);
        const top = sortedDonationsByAmount.slice(0, 3); // Get the top 3 donations by amount
    
        // Get start and end of the current month
        const now = new Date();
        const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfCurrentMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
        // Filter top donations for this month
        const monthlyDonations = parsedDonations.filter(donation => {
          return donation.date >= startOfCurrentMonth && donation.date <= endOfCurrentMonth;
        });
        const topMonthly = monthlyDonations.sort((a, b) => b.amount - a.amount).slice(0, 3); // Top 3 donations this month
    
        // Calculate total donations
        const total = parsedDonations.reduce((sum, donation) => sum + (donation.amount || 0), 0);
    
        // Set state with fetched data
        setRecentDonations(recent);
        setTopDonations(topMonthly);
        setTotalDonations(total);
      } catch (error) {
        console.error('Error fetching donations:', error);
      }
    };
    

    fetchDonations();
  }, []);

  return (
    <section className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">Donations Overview</h2>

      {/* Total Donations */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2 text-gray-700">Total Donations</h3>
        <p className="text-2xl font-bold text-green-600">${totalDonations.toLocaleString()}</p>
      </div>

      {/* Recent Donations */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2 text-gray-700">Recent Donations</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="py-2 px-4 text-left text-gray-700">Donor</th>
                <th className="py-2 px-4 text-left text-gray-700">Amount</th>
                <th className="py-2 px-4 text-left text-gray-700">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentDonations.map((donation, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="py-2 px-4 text-gray-600">{donation.userName || 'Anonymous'}</td>
                  <td className="py-2 px-4 text-gray-600">${(donation.donationAmount || 0).toLocaleString()}</td>
                  <td className="py-2 px-4 text-gray-600">{new Date(donation.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Donations This Month */}
      <div>
        <h3 className="text-xl font-semibold mb-2 text-gray-700">Top Donations This Month</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="py-2 px-4 text-left text-gray-700">Donor</th>
                <th className="py-2 px-4 text-left text-gray-700">Amount</th>
              </tr>
            </thead>
            <tbody>
              {topDonations.map((donation, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="py-2 px-4 text-gray-600">{donation.userName || 'Anonymous'}</td>
                  <td className="py-2 px-4 text-gray-600">${(donation.donationAmount || 0).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Additional Information */}
      <div className="mt-6 text-center">
        <a
          href="/donations/reports"
          className="inline-block px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
        >
          View Detailed Reports
        </a>
      </div>
    </section>
  );
};

export default DashDonations;









