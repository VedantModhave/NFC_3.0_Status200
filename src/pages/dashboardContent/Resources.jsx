import React from 'react';

const Resources = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-4">Resources Overview</h1>
      {/* Total Resources */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white shadow-lg rounded-lg p-4">
          <h2 className="text-xl font-semibold">Total Resources</h2>
          <p className="text-4xl font-bold mt-2">320</p>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-4">
          <h2 className="text-xl font-semibold">Active Resources</h2>
          <p className="text-4xl font-bold mt-2">250</p>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-4">
          <h2 className="text-xl font-semibold">Inactive Resources</h2>
          <p className="text-4xl font-bold mt-2">70</p>
        </div>
      </div>

      {/* Resource Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white shadow-lg rounded-lg p-4">
          <h2 className="text-xl font-semibold">Educational Resources</h2>
          <p className="text-2xl font-bold mt-2">120</p>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-4">
          <h2 className="text-xl font-semibold">Training Materials</h2>
          <p className="text-2xl font-bold mt-2">80</p>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-4">
          <h2 className="text-xl font-semibold">Volunteer Guides</h2>
          <p className="text-2xl font-bold mt-2">100</p>
        </div>
      </div>

      {/* Recent Resources */}
      <div className="bg-white shadow-lg rounded-lg p-4 mb-6">
        <h2 className="text-xl font-semibold mb-4">Recent Resources Added</h2>
        <ul className="space-y-2">
          <li className="p-2 bg-gray-100 rounded-md">
            <h3 className="font-semibold">Community Outreach Guide</h3>
            <p className="text-sm text-gray-600">Added on 25th August 2024</p>
          </li>
          <li className="p-2 bg-gray-100 rounded-md">
            <h3 className="font-semibold">Training Video Series - Health & Safety</h3>
            <p className="text-sm text-gray-600">Added on 22nd August 2024</p>
          </li>
          <li className="p-2 bg-gray-100 rounded-md">
            <h3 className="font-semibold">Volunteer Handbook</h3>
            <p className="text-sm text-gray-600">Added on 20th August 2024</p>
          </li>
        </ul>
      </div>

      {/* Upload New Resource */}
      <div className="bg-white shadow-lg rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4">Upload New Resource</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Resource Name</label>
            <input
              type="text"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter resource name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
              <option>Educational</option>
              <option>Training</option>
              <option>Guides</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Upload File</label>
            <input
              type="file"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-indigo-700"
          >
            Upload Resource
          </button>
        </form>
      </div>
    </div>
  );
};

export default Resources;
