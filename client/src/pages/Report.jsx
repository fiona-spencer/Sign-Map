import React, { useEffect, useRef, useState } from 'react';
import CreateReport from '../components/createReport';
import { Accordion, AccordionPanel, AccordionTitle, AccordionContent, TabItem, Tabs } from 'flowbite-react';
import { HiClipboardList } from 'react-icons/hi';
import { MdDashboard } from 'react-icons/md';
import { HiUserCircle } from 'react-icons/hi';
// Assuming `json_upload` and `csv_upload` are actual components, otherwise replace them with the appropriate handling logic
import JsonUpload from '../components/json_upload'; 
import CsvUpload from '../components/csv_upload';

export default function Report() {
  const [address, setAddress] = useState('');
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const addressInputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const tabsRef = useRef(null);
  const [activeTab, setActiveTab] = useState(0);
  const [fileReportData, setFileReportData] = useState(null);
  const [error, setError] = useState('');

  const apiKey = 'AIzaSyA1wOqcLSGKkhNJQYP9wH06snRuvSJvRJY';

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

    if (!window.google) {
      loadGoogleMapsScript();
    } else {
      setIsMapLoaded(true);
    }

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

    const text = await file.text();

    try {
      if (type === 'json') {
        const data = JSON.parse(text);
        setFileReportData(data);
      } else if (type === 'csv') {
        const rows = text.split('\n').map(row => row.split(','));
        const headers = rows.shift();
        const data = rows.map(row =>
          Object.fromEntries(row.map((cell, idx) => [headers?.[idx], cell]))
        );
        setFileReportData(data);
      }
      setError(''); // Clear any previous error
    } catch (err) {
      setError('Invalid file format. Please upload a valid JSON or CSV file.');
      setFileReportData(null); // Clear file data
    }
  };

  return (
    <div className="bg-[#a6a6a680] dark:bg-[#1d1d22] p-6 px-8 min-h-screen">
      {/* Accordion */}
      <Accordion className="mb-8 text-lg">
        <AccordionPanel>
          <AccordionTitle className="text-xl font-semibold">Why Create a Report?</AccordionTitle>
          <AccordionContent>
            <p className="text-base text-gray-700 dark:text-gray-300">
              Submitting a report helps local authorities respond faster to public safety issues, infrastructure problems, or disturbances in your area.
            </p>
          </AccordionContent>
        </AccordionPanel>

        <AccordionPanel>
          <AccordionTitle className="text-xl font-semibold">Information You Need</AccordionTitle>
          <AccordionContent>
            <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 text-base space-y-2">
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
          <AccordionTitle className="text-xl font-semibold">Tips for a Good Report</AccordionTitle>
          <AccordionContent>
            <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 text-base space-y-2">
              <li>Be as detailed as possible in the description.</li>
              <li>Include specific times or events if applicable.</li>
              <li>Stay factual — avoid exaggeration.</li>
              <li>If you have supporting images or videos, mention them.</li>
            </ul>
          </AccordionContent>
        </AccordionPanel>

        <AccordionPanel>
          <AccordionTitle className="text-xl font-semibold">What Happens After You Submit?</AccordionTitle>
          <AccordionContent>
            <p className="text-base text-gray-700 dark:text-gray-300 mb-2">
              After submission, our team will review your report and may reach out if more information is needed. Depending on the nature of the report, it may be forwarded to local authorities or city services for resolution.
            </p>
            <p className="text-base text-gray-700 dark:text-gray-300">
              You will receive updates via the contact information you provided.
            </p>
          </AccordionContent>
        </AccordionPanel>
      </Accordion>

      {/* Upload Tabs */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Upload or Preview a Report</h2>
        <Tabs aria-label="Upload Tabs" variant="default" ref={tabsRef} onActiveTabChange={(tab) => setActiveTab(tab)}>
          <TabItem active title="JSON Upload" icon={HiClipboardList}>
            <input
              type="file"
              accept=".json"
              onChange={(e) => handleFileUpload(e, 'json')}
              className="mb-4 text-sm"
            />

            {fileReportData && (
              <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded text-xs overflow-x-auto">
                {JSON.stringify(fileReportData, null, 2)}
              </pre>
            )}
            {error && <p className="text-red-500 text-xs mt-2">{error}</p>}

            <JsonUpload /> {/* Ensure JsonUpload is a valid component */}
          </TabItem>

          <TabItem title="CSV Upload" icon={MdDashboard}>
            <input
              type="file"
              accept=".csv"
              onChange={(e) => handleFileUpload(e, 'csv')}
              className="mb-4 text-sm"
            />

            {fileReportData && (
              <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded text-xs overflow-x-auto">
                {JSON.stringify(fileReportData, null, 2)}
              </pre>
            )}
            {error && <p className="text-red-500 text-xs mt-2">{error}</p>}

            <CsvUpload /> {/* Ensure CsvUpload is a valid component */}
          </TabItem>

          <TabItem title="Example Report" icon={HiUserCircle}>
            <div className="my-6">
              <label htmlFor="address" className="block text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Address</label>
              <input
                type="text"
                id="address"
                ref={addressInputRef}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-base text-gray-800 dark:text-gray-200 w-full"
                placeholder="Enter the address of the incident"
              />
            </div>

            <CreateReport address={address} />
          </TabItem>
        </Tabs>
      </div>
    </div>
  );
}
