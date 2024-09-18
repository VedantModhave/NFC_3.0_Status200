import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase/firebase'; // Adjust path as necessary
import { doc, getDoc, collection, addDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth'; // Import Firebase auth
import scanner from '../assets/scanner.jpg';
import { FaRegCreditCard, FaCreditCard, FaMoneyBillAlt } from 'react-icons/fa';
// import useRazorpay from "react-razorpay";

const Donations = () => {
  const { id } = useParams(); // Get the project ID from route parameters
  const navigate = useNavigate(); // Use navigate for redirection
  const [project, setProject] = useState(null);
  const [screenshot, setScreenshot] = useState(null);
  const [donationAmount, setDonationAmount] = useState('');
  const [error, setError] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [user, setUser] = useState(null); // State for user data

  useEffect(() => {
    const auth = getAuth();

    // Get the current user
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({
          name: currentUser.displayName || 'Anonymous',
          id: currentUser.uid,
        });
      } else {
        setUser(null);
      }
    });

    // Clean up the subscription on component unmount
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const docRef = doc(db, 'projects', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProject(docSnap.data());
        } else {
          console.error('No such document!');
        }
      } catch (error) {
        console.error('Error fetching project:', error);
      }
    };

    fetchProject();
  }, [id]);

  // Handle screenshot upload
  const handleScreenshotChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      // Check file type (image) and size (max 5MB)
      if (!file.type.startsWith('image/')) {
        setError('Please upload a valid image file.');
        setScreenshot(null);
        setIsButtonDisabled(true);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('File size should be less than 5MB.');
        setScreenshot(null);
        setIsButtonDisabled(true);
        return;
      }

      // Clear errors and set the screenshot
      setError('');
      setScreenshot(file);
      setIsButtonDisabled(false);
    }
  };

  // Handle donation amount input
  const handleDonationAmountChange = (e) => {
    const amount = e.target.value;

    // Check if the entered amount is a valid number
    if (!isNaN(amount) && parseFloat(amount) > 0) {
      setDonationAmount(amount);
      setError('');
    } else {
      setDonationAmount('');
      setError('Please enter a valid donation amount.');
    }
  };

  // Handle form submission
