import React from 'react';
import { FaCloudUploadAlt, FaMapMarkerAlt, FaSearch, FaFileDownload, FaChartLine, FaFileExport } from 'react-icons/fa';

const featureData = [
  { id: 1, icon: <FaCloudUploadAlt />, title: "Preview and Upload a File", description: "Easily upload your files and preview data for processing." },
  { id: 2, icon: <FaMapMarkerAlt />, title: "Geocode Addresses", description: "Convert your addresses to geolocation coordinates." },
  { id: 3, icon: <FaSearch />, title: "Search Google Maps", description: "Search for locations directly within Google Maps." },
  { id: 4, icon: <FaFileDownload />, title: "Create Report", description: "Generate comprehensive reports based on your dataset." },
  { id: 5, icon: <FaFileExport />, title: "Filter Dataset and Download Results", description: "Filter your dataset and export the results in multiple formats." },
  { id: 6, icon: <FaChartLine />, title: "Cluster Data Analysis", description: "Analyze and visualize clustered data for better insights." },
];

export default function FeatureGrid() {
  return (
    <div className="px-10 pt-12 flex justify-center">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 justify-center max-w-5xl">
        {featureData.map((feature) => (
          <div
            key={feature.id}
            className="flex flex-col items-center p-5 pt-8 bg-green-500 dark:bg-gray-800 rounded-lg shadow-2xl 
            hover:shadow-xl transform transition-transform duration-300 hover:-translate-y-2 hover:scale-105"
          >
            <div className="text-3xl mb-3 text-green-100 dark:text-white">{feature.icon}</div>
            <h3 className="text-lg text-center mb-3 text-white dark:text-white font-extrabold">
              {feature.title}
            </h3>
            <p className="text-green-200 text-center text-sm dark:text-gray-400">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

