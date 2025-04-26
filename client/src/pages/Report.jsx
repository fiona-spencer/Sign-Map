import React, { useEffect, useRef, useState } from 'react';
import CreateReport from '../components/createReport';
import { Accordion, AccordionPanel, AccordionTitle, AccordionContent, TabItem, Tabs } from 'flowbite-react';
import { HiClipboardList } from 'react-icons/hi';
import { MdDashboard } from 'react-icons/md';
import { HiUserCircle } from 'react-icons/hi';
import JsonUpload from '../components/json_upload'; 
import CsvUpload from '../components/csv_upload';
import FileUploadPreview from '../components/FileUploadPreview';
import ExcelUpload from '../components/ExcelUpload';

export default function Report() {
  const [address, setAddress] = useState('');
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const addressInputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const tabsRef = useRef(null);
  const [activeTab, setActiveTab] = useState(0);
  const [fileReportData, setFileReportData] = useState(null);
  const [error, setError] = useState('');

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
    <div className="bg-[#F5F5F5] dark:bg-[#121212] p-8 min-h-screen">


      <FileUploadPreview />

      <div className="mt-12">

        {/* Tabs Section for File Upload */}
        <Tabs aria-label="Upload Tabs" variant="default" ref={tabsRef} onActiveTabChange={(tab) => setActiveTab(tab)}>
          
          {/* JSON Upload Tab */}
          <TabItem active={activeTab === 0} title="JSON Upload" icon={HiClipboardList}>
            <JsonUpload />
          </TabItem>

          {/* CSV Upload Tab */}
          <TabItem active={activeTab === 1} title="CSV Upload" icon={MdDashboard}>
            <CsvUpload />
          </TabItem>

          {/* Excel Upload Tab */}
          <TabItem active={activeTab === 2} title="Excel Upload" icon={HiUserCircle}>
            <ExcelUpload />
          </TabItem>

          {/* Example Report Tab */}
          <TabItem title="Example Report" icon={HiUserCircle}>
            <div className="my-6">
              <label htmlFor="address" className="block text-xl font-semibold text-gray-700 dark:text-gray-300 mb-3">Address</label>
              <input
                type="text"
                id="address"
                ref={addressInputRef}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-base text-gray-800 dark:text-gray-200 w-full focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                placeholder="Enter the address of the incident"
              />
            </div>

            <CreateReport address={address} />
          </TabItem>
        </Tabs>
      </div>


      {/* Accordion */}
      <Accordion className="mt-10 bg-white dark:bg-[#1E1E1E] shadow-lg rounded-lg">
        <AccordionPanel>
          <AccordionTitle className="text-xl font-semibold bg-green-500 text-white hover:bg-green-600 rounded-md px-5 py-3 transition-colors duration-300">
            Why Create a Report?
          </AccordionTitle>
          <AccordionContent className="text-gray-700 dark:text-gray-300 text-base p-4">
            Submitting a report helps local authorities respond faster to public safety issues, infrastructure problems, or disturbances in your area.
          </AccordionContent>
        </AccordionPanel>

        <AccordionPanel>
          <AccordionTitle className="text-xl font-semibold bg-green-500 text-white hover:bg-green-600 rounded-md px-5 py-3 transition-colors duration-300">
            Information You Need
          </AccordionTitle>
          <AccordionContent className="text-gray-700 dark:text-gray-300 p-4">
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Address:</strong> Exact location of the incident.</li>
              <li><strong>Full Name:</strong> For contact and follow-up.</li>
              <li><strong>Email:</strong> For status updates and confirmation.</li>
              <li><strong>Phone Number:</strong> Optional, but helpful for urgent matters.</li>
              <li><strong>Date of Incident:</strong> When it happened.</li>
              <li><strong>Title:</strong> A short headline of the issue.</li>
              <li><strong>Description:</strong> Full details, including context.</li>
              <li><strong>Verification:</strong> A checkbox to confirm accuracy.</li>
            </ul>
          </AccordionContent>
        </AccordionPanel>

        <AccordionPanel>
          <AccordionTitle className="text-xl font-semibold bg-green-500 text-white hover:bg-green-600 rounded-md px-5 py-3 transition-colors duration-300">
            Tips for a Good Report
          </AccordionTitle>
          <AccordionContent className="text-gray-700 dark:text-gray-300 p-4">
            <ul className="list-disc pl-5 space-y-2">
              <li>Be as detailed as possible in the description.</li>
              <li>Include specific times or events if applicable.</li>
              <li>Stay factual — avoid exaggeration.</li>
              <li>If you have supporting images or videos, mention them.</li>
            </ul>
          </AccordionContent>
        </AccordionPanel>

        <AccordionPanel>
          <AccordionTitle className="text-xl font-semibold bg-green-500 text-white hover:bg-green-600 rounded-md px-5 py-3 transition-colors duration-300">
            What Happens After You Submit?
          </AccordionTitle>
          <AccordionContent className="text-gray-700 dark:text-gray-300 p-4">
            After submission, our team will review your report and may reach out if more information is needed. Depending on the nature of the report, it may be forwarded to local authorities or city services for resolution.
            <br />
            You will receive updates via the contact information you provided.
          </AccordionContent>
        </AccordionPanel>
      </Accordion>
    </div>
  );
}
