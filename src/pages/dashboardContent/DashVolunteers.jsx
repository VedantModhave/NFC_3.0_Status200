import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/firebase'; // Ensure correct path to your Firebase configuration
import { collection, getDocs } from 'firebase/firestore'; // Import Firestore functions

const DashVolunteers = () => {
  const [recentVolunteers, setRecentVolunteers] = useState([]);
  const [topVolunteers, setTopVolunteers] = useState([]);
  const [projectsMap, setProjectsMap] = useState({});

  useEffect(() => {
    // Fetch volunteers and project data simultaneously
    const fetchData = async () => {
      try {
        // Fetch volunteers data
        const volunteersSnapshot = await getDocs(collection(db, 'volunteers'));
        const volunteersData = volunteersSnapshot.docs.map(doc => doc.data());

        // Fetch project data
        const projectsSnapshot = await getDocs(collection(db, 'projects'));
        const projectsData = projectsSnapshot.docs.map(doc => doc.data());
        const newProjectsMap = projectsData.reduce((acc, project) => {
          acc[project.id] = project.name;
          return acc;
        }, {});

        // Set projectsMap state
        setProjectsMap(newProjectsMap);

        // Parse and format dates
        const parseDate = (dateStr) => {
          if (typeof dateStr !== 'string') {
            // Handle cases where dateStr is not a string
            console.error('Expected dateStr to be a string, but got:', dateStr);
            return new Date(); // Return current date if invalid
          }

          // Handle Firestore date format and remove timezone part
          const cleanedDateStr = dateStr.replace(' UTC+5:30', '');
          const parsedDate = new Date(cleanedDateStr);

          return isNaN(parsedDate) ? new Date() : parsedDate;
        };

        // Convert registeredAt to proper Date object and sort
        volunteersData.forEach(volunteer => {
          volunteer.registeredAt = parseDate(volunteer.registeredAt);
        });

        // Sort volunteers data by date
        const sortedVolunteersByDate = volunteersData.sort((a, b) => b.registeredAt - a.registeredAt);
        const recent = sortedVolunteersByDate.slice(0, 5); // Get the most recent 5 volunteers

        // Sort volunteers data by hours
        const sortedVolunteersByHours = volunteersData.sort((a, b) => b.hours - a.hours);
        const top = sortedVolunteersByHours.slice(0, 3); // Get the top 3 volunteers by hours

        // Set state with fetched data
        setRecentVolunteers(recent);
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

  // Utility function to format project data
  const formatProjectData = (projectId, projectsMap) => {
    return projectsMap[projectId] || 'Unknown Project';
  };

  return (
    <section className="bg-white p-6 rounded-lg shadow-lg min-h-screen pb-16">
      <h2 className="text-2xl font-semibold mb-4">Volunteer Overview</h2>

      {/* Recent Volunteers */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Recent Volunteers</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="py-2 px-4 text-left">Name</th>
                <th className="py-2 px-4 text-left">Project</th>
                <th className="py-2 px-4 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentVolunteers.length > 0 ? (
                recentVolunteers.map((volunteer, index) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="py-2 px-4">{volunteer.name || 'N/A'}</td>
                    <td className="py-2 px-4">
                      {formatProjectData(volunteer.projectId, projectsMap)}
                    </td>
                    <td className="py-2 px-4">{formatDate(volunteer.registeredAt)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="py-2 px-4 text-center">No data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default DashVolunteers;





// import React, { useState, useEffect } from 'react';
// import { db } from '../../firebase/firebase'; // Ensure correct path to your Firebase configuration
// import { collection, getDocs } from 'firebase/firestore'; // Import Firestore functions

// const DashVolunteers = () => {
//   const [recentVolunteers, setRecentVolunteers] = useState([]);
//   const [topVolunteers, setTopVolunteers] = useState([]);

//   useEffect(() => {
//     // Fetch volunteers data from Firestore
//     const fetchData = async () => {
//       try {
//         // Fetch volunteers data
//         const volunteersSnapshot = await getDocs(collection(db, 'volunteers'));
//         const volunteersData = volunteersSnapshot.docs.map(doc => doc.data());

//         // Log the fetched data to debug
//         console.log('Fetched volunteers data:', volunteersData);

//         // Parse and format dates
//         const parseDate = (dateStr) => {
//           if (typeof dateStr !== 'string') {
//             // Handle cases where dateStr is not a string
//             console.error('Expected dateStr to be a string, but got:', dateStr);
//             return new Date(); // Return current date if invalid
//           }

//           // Handle Firestore date format and remove timezone part
//           const cleanedDateStr = dateStr.replace(' UTC+5:30', '');
//           const parsedDate = new Date(cleanedDateStr);

//           return isNaN(parsedDate) ? new Date() : parsedDate;
//         };

//         // Convert registeredAt to proper Date object and sort
//         volunteersData.forEach(volunteer => {
//           volunteer.registeredAt = parseDate(volunteer.registeredAt);
//         });

//         // Sort volunteers data
//         const sortedVolunteersByDate = volunteersData.sort((a, b) => b.registeredAt - a.registeredAt);
//         const recent = sortedVolunteersByDate.slice(0, 5); // Get the most recent 3 volunteers

//         const sortedVolunteersByHours = volunteersData.sort((a, b) => b.hours - a.hours);
//         const top = sortedVolunteersByHours.slice(0, 3); // Get the top 3 volunteers by hours

//         // Set state with fetched data
//         setRecentVolunteers(recent);
//         setTopVolunteers(top);
//       } catch (error) {
//         console.error('Error fetching volunteers:', error);
//       }
//     };

//     fetchData();
//   }, []);

//   // Utility function to format date
//   const formatDate = (date) => {
//     if (!(date instanceof Date)) return 'Invalid Date';
//     const options = { year: 'numeric', month: 'long', day: 'numeric' };
//     return date.toLocaleDateString(undefined, options);
//   };

//   return (
//     <section className="bg-white p-6 rounded-lg shadow-lg min-h-screen pb-16">
//       <h2 className="text-2xl font-semibold mb-4">Volunteer Overview</h2>

//       {/* Recent Volunteers */}
//       <div className="mb-6">
//         <h3 className="text-xl font-semibold mb-2">Recent Volunteers</h3>
//         <div className="overflow-x-auto">
//           <table className="min-w-full bg-white border border-gray-200 rounded-lg">
//             <thead className="bg-gray-100 border-b border-gray-200">
//               <tr>
//                 <th className="py-2 px-4 text-left">Name</th>
//                 <th className="py-2 px-4 text-left">Project</th>
//                 <th className="py-2 px-4 text-left">Date</th>
//               </tr>
//             </thead>
//             <tbody>
//               {recentVolunteers.length > 0 ? (
//                 recentVolunteers.map((volunteer, index) => (
//                   <tr key={index} className="border-b border-gray-200">
//                     <td className="py-2 px-4">{volunteer.name || 'N/A'}</td>
//                     <td className="py-2 px-4">{volunteer.projectId || 'Unknown Project'}</td>
//                     <td className="py-2 px-4">{formatDate(volunteer.registeredAt)}</td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="3" className="py-2 px-4 text-center">No data available</td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

      
//     </section>
//   );
// };

// export default DashVolunteers;







