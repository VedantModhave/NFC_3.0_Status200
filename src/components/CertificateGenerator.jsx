import React from 'react';
import { useLocation } from 'react-router-dom';
import jsPDF from 'jspdf';
import img from '../assets/certificate-background.jpg'; // Ensure this path is correct

const CertificateGenerator = () => {
  const location = useLocation();
  const { state } = location;

  // Destructure the passed data
  const { name, amount, projectName } = state || {};

  // Function to handle certificate generation and download
  const handleDownload = () => {
    const doc = new jsPDF();

    // Add background image
    doc.addImage(img, 'JPG', 0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight());

    // Add donor's name
    doc.setFontSize(36);
    doc.setFont('Arial', 'normal');
    doc.text(name, 105, 160, { align: 'center' }); // Donor's name

    // Add amount with rupee symbol and project name using Unicode for rupee symbol
    doc.setFontSize(20);
    doc.setFont('Arial', 'normal');
    doc.text(`For donating Rs.${amount} to the project`, 105, 180, { align: 'center' });
    doc.text(projectName, 105, 200, { align: 'center' }); // Project name

    // Save the PDF
    doc.save(`${name}-${projectName}-Certificate.pdf`);
  };

  return (
    <div className="container mx-auto p-6 flex flex-col items-center bg-gradient-to-br from-blue-300 to-blue-600 min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">Donation Certificate</h1>
        {name && amount && projectName ? (
          <div className="text-center">
            <div className="bg-blue-100 p-4 rounded-lg shadow-md mb-6">
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">Certificate Details</h2>
              <p className="text-lg text-gray-800 mb-2"><strong>Name:</strong> {name}</p>
              <p className="text-lg text-gray-800 mb-2"><strong>Donation Amount:</strong> Rs.{amount}</p>
              <p className="text-lg text-gray-800 mb-4"><strong>Project:</strong> {projectName}</p>
            </div>
            <button
              onClick={handleDownload}
              className="bg-green-500 text-white rounded-lg py-3 px-6 text-lg font-semibold hover:bg-green-600 transition duration-300"
            >
              Download Certificate
            </button>
          </div>
        ) : (
          <p className="text-lg text-gray-600">No donation details available.</p>
        )}
      </div>
    </div>
  );
};

export default CertificateGenerator;














// import React from 'react';
// import { useLocation } from 'react-router-dom';
// import jsPDF from 'jspdf';
// import img from '../assets/certificate-background.jpg'; // Make sure to use the correct path for the image

// const CertificateGenerator = () => {
//   const location = useLocation();
//   const { state } = location;

//   // Destructure the passed data
//   const { name, amount, projectName } = state || {};

//   // Function to handle certificate generation and download
//   const handleDownload = () => {
//     const doc = new jsPDF();

//     // Add background image
//     doc.addImage(img, 'JPG', 0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight());

//     // Add donor's name
//     doc.setFontSize(36);
//     doc.setFont('Arial', 'normal');
//     doc.text(name, 105, 160, { align: 'center' }); // Donor's name

//     // Add amount with rupee symbol and project name using Unicode for rupee symbol
//     doc.setFontSize(20);
//     doc.setFont('Arial', 'normal');
//     doc.text(`For donating Rs.${amount} to the project`, 105, 180, { align: 'center' });
//     doc.text(projectName, 105, 200, { align: 'center' }); // Project name

//     // Save the PDF
//     doc.save(`${name}-${projectName}-Certificate.pdf`);
//   };

//   return (
//     <div className="container mx-auto p-6 flex flex-col items-center">
//       <h1 className="text-3xl font-bold mb-4">Donation Certificate</h1>
//       {name && amount && projectName ? (
//         <div className="bg-white p-6 rounded-lg shadow-lg">
//           <h2 className="text-2xl font-semibold mb-4">Certificate Details</h2>
//           <p><strong>Name:</strong> {name}</p>
//           <p><strong>Donation Amount:</strong> {amount}</p>
//           <p><strong>Project:</strong> {projectName}</p>
//           <div className="mt-4">
//             <button
//               onClick={handleDownload}
//               className="w-full bg-green-500 text-white rounded-lg py-2 px-4 hover:bg-green-600"
//             >
//               Download Certificate
//             </button>
//           </div>
//         </div>
//       ) : (
//         <p>No donation details available.</p>
//       )}
//     </div>
//   );
// };

// export default CertificateGenerator;














