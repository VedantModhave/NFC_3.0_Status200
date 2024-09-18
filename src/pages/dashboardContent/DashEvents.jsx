import React from 'react';

const DashEvents = () => {
  // Sample data
  const upcomingEvents = [
    { title: 'Charity Run', date: '2024-09-15', location: 'Central Park' },
    { title: 'Food Drive', date: '2024-09-20', location: 'Community Center' },
    { title: 'Health Camp', date: '2024-09-25', location: 'Downtown Clinic' },
  ];

  const recentEvents = [
    { title: 'Blood Donation Camp', date: '2024-08-10', location: 'City Hospital' },
    { title: 'Tree Plantation', date: '2024-08-05', location: 'Green Valley' },
    { title: 'Fundraising Dinner', date: '2024-07-30', location: 'Grand Hotel' },
  ];

  const importantInfo = [
    'Remember to send out invites for the Charity Run.',
    'Confirm volunteers for the upcoming Food Drive.',
    'Coordinate with the local health department for the Health Camp.',
  ];

  return (
    <section className="bg-white p-6 rounded-lg shadow-lg min-h-screen pb-16">
      <h2 className="text-2xl font-semibold mb-4">Events Overview</h2>

      {/* Upcoming Events */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Upcoming Events</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="py-2 px-4 text-left">Title</th>
                <th className="py-2 px-4 text-left">Date</th>
                <th className="py-2 px-4 text-left">Location</th>
              </tr>
            </thead>
            <tbody>
              {upcomingEvents.map((event, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="py-2 px-4">{event.title}</td>
                  <td className="py-2 px-4">{event.date}</td>
                  <td className="py-2 px-4">{event.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Events */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Recent Events</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="py-2 px-4 text-left">Title</th>
                <th className="py-2 px-4 text-left">Date</th>
                <th className="py-2 px-4 text-left">Location</th>
              </tr>
            </thead>
            <tbody>
              {recentEvents.map((event, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="py-2 px-4">{event.title}</td>
                  <td className="py-2 px-4">{event.date}</td>
                  <td className="py-2 px-4">{event.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Important Information */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Important Information</h3>
        <ul className="list-disc list-inside space-y-2">
          {importantInfo.map((info, index) => (
            <li key={index} className="text-gray-700">{info}</li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default DashEvents;
