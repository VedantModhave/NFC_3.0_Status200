import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/firebase'; // Adjust path as necessary
import { collection, getDocs } from 'firebase/firestore';
import { Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, LineElement, PointElement, Title } from 'chart.js';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, LineElement, PointElement, Title);

const Overview = () => {
  const [stats, setStats] = useState({
    totalProjects: 0,
    upcomingProjects: 0,
    completedProjects: 0,
    totalVolunteers: 0,
    totalDonations: 0,
  });

  const [projectStats, setProjectStats] = useState([]); // Holds data for each project

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const projectsSnapshot = await getDocs(collection(db, 'projects'));
        let totalProjects = 0;
        let upcomingProjects = 0;
        let completedProjects = 0;
        let totalVolunteers = 0;
        let totalDonations = 0;

        const projectsData = [];

        projectsSnapshot.forEach((doc) => {
          const projectData = doc.data();
          totalProjects += 1;

          // Ensure volunteers and donations are numbers and exist
          const volunteersCount = Number(projectData.volunteers) || 0;
          const donationsAmount = Number(projectData.donations) || 0;

          totalVolunteers += volunteersCount;
          totalDonations += donationsAmount;

          if (projectData.status === 'completed') {
            completedProjects += 1;
          } else {
            upcomingProjects += 1;
          }

          // Collect each project's name and volunteer count
          projectsData.push({
            name: projectData.name || `Project ${totalProjects}`,
            volunteers: volunteersCount,
          });
        });

        setStats({
          totalProjects,
          upcomingProjects,
          completedProjects,
          totalVolunteers,
          totalDonations,
        });

        setProjectStats(projectsData); // Set project data for chart
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  // Data for Line Chart showing trend of Total Volunteers per Project
  const lineChartData = {
    labels: projectStats.map((project) => project.name), // Project names as labels
    datasets: [
      {
        label: 'Total Volunteers per Project',
        data: projectStats.map((project) => project.volunteers), // Volunteers data
        fill: false,
        borderColor: '#4A90E2',
        backgroundColor: '#4A90E2',
        tension: 0.2,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  // Options for Line Chart
  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          autoSkip: true,
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: '#f3f3f3',
        },
        title: {
          display: true,
          text: 'Number of Volunteers',
        },
      },
    },
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.raw}`,
        },
      },
    },
  };

  // Data for Pie Chart
  const pieChartData = {
    labels: ['Upcoming Projects', 'Completed Projects'],
    datasets: [
      {
        label: 'Project Status',
        data: [stats.upcomingProjects, stats.completedProjects],
        backgroundColor: ['#50E3C2', '#F5A623'],
        borderColor: ['#3CAC9F', '#D8941C'],
        borderWidth: 1,
      },
    ],
  };

  // Options for Pie Chart
  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 20,
          padding: 15,
        },
      },
    },
  };

  return (
    <div className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {[
          { title: 'Total Projects', value: stats.totalProjects },
          { title: 'Upcoming Projects', value: stats.upcomingProjects },
          { title: 'Completed Projects', value: stats.completedProjects },
          { title: 'Total Volunteers', value: stats.totalVolunteers },
          { title: 'Total Donations', value: `$${stats.totalDonations}` },
        ].map((card, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-xl transform transition duration-500 hover:scale-105 hover:shadow-2xl"
          >
            <h3 className="text-2xl font-semibold text-gray-800">{card.title}</h3>
            <p className="text-4xl font-bold text-indigo-600 mt-2">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}

      {/* Charts Section */}
      <div className="mt-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Visual Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card for Line Chart */}
          <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col justify-between">
            <h3 className="text-xl font-semibold mb-4 text-center text-gray-800">Volunteers Trend by Project</h3>
            <div className="flex-grow">
              <Line
                data={lineChartData}
                options={lineChartOptions}
                className="h-full w-full" // Ensure chart fills the card
              />
            </div>
          </div>

          {/* Card for Pie Chart */}
          <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col justify-between">
            <h3 className="text-xl font-semibold mb-4 text-center text-gray-800">Project Status Distribution</h3>
            <div className="flex-grow">
              <Pie
                data={pieChartData}
                options={pieChartOptions}
                className="h-full w-full" // Ensure chart fills the card
              />
            </div>
          </div>
        </div>
      </div>



      {/* <div className="mt-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Visual Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-xl h-[400px]">
            <h3 className="text-xl font-semibold mb-4 text-center text-gray-800">Volunteers Trend by Project</h3>
            <Line data={lineChartData} options={lineChartOptions} />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-xl h-[400px]">
            <h3 className="text-xl font-semibold mb-4 text-center text-gray-800">Project Status Distribution</h3>
            <Pie data={pieChartData} options={pieChartOptions} />
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default Overview;
























// import React, { useEffect, useState } from 'react';
// import { db } from '../../firebase/firebase'; // Adjust path as necessary
// import { collection, getDocs } from 'firebase/firestore';
// import { Line, Pie } from 'react-chartjs-2';
// import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, LineElement, PointElement, Title } from 'chart.js';

// // Register Chart.js components
// ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, LineElement, PointElement, Title);

// const Overview = () => {
//   const [stats, setStats] = useState({
//     totalProjects: 0,
//     upcomingProjects: 0,
//     completedProjects: 0,
//     totalVolunteers: 0,
//     totalDonations: 0,
//   });

//   const [projectStats, setProjectStats] = useState([]); // Holds data for each project

//   useEffect(() => {
//     const fetchStats = async () => {
//       try {
//         const projectsSnapshot = await getDocs(collection(db, 'projects'));
//         let totalProjects = 0;
//         let upcomingProjects = 0;
//         let completedProjects = 0;
//         let totalVolunteers = 0;
//         let totalDonations = 0;

//         const projectsData = [];

//         projectsSnapshot.forEach((doc) => {
//           const projectData = doc.data();
//           totalProjects += 1;

//           // Ensure volunteers and donations are numbers and exist
//           const volunteersCount = Number(projectData.volunteers) || 0;
//           const donationsAmount = Number(projectData.donations) || 0;

//           totalVolunteers += volunteersCount;
//           totalDonations += donationsAmount;

//           if (projectData.status === 'completed') {
//             completedProjects += 1;
//           } else {
//             upcomingProjects += 1;
//           }

//           // Collect each project's name and volunteer count
//           projectsData.push({
//             name: projectData.name || `Project ${totalProjects}`,
//             volunteers: volunteersCount,
//           });
//         });

//         setStats({
//           totalProjects,
//           upcomingProjects,
//           completedProjects,
//           totalVolunteers,
//           totalDonations,
//         });

//         setProjectStats(projectsData); // Set project data for chart
//       } catch (error) {
//         console.error('Error fetching stats:', error);
//       }
//     };

//     fetchStats();
//   }, []);

//   // Data for Line Chart showing trend of Total Volunteers per Project
//   const lineChartData = {
//     labels: projectStats.map((project) => project.name), // Project names as labels
//     datasets: [
//       {
//         label: 'Total Volunteers per Project',
//         data: projectStats.map((project) => project.volunteers), // Volunteers data
//         fill: false,
//         borderColor: '#4A90E2',
//         backgroundColor: '#4A90E2',
//         tension: 0.2,
//         pointRadius: 5,
//         pointHoverRadius: 7,
//       },
//     ],
//   };

//   // Options for Line Chart
//   const lineChartOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     scales: {
//       x: {
//         grid: {
//           display: false,
//         },
//         ticks: {
//           autoSkip: true,
//           maxRotation: 45,
//           minRotation: 45,
//         },
//       },
//       y: {
//         beginAtZero: true,
//         grid: {
//           color: '#f3f3f3',
//         },
//         title: {
//           display: true,
//           text: 'Number of Volunteers',
//         },
//       },
//     },
//     plugins: {
//       legend: {
//         position: 'top',
//       },
//       tooltip: {
//         callbacks: {
//           label: (context) => `${context.dataset.label}: ${context.raw}`,
//         },
//       },
//     },
//   };

//   // Data for Pie Chart
//   const pieChartData = {
//     labels: ['Upcoming Projects', 'Completed Projects'],
//     datasets: [
//       {
//         label: 'Project Status',
//         data: [stats.upcomingProjects, stats.completedProjects],
//         backgroundColor: ['#50E3C2', '#F5A623'],
//         borderColor: ['#3CAC9F', '#D8941C'],
//         borderWidth: 1,
//       },
//     ],
//   };

//   // Options for Pie Chart
//   const pieChartOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         position: 'bottom',
//         labels: {
//           boxWidth: 20,
//           padding: 15,
//         },
//       },
//     },
//   };

//   return (
//     <div className="p-6">
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         <div className="bg-white p-6 rounded-lg shadow-lg">
//           <h3 className="text-2xl font-semibold">Total Projects</h3>
//           <p className="text-4xl font-bold">{stats.totalProjects}</p>
//         </div>
//         <div className="bg-white p-6 rounded-lg shadow-lg">
//           <h3 className="text-2xl font-semibold">Upcoming Projects</h3>
//           <p className="text-4xl font-bold">{stats.upcomingProjects}</p>
//         </div>
//         <div className="bg-white p-6 rounded-lg shadow-lg">
//           <h3 className="text-2xl font-semibold">Completed Projects</h3>
//           <p className="text-4xl font-bold">{stats.completedProjects}</p>
//         </div>
//         <div className="bg-white p-6 rounded-lg shadow-lg">
//           <h3 className="text-2xl font-semibold">Total Volunteers</h3>
//           <p className="text-4xl font-bold">{stats.totalVolunteers}</p>
//         </div>
//         <div className="bg-white p-6 rounded-lg shadow-lg">
//           <h3 className="text-2xl font-semibold">Total Donations</h3>
//           <p className="text-4xl font-bold">${stats.totalDonations}</p>
//         </div>
//       </div>

//       {/* Charts Section */}
//       <div className="mt-12">
//         <h2 className="text-3xl font-semibold mb-6">Visual Overview</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="bg-white p-6 rounded-lg shadow-lg h-[400px]">
//             <h3 className="text-xl font-semibold mb-4">Volunteers Trend by Project</h3>
//             <Line data={lineChartData} options={lineChartOptions} />
//           </div>
//           <div className="bg-white p-6 rounded-lg shadow-lg h-[400px]">
//             <h3 className="text-xl font-semibold mb-4">Project Status Distribution</h3>
//             <Pie data={pieChartData} options={pieChartOptions} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Overview;











// import React, { useEffect, useState } from 'react';
// import { db } from '../../firebase/firebase'; // Adjust path as necessary
// import { collection, getDocs } from 'firebase/firestore';

// const Overview = () => {
//   const [stats, setStats] = useState({
//     totalProjects: 0,
//     upcomingProjects: 0,
//     completedProjects: 0,
//     totalVolunteers: 0,
//     totalDonations: 0,
//   });

//   useEffect(() => {
//     const fetchStats = async () => {
//       try {
//         const projectsSnapshot = await getDocs(collection(db, 'projects'));
//         let totalProjects = 0;
//         let upcomingProjects = 0;
//         let completedProjects = 0;
//         let totalVolunteers = 0;
//         let totalDonations = 0;

//         projectsSnapshot.forEach((doc) => {
//           const projectData = doc.data();
//           totalProjects += 1;

//           // Ensure volunteers and donations are numbers and exist
//           const volunteersCount = Number(projectData.volunteers) || 0;
//           const donationsAmount = Number(projectData.donations) || 0;

//           totalVolunteers += volunteersCount;
//           totalDonations += donationsAmount;

//           if (projectData.status === 'completed') {
//             completedProjects += 1;
//           } else {
//             upcomingProjects += 1;
//           }

//           // Debugging Logs
//           console.log(`Project ID: ${doc.id}, Volunteers: ${volunteersCount}, Donations: ${donationsAmount}`);
//         });

//         setStats({
//           totalProjects,
//           upcomingProjects,
//           completedProjects,
//           totalVolunteers,
//           totalDonations,
//         });

//         // Additional Debugging
//         console.log('Final Stats:', {
//           totalProjects,
//           upcomingProjects,
//           completedProjects,
//           totalVolunteers,
//           totalDonations,
//         });
//       } catch (error) {
//         console.error('Error fetching stats:', error);
//       }
//     };

//     fetchStats();
//   }, []);

//   return (
//     <div className="p-6">
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         <div className="bg-white p-6 rounded-lg shadow-lg">
//           <h3 className="text-2xl font-semibold">Total Projects</h3>
//           <p className="text-4xl font-bold">{stats.totalProjects}</p>
//         </div>
//         <div className="bg-white p-6 rounded-lg shadow-lg">
//           <h3 className="text-2xl font-semibold">Upcoming Projects</h3>
//           <p className="text-4xl font-bold">{stats.upcomingProjects}</p>
//         </div>
//         <div className="bg-white p-6 rounded-lg shadow-lg">
//           <h3 className="text-2xl font-semibold">Completed Projects</h3>
//           <p className="text-4xl font-bold">{stats.completedProjects}</p>
//         </div>
//         <div className="bg-white p-6 rounded-lg shadow-lg">
//           <h3 className="text-2xl font-semibold">Total Volunteers</h3>
//           <p className="text-4xl font-bold">{stats.totalVolunteers}</p>
//         </div>
//         <div className="bg-white p-6 rounded-lg shadow-lg">
//           <h3 className="text-2xl font-semibold">Total Donations</h3>
//           <p className="text-4xl font-bold">${stats.totalDonations}</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Overview;