const handleSubmit = async () => {
  if (project && screenshot && donationAmount && user) {
    try {
      // Add donation record to Firestore
      await addDoc(collection(db, 'donations'), {
        userName: user.name,
        userId: user.id,
        projectName: project.title,
        projectId: id,
        donationAmount: donationAmount,
        date: new Date(),
      });

      // Clear form after submission (optional)
      setScreenshot(null);
      setDonationAmount('');
      setError('');
      setIsButtonDisabled(true);

      // Redirect to CertificateGenerator page with state
      navigate('/certificate', {
        state: {
          name: user.name,
          amount: donationAmount,
          projectName: project.title
        }
      });

      console.log('Donation successfully recorded.');
    } catch (error) {
      console.error('Error submitting donation:', error);
      setError('An error occurred while submitting your donation.');
    }
  }
};

  // Handle form submission
  // const handleSubmit = async () => {
  //   if (project && screenshot && donationAmount && user) {
  //     try {
  //       // Add donation record to Firestore
  //       await addDoc(collection(db, 'donations'), {
  //         userName: user.name,
  //         userId: user.id,
  //         projectName: project.title,
  //         projectId: id,
  //         donationAmount: donationAmount,
  //         date: new Date(),
  //       });

  //       // Clear form after submission (optional)
  //       setScreenshot(null);
  //       setDonationAmount('');
  //       setError('');
  //       setIsButtonDisabled(true);

  //       // Redirect to CertificateGenerator page
  //       navigate('/certificate');

  //       console.log('Donation successfully recorded.');
  //     } catch (error) {
  //       console.error('Error submitting donation:', error);
  //       setError('An error occurred while submitting your donation.');
  //     }
  //   }
  // };



  useEffect(() => {
    // Enable the submit button only if both screenshot and valid donation amount are provided
    setIsButtonDisabled(!(screenshot && donationAmount));
  }, [screenshot, donationAmount]);

  return (
    <div className="container mx-auto p-6 flex flex-col items-center">
      {project ? (
        <div className="w-full max-w-screen-lg">
          {/* First Two Sections as Cards Side by Side */}
          <div className="flex flex-col md:flex-row justify-between gap-6 mb-6">
            {/* Hero Section */}
            <div className="bg-blue-600 text-white text-center p-6 rounded-lg flex-1">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Make a Difference Today</h1>
              <p className="text-lg mb-4">Your contribution can bring a significant change in the lives of those in need. Choose a donation method that suits you best.</p>
            </div>

            {/* Tax Benefits Note */}
            <section className="bg-yellow-200 p-6 rounded-lg flex-1">
              <h2 className="text-2xl md:text-3xl font-semibold mb-4">Tax Benefits</h2>
              <p className="text-lg">
                In India, donations made to eligible charitable organizations can provide tax benefits under <b>Section 80G</b> of the Income Tax Act, allowing deductions ranging from <b>50% to 100%</b> of the donated amount, depending on the type of institution.
              </p>
            </section>
          </div>

          {/* Project Name */}
          <div className="bg-cyan-200 p-3 rounded-lg shadow-lg mb-6">
            <h1 className="text-3xl font-bold mb-2 text-center">You are making payment to {project.title}</h1>
          </div>

          {/* Donation Options */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Donation Options</h2>
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Bank Details</h3>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center">
                  <FaMoneyBillAlt className="text-blue-600 text-2xl mr-2" />
                  <p>Bank Name: XYZ Bank</p>
                </div>
                <div className="flex items-center">
                  <FaCreditCard className="text-blue-600 text-2xl mr-2" />
                  <p>Account Number: 123456789</p>
                </div>
                <div className="flex items-center">
                  <FaRegCreditCard className="text-blue-600 text-2xl mr-2" />
                  <p>IFSC Code: XYZ0001234</p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">UPI Scanner</h3>
              <div className="flex justify-center">
                <img src={scanner} alt="UPI QR Code" className="w-full max-w-xs border border-gray-300 rounded-lg shadow-md"/>
              </div>
            </div>

            {/* Amount Input Section */}
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-2">Enter Donation Amount</h3>
              <input
                type="number"
                placeholder="Enter amount donated"
                value={donationAmount}
                onChange={handleDonationAmountChange}
                className="block w-full text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg py-2 px-4 focus:outline-none"
              />
            </div>

            {/* Screenshot Upload Section */}
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-2">Upload Payment Screenshot</h3>
              <input
                type="file"
                accept="image/*"
                onChange={handleScreenshotChange}
                className="block w-full text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg cursor-pointer focus:outline-none"
              />
              {error && <p className="text-red-500 mt-2">{error}</p>}
            </div>

            {/* Submit Button */}
            <div className="mt-6">
              <button
                onClick={handleSubmit}
                className={`w-full bg-blue-500 text-white rounded-lg py-2 px-4 ${isButtonDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
                disabled={isButtonDisabled}
              >
                Donate
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default Donations;











// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { db } from '../firebase/firebase'; // Adjust path as necessary
// import { doc, getDoc, collection, addDoc } from 'firebase/firestore';
// import { getAuth, onAuthStateChanged } from 'firebase/auth'; // Import Firebase auth
// import scanner from '../assets/scanner.jpg';
// import { FaRegCreditCard, FaCreditCard, FaMoneyBillAlt } from 'react-icons/fa';

// const Donations = () => {
//   const { id } = useParams(); // Get the project ID from route parameters
//   const [project, setProject] = useState(null);
//   const [screenshot, setScreenshot] = useState(null);
//   const [donationAmount, setDonationAmount] = useState('');
//   const [error, setError] = useState('');
//   const [isButtonDisabled, setIsButtonDisabled] = useState(true);
//   const [user, setUser] = useState(null); // State for user data

//   useEffect(() => {
//     const auth = getAuth();

//     // Get the current user
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       if (currentUser) {
//         setUser({
//           name: currentUser.displayName || 'Anonymous',
//           id: currentUser.uid,
//         });
//       } else {
//         setUser(null);
//       }
//     });

//     // Clean up the subscription on component unmount
//     return () => unsubscribe();
//   }, []);

//   useEffect(() => {
//     const fetchProject = async () => {
//       try {
//         const docRef = doc(db, 'projects', id);
//         const docSnap = await getDoc(docRef);
//         if (docSnap.exists()) {
//           setProject(docSnap.data());
//         } else {
//           console.error('No such document!');
//         }
//       } catch (error) {
//         console.error('Error fetching project:', error);
//       }
//     };

//     fetchProject();
//   }, [id]);

//   // Handle screenshot upload
//   const handleScreenshotChange = (e) => {
//     const file = e.target.files[0];

//     if (file) {
//       // Check file type (image) and size (max 5MB)
//       if (!file.type.startsWith('image/')) {
//         setError('Please upload a valid image file.');
//         setScreenshot(null);
//         setIsButtonDisabled(true);
//         return;
//       }
//       if (file.size > 5 * 1024 * 1024) {
//         setError('File size should be less than 5MB.');
//         setScreenshot(null);
//         setIsButtonDisabled(true);
//         return;
//       }

//       // Clear errors and set the screenshot
//       setError('');
//       setScreenshot(file);
//       setIsButtonDisabled(false);
//     }
//   };

//   // Handle donation amount input
//   const handleDonationAmountChange = (e) => {
//     const amount = e.target.value;

//     // Check if the entered amount is a valid number
//     if (!isNaN(amount) && parseFloat(amount) > 0) {
//       setDonationAmount(amount);
//       setError('');
//     } else {
//       setDonationAmount('');
//       setError('Please enter a valid donation amount.');
//     }
//   };

//   // Handle form submission
//   const handleSubmit = async () => {
//     if (project && screenshot && donationAmount && user) {
//       try {
//         // Add donation record to Firestore
//         await addDoc(collection(db, 'donations'), {
//           userName: user.name,
//           userId: user.id,
//           projectName: project.title,
//           projectId: id,
//           donationAmount: donationAmount,
//           date: new Date(),
//         });

//         // Clear form after submission (optional)
//         setScreenshot(null);
//         setDonationAmount('');
//         setError('');
//         setIsButtonDisabled(true);

//         // Handle successful submission (e.g., show a success message)
//         console.log('Donation successfully recorded.');
//       } catch (error) {
//         console.error('Error submitting donation:', error);
//         setError('An error occurred while submitting your donation.');
//       }
//     }
//   };

//   useEffect(() => {
//     // Enable the submit button only if both screenshot and valid donation amount are provided
//     setIsButtonDisabled(!(screenshot && donationAmount));
//   }, [screenshot, donationAmount]);

//   return (
//     <div className="container mx-auto p-6 flex flex-col items-center">
//       {project ? (
//         <div className="w-full max-w-screen-lg">
//           {/* First Two Sections as Cards Side by Side */}
//           <div className="flex flex-col md:flex-row justify-between gap-6 mb-6">
//             {/* Hero Section */}
//             <div className="bg-blue-600 text-white text-center p-6 rounded-lg flex-1">
//               <h1 className="text-3xl md:text-4xl font-bold mb-4">Make a Difference Today</h1>
//               <p className="text-lg mb-4">Your contribution can bring a significant change in the lives of those in need. Choose a donation method that suits you best.</p>
//             </div>

//             {/* Tax Benefits Note */}
//             <section className="bg-yellow-200 p-6 rounded-lg flex-1">
//               <h2 className="text-2xl md:text-3xl font-semibold mb-4">Tax Benefits</h2>
//               <p className="text-lg">
//                 In India, donations made to eligible charitable organizations can provide tax benefits under Section 80G of the Income Tax Act, allowing deductions ranging from 50% to 100% of the donated amount, depending on the type of institution.
//               </p>
//             </section>
//           </div>

//           {/* Project Name */}
//           <div className="bg-cyan-200 p-3 rounded-lg shadow-lg mb-6">
//             <h1 className="text-3xl font-bold mb-2 text-center">You are making payment to {project.title}</h1>
//           </div>

//           {/* Donation Options */}
//           <div className="bg-white p-6 rounded-lg shadow-lg">
//             <h2 className="text-2xl font-semibold mb-4">Donation Options</h2>
//             <div className="mb-6">
//               <h3 className="text-xl font-semibold mb-2">Bank Details</h3>
//               <div className="flex flex-col space-y-2">
//                 <div className="flex items-center">
//                   <FaMoneyBillAlt className="text-blue-600 text-2xl mr-2" />
//                   <p>Bank Name: XYZ Bank</p>
//                 </div>
//                 <div className="flex items-center">
//                   <FaCreditCard className="text-blue-600 text-2xl mr-2" />
//                   <p>Account Number: 123456789</p>
//                 </div>
//                 <div className="flex items-center">
//                   <FaRegCreditCard className="text-blue-600 text-2xl mr-2" />
//                   <p>IFSC Code: XYZ0001234</p>
//                 </div>
//               </div>
//             </div>
//             <div>
//               <h3 className="text-xl font-semibold mb-2">UPI Scanner</h3>
//               <div className="flex justify-center">
//                 <img src={scanner} alt="UPI QR Code" className="w-full max-w-xs border border-gray-300 rounded-lg shadow-md"/>
//               </div>
//             </div>

//             {/* Amount Input Section */}
//             <div className="mt-6">
//               <h3 className="text-xl font-semibold mb-2">Enter Donation Amount</h3>
//               <input
//                 type="number"
//                 placeholder="Enter amount donated"
//                 value={donationAmount}
//                 onChange={handleDonationAmountChange}
//                 className="block w-full text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg py-2 px-4 focus:outline-none"
//               />
//             </div>

//             {/* Screenshot Upload Section */}
//             <div className="mt-6">
//               <h3 className="text-xl font-semibold mb-2">Upload Payment Screenshot</h3>
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={handleScreenshotChange}
//                 className="block w-full text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg cursor-pointer focus:outline-none"
//               />
//               {error && <p className="text-red-500 mt-2">{error}</p>}
//             </div>

//             {/* Submit Button */}
//             <div className="flex justify-center mt-6">
//               <button
//                 onClick={handleSubmit}
//                 disabled={isButtonDisabled}
//                 className={`py-3 px-6 rounded-lg shadow-lg transition duration-300 ${
//                   isButtonDisabled
//                     ? 'bg-gray-400 cursor-not-allowed'
//                     : 'bg-green-600 text-white hover:bg-green-700'
//                 }`}
//               >
//                 Donate
//               </button>
//             </div>
//           </div>
//         </div>
//       ) : (
//         <p>Loading project details...</p>
//       )}
//     </div>
//   );
// };

// export default Donations;













