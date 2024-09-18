import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa'; // Importing social media icons

const Footer = () => {
  return (
    <footer className="bg-blue-600 text-white py-6"> {/* Update to match the navbar color */}
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between">
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <h2 className="text-2xl font-bold mb-4">NGOHub</h2>
            <p className="mb-4">
              Making a difference in the world through community and compassion.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" className="text-white hover:text-gray-300">
                <FaFacebookF />
              </a>
              <a href="https://twitter.com" className="text-white hover:text-gray-300">
                <FaTwitter />
              </a>
              <a href="https://instagram.com" className="text-white hover:text-gray-300">
                <FaInstagram />
              </a>
              <a href="https://linkedin.com" className="text-white hover:text-gray-300">
                <FaLinkedinIn />
              </a>
            </div>
          </div>

          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul>
              <li className="mb-2"><a href="/" className="hover:text-gray-300">Home</a></li>
              <li className="mb-2"><a href="/projects" className="hover:text-gray-300">Projects</a></li>
              <li className="mb-2"><a href="/donations" className="hover:text-gray-300">Donations</a></li>
              <li className="mb-2"><a href="/volunteers" className="hover:text-gray-300">Volunteers</a></li>
              <li className="mb-2"><a href="/contact" className="hover:text-gray-300">Contact Us</a></li>
            </ul>
          </div>

          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <p className="mb-2">123 NGO Street, City, Country</p>
            <p className="mb-2">Email: info@ngohub.org</p>
            <p>Phone: (123) 456-7890</p>
          </div>
        </div>
      </div>
      <div className="text-center py-4"> 
        <p className="text-sm">&copy; {new Date().getFullYear()} NGOHub. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;







// import React from 'react';
// import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa'; // Importing social media icons

// const Footer = () => {
//   return (
//     <footer className="bg-blue-800 text-white py-6">
//       <div className="container mx-auto px-4">
//         <div className="flex flex-wrap justify-between">
//           <div className="w-full md:w-1/4 mb-6 md:mb-0">
//             <h2 className="text-2xl font-bold mb-4">NGO Name</h2>
//             <p className="mb-4">
//               Making a difference in the world through community and compassion.
//             </p>
//             <div className="flex space-x-4">
//               <a href="https://facebook.com" className="text-white hover:text-gray-300">
//                 <FaFacebookF />
//               </a>
//               <a href="https://twitter.com" className="text-white hover:text-gray-300">
//                 <FaTwitter />
//               </a>
//               <a href="https://instagram.com" className="text-white hover:text-gray-300">
//                 <FaInstagram />
//               </a>
//               <a href="https://linkedin.com" className="text-white hover:text-gray-300">
//                 <FaLinkedinIn />
//               </a>
//             </div>
//           </div>

//           <div className="w-full md:w-1/4 mb-6 md:mb-0">
//             <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
//             <ul>
//               <li><a href="/" className="hover:text-gray-300">Home</a></li>
//               <li><a href="/projects" className="hover:text-gray-300">Projects</a></li>
//               <li><a href="/donations" className="hover:text-gray-300">Donations</a></li>
//               <li><a href="/volunteers" className="hover:text-gray-300">Volunteers</a></li>
//               <li><a href="/contact" className="hover:text-gray-300">Contact Us</a></li>
//             </ul>
//           </div>

//           <div className="w-full md:w-1/4 mb-6 md:mb-0">
//             <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
//             <p className="mb-2">123 NGO Street, City, Country</p>
//             <p className="mb-2">Email: info@ngo.org</p>
//             <p>Phone: (123) 456-7890</p>
//           </div>

//           <div className="w-full md:w-1/4">
//             <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
//             <p className="mb-4">Subscribe to our newsletter for the latest updates.</p>
//             <form>
//               <input
//                 type="email"
//                 placeholder="Your email address"
//                 className="w-full p-2 mb-4 rounded bg-blue-700 text-white"
//               />
//               <button
//                 type="submit"
//                 className="bg-blue-600 py-2 px-4 rounded hover:bg-blue-500"
//               >
//                 Subscribe
//               </button>
//             </form>
//           </div>
//         </div>
//       </div>
//       <div className="bg-blue-900 text-center py-4">
//         <p className="text-sm">&copy; {new Date().getFullYear()} NGO Name. All rights reserved.</p>
//       </div>
//     </footer>
//   );
// };

// export default Footer;
