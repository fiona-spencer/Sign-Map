import React, { useEffect, useRef, useState } from 'react';
import CreateReport from '../components/CreateReport';
import { Accordion, AccordionPanel, AccordionTitle, AccordionContent, TabItem, Tabs, Button } from 'flowbite-react';
import { HiClipboardList, HiUserAdd } from 'react-icons/hi';
import {BsCodeSlash, BsFiletypeCsv, BsFiletypeJson, BsFiletypeXlsx} from 'react-icons/bs'
import JsonUpload from '../components/json_upload'; 
import CsvUpload from '../components/csv_upload';
import FileUploadPreview from '../components/FileUploadPreview';
import ExcelUpload from '../components/ExcelUpload';
import { useSelector } from 'react-redux'; // Add this at the top if not imported
import { Link } from 'react-router-dom';


export default function Report() {
  const [address, setAddress] = useState('');
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const addressInputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const tabsRef = useRef(null);
  const [activeTab, setActiveTab] = useState(0);
  const [fileReportData, setFileReportData] = useState(null);
  const [error, setError] = useState('');
  const { currentUser } = useSelector((state) => state.user);
const hasAccess = currentUser?.userType === 'admin' || currentUser?.userType === 'user';


  const apiKey = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    const loadGoogleMapsScript = () => {
      if (document.querySelector('script[src^="https://maps.googleapis.com/maps/api/js"]')) return;
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=onGoogleMapsLoaded&v=weekly`;
      script.async = true;
      document.body.appendChild(script);
      script.onload = () => setIsMapLoaded(true);
      script.onerror = () => setIsMapLoaded(false);
    };

    window.onGoogleMapsLoaded = () => initMap();

    // if (!window.google) {
    //   loadGoogleMapsScript();
    // } else {
    //   setIsMapLoaded(true);
    // }

    // loadGoogleMapsScript();

    return () => {
      const script = document.querySelector('script[src^="https://maps.googleapis.com/maps/api/js"]');
      if (script) document.body.removeChild(script);
      delete window.onGoogleMapsLoaded;
    };
  }, [apiKey]);

  const getStatusClass = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-200 text-black';
      case 'accepted': return 'bg-blue-500 text-white';
      case 'in-progress': return 'bg-orange-500 text-white';
      case 'resolved': return 'bg-green-500 text-white';
      case 'deleted': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };


  const initMap = () => {
    if (addressInputRef.current) {
      const autocomplete = new google.maps.places.Autocomplete(addressInputRef.current, {
        types: ['geocode'],
        componentRestrictions: { country: 'ca' },
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place && place.formatted_address) {
          setAddress(place.formatted_address);
        }
      });

      autocompleteRef.current = autocomplete;
    }
  };

  const handleFileUpload = async (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      try {
        if (type === 'json') {
          const data = JSON.parse(content);
          setFileReportData(data);
        } else if (type === 'csv') {
          const rows = content.split('\n').map(row => row.split(','));
          const headers = rows.shift();
          const data = rows.map(row =>
            Object.fromEntries(row.map((cell, idx) => [headers?.[idx], cell]))
          );
          setFileReportData(data);
        } else if (type === 'excel') {
          const workbook = XLSX.read(content, { type: 'binary' });
          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(sheet);
          setFileReportData(jsonData);
        }
        setError('');
      } catch (err) {
        setError('Invalid file format. Please upload a valid JSON, CSV, or Excel file.');
        setFileReportData(null);
      }
    };
  
    if (type === 'excel') {
      reader.readAsBinaryString(file);
    } else {
      reader.readAsText(file);
    }
  };

  return (
<>
{!hasAccess && (
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50 text-white text-center p-8">
        <div>
          <h2 className="text-3xl font-bold mb-4">Access Restricted</h2>
          <p className="text-lg">You do not have permission to access this page, please create an account.</p>
          <Link to="/signup">
  <Button className='w-full mt-10' color='dark'>
    Sign Up
  </Button>
</Link>
          <Link to="/startHere">
  <Button className='w-full mt-2 font-bold text-green-950 bg-[#1e915260] underline outline-none border-2' color='green'>
    Learn More Here
  </Button>
</Link>
        </div>
      </div>
    )}
    <div className={`relative bg-[#F5F5F5] dark:bg-[#121212] min-h-screen ${!hasAccess ? 'pointer-events-none blur-sm' : ''}`}>
      
    {/* Page content here as normal */}
    <div className="bg-[#F5F5F5] dark:bg-[#121212] p-8 min-h-screen">
    <div className="mb-14 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">File Upload Instructions</h2>
  
  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 text-sm">
    <li><strong>Preview a file below</strong> before uploading.</li>
    <li>You may upload files in <strong>JSON, CSV, or Excel (.xlsx)</strong> format.</li>
    <li>Examples of valid file formats are shown below for reference.</li>
    <li>Only valid formats will be accepted. Invalid or corrupt files will show an error.</li>
    <li>Any missing cell values will be replaced with <code>N/A</code>.</li>
    <li>Upon upload, file metadata is generated automatically:
      <ul className="list-disc pl-6 pt-2">
        <li><strong>File Name:</strong> N/A</li>
        <li><strong>Created By:</strong> username</li>
        <li><strong>Created At:</strong> current date</li>
        <li><strong>Status:</strong> Pending</li>
      </ul>
    </li>
    <li>After previewing, valid entries can be sent to the map for pin creation.</li>
    <li>An example report is also provided based on data created on the map.</li>
    <li>More information and examples are available in the section below.</li>
  </ul>
</div>


<FileUploadPreview />

<div className="mt-12">

  {/* Tabs Section for File Upload */}
  <Tabs aria-label="Upload Tabs" variant="default" ref={tabsRef} onActiveTabChange={(tab) => setActiveTab(tab)}>
    
    {/* JSON Upload Tab */}
    <TabItem active={activeTab === 0} title="JSON Upload" icon={BsFiletypeJson}>
      <JsonUpload />
    </TabItem>

    {/* CSV Upload Tab */}
    <TabItem active={activeTab === 1} title="CSV Upload" icon={BsFiletypeCsv}>
      <CsvUpload />
    </TabItem>

    {/* Excel Upload Tab */}
    <TabItem active={activeTab === 2} title="Excel Upload" icon={BsFiletypeXlsx}>
      <ExcelUpload />
    </TabItem>

    {/* Example Report Tab */}
    <TabItem title="Example Report" icon={HiClipboardList}>
  <div className="my-6">
    <label htmlFor="address" className="block text-xl font-semibold text-gray-700 dark:text-gray-300 mb-3">
      Report Example
    </label>
    <input
      type="text"
      id="address"
      ref={addressInputRef}
      value={address}
      onChange={(e) => setAddress(e.target.value)}
      className="border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-base text-gray-800 dark:text-gray-200 w-full focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
      placeholder="Enter an address ..."
    />
  </div>

  <div className="relative pointer-events-none opacity-50 bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
    <CreateReport />

    {/* Overlay Button */}
    
  </div>
  <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
      <a
        href="/datasheets" // Change this route to your actual map path
        className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-lg"
      >
        Create a report on the map
      </a>
    </div>
</TabItem>

  </Tabs>
</div>


{/* Accordion */}
<Accordion  className="mt-10 bg-white dark:bg-[#1E1E1E] shadow-lg rounded-lg max-w-3xl  mx-auto">
  <AccordionPanel>
    <AccordionTitle className="text-xl font-semibold bg-green-500 text-white hover:bg-green-600 rounded-md px-5 py-3 transition-colors duration-300">
      How to Preview a File?
    </AccordionTitle>
    <AccordionContent className="text-gray-700 dark:text-gray-300 text-base p-4">
    <ul>
  <li>
    You can upload files in <strong>.JSON</strong>, <strong>.CSV</strong>, or <strong>Excel (.xlsx)</strong> format to preview their contents.
  </li>
  <li>
    Ensure the uploaded dataset is formatted correctly and the information is accurate before submission.
  </li>
  <li>
    Your dataset <strong>must include a full address</strong> with the following fields:
    <ul className="list-disc pl-5 mt-1 font-medium italic">
      <li>Street Number</li>
      <li>Street Name</li>
      <li>City</li>
      <li>Province</li>
      <li>Postal Code</li>
      <li>Country</li>
    </ul>
  </li>
  <li>
    Additional pin-related data (e.g. contact info, status, description) can also be included.
  </li>
  <li>
    Example files for each format (.JSON, .CSV, .xlsx) are available in each respective tab to help guide you in preparing your dataset.
  </li>
</ul>
    </AccordionContent>
  </AccordionPanel>

  <AccordionPanel>
    <AccordionTitle className="text-xl font-semibold bg-green-500 text-white hover:bg-green-600 rounded-md px-5 py-3 transition-colors duration-300">
      Required Information (Data Schema)
    </AccordionTitle>
    <AccordionContent className="text-gray-700 dark:text-gray-300 p-4">
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg  mx-auto text-sm md:text-base">
  <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center"><BsCodeSlash className='mr-2 h-7 w-7'/> Fields for Data Upload</h2>
  <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
    <li><strong>Populus ID</strong> – A unique identifier for the dataset</li>
    <li><strong>Contact Name</strong> - Full name of the point of contact</li>
    <li><strong>Address</strong> – Full address including street, city, and postal code</li>
    <li><strong>Contact Email</strong> – Valid email address of the contact</li>
    <li><strong>Contact Phone Number</strong> – Optional but recommended</li>
    <li><strong>Assigned To</strong> – Name of the person/team responsible</li>
    <li><strong>Description</strong> – Brief overview of the dataset or request</li>
    <li><strong>Image</strong> – A reference image URL or file path</li>
  </ul>

  <h3 className="mt-6 mb-2 font-semibold text-gray-600 dark:text-white flex items-center italic"><HiUserAdd className='mr-2 h-7 w-7'/> Automatically Attached Info</h3>
  <ul className="list-disc pl-6 space-y-2 text-gray-400 dark:text-gray-300 italic">
    <li><strong>Created By</strong> – User ID of the logged-in uploader</li>
    <li><strong>Created Date</strong> – Timestamp of when the data was uploaded</li>
    <li><strong>User Email</strong> – Email of the user uploading the file</li>
    <li><strong>Filename</strong> – Name of the uploaded file</li>
  </ul>

  <h3 className="mt-6 mb-2 font-semibold text-gray-800 dark:text-white">Initial Upload Status</h3>
  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
    All uploaded datasets are assigned a status of:
  </p>
  <span className="inline-block px-3 py-1 rounded-full bg-yellow-200 text-yellow font-medium text-xs italic">
    pending
  </span>

  <h3 className="mt-6 mb-2 font-semibold text-gray-800 dark:text-white">Possible Status Values</h3>
  <div className="flex flex-wrap gap-3">
    <span className="px-3 py-1 rounded-full bg-yellow-200 text-black text-xs font-medium">pending</span>
    <span className="px-3 py-1 rounded-full bg-blue-500 text-white text-xs font-medium">accepted</span>
    <span className="px-3 py-1 rounded-full bg-orange-400 text-white text-xs font-medium">in-progress</span>
    <span className="px-3 py-1 rounded-full bg-green-500 text-white text-xs font-medium">Completed/Resolved</span>
    <span className="px-3 py-1 rounded-full bg-red-600 text-white text-xs font-medium">deleted</span>
  </div>
</div>

    </AccordionContent>
  </AccordionPanel>

  <AccordionPanel>
    <AccordionTitle className="text-xl font-semibold bg-green-500 text-white hover:bg-green-600 rounded-md px-5 py-3 transition-colors duration-300">
      File Types
    </AccordionTitle>
    <AccordionContent className="text-gray-700 dark:text-gray-300 p-4">
    <ul class="space-y-4 text-gray-700 dark:text-gray-300">
  <li class=" dark:bg-gray-800 p-4 rounded-lg shadow-sm bg-slate-100">
    <h3 class="font-semibold text-lg text-blue-600">JSON (.json)</h3>
    <p class="text-sm mt-2">
      <strong>What it is:</strong> JSON (JavaScript Object Notation) is a lightweight data-interchange format that's easy for both humans and machines to read and write. It stores data in a key-value pair structure and is commonly used for APIs, configuration files, and databases.
    </p>
    <p class="text-sm mt-2">
      <strong>Why use it:</strong> JSON is widely used for transmitting data between a server and a web application. It’s ideal for hierarchical or nested data.
    </p>
    <p class="text-sm mt-2">
      <strong>Example File:</strong> In the "JSON" tab, you'll find an example file to guide you in formatting your dataset correctly in JSON format.
    </p>
  </li>
  
  <li class="dark:bg-gray-800 p-4 rounded-lg shadow-sm bg-slate-100">
    <h3 class="font-semibold text-lg text-blue-600">CSV (.csv)</h3>
    <p class="text-sm mt-2">
      <strong>What it is:</strong> CSV stands for Comma-Separated Values. It’s a simple text format where each row represents a new record, and commas separate the data within each row. It's commonly used for storing tabular data, like spreadsheets or database exports.
    </p>
    <p class="text-sm mt-2">
      <strong>Why use it:</strong> CSV files are easy to use and supported by many tools, including spreadsheet programs like Microsoft Excel or Google Sheets. It’s a popular format for data export and import.
    </p>
    <p class="text-sm mt-2">
      <strong>Example File:</strong> The "CSV" tab contains an example file to help you structure your dataset correctly in CSV format.
    </p>
  </li>
  
  <li class=" dark:bg-gray-800 p-4 rounded-lg shadow-sm bg-slate-100">
    <h3 class="font-semibold text-lg text-blue-600">Excel (.xlsx)</h3>
    <p class="text-sm mt-2">
      <strong>What it is:</strong> Excel files (.xlsx) are used to store data in a spreadsheet format. This format supports multiple sheets, formulas, graphs, and other features typical of spreadsheet applications like Microsoft Excel.
    </p>
    <p class="text-sm mt-2">
      <strong>Why use it:</strong> Excel files are ideal for structured datasets that require more complex features such as calculations, formatting, or multiple sheets. It's widely used for business, finance, and scientific data analysis.
    </p>
    <p class="text-sm mt-2">
      <strong>Example File:</strong> In the "Excel" tab, you’ll find an example file that shows how to structure your data in Excel format.
    </p>
  </li>
</ul>

    </AccordionContent>
  </AccordionPanel>

  <AccordionPanel>
    <AccordionTitle className="text-xl font-semibold bg-green-500 text-white hover:bg-green-600 rounded-md px-5 py-3 transition-colors duration-300">
      Submit Dataset to Map
    </AccordionTitle>
    <AccordionContent className="text-gray-700 dark:text-gray-300 p-4">
    <ul className="list-disc pl-5 text-sm md:text-md text-gray-700 dark:text-gray-300 space-y-1">
  <li>
    Navigate to the upload tab for <strong>JSON</strong>, <strong>CSV</strong>, or <strong>Excel</strong> file formats and upload your dataset.
  </li>
  <li>
    Submit the file using the <strong>"Upload to Map"</strong> button. Note: this may take several seconds if the dataset is large (over 300kB).
  </li>
  <li>
    You will receive a notification confirming if the dataset was successfully processed or if errors are present.
  </li>
  <li>
    If there are missing but non-critical fields, the table will show them in <span className="text-red-600 font-semibold">N/A</span> with red text.
  </li>
  <li>
    The dataset table displays the following fields:
    <ul className="list-disc pl-5 mt-1">
      <li>Created By</li>
      <li>Created At</li>
      <li>Populus ID</li>
      <li>Contact Name</li>
      <li>Contact Email</li>
      <li>Contact Phone</li>
      <li>Full Address</li>
      <li>Status</li>
      <li>Filename</li>
    </ul>
  </li>
  <li>
    Uploaded pins are given a default status of <strong className="text-yellow-400">pending</strong>.
  </li>
  <li>
    Admin accounts can review and approve pins. Once approved, users can <strong>edit</strong> or <strong>delete</strong> their pins.
  </li>
</ul>
    </AccordionContent>
  </AccordionPanel>
</Accordion>
</div>
    {/* Overlay message if access is denied */}
    
  </div>
    
  </>
  );
}
