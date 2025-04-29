import React from 'react';
import { Accordion } from 'flowbite-react';
import Settings from '../../pages/Settings';
import { CgArrowTopRight } from "react-icons/cg";


export default function HelpCenter() {
  return (
    <div className="flex flex-col items-center justify-start p-6 w-full bg-[#8d88844f] dark:bg-[#6a6e81e4] dark:text-white">
      <h1 className="text-3xl font-semibold text-center mb-4 pt-16 md:pt-0 dark:text-white">Help Center</h1>
      <p className="text-lg mb-6 text-center text-gray-700 dark:text-gray-100">
        Welcome to the Help Center! Here are some frequently asked questions (FAQs).
      </p>

      {/* Accordion for Q&A */}
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg px-6 py-6 sm:pt-16 dark:bg-[#00000085] dark:text-white dark:border-2 dark:border-white">
        <h2 className="text-base sm:text-lg md:text-xl font-semibold text-center mb-6 dark:text-white">Frequently Asked Questions</h2>

        {/* No Account Accordion */}
        <div className="mb-6">
          <h3 className="text-sm sm:text-base md:text-lg font-bold mb-2 dark:text-white">Sign In or Sign Up</h3>
          <Accordion collapseAll>
            <Accordion.Panel defaultOpen={false}>
              <Accordion.Title className='md:p-3 py-2'>
                <h4 className="text-xs sm:text-sm md:text-base font-semibold dark:text-white">Account Types: User & Admin</h4>
              </Accordion.Title>
              <Accordion.Content>
              <ul className="list-disc pl-5 text-xs sm:text-sm text-gray-700 dark:text-gray-300 space-y-1">
  <li>
    Create an account through a username, and password, or sign up with Google Authentication.
  </li>
  <li>
    <strong>Public</strong> cannot upload files or access the map.
  </li>
  <li>
    <strong>User</strong> accounts are able to upload files, CRUD actions, and interact with the map.
  </li>
  <li>
    <strong>Admin</strong> accounts are user accounts and have access to site analytics/traffic, user and map database, and log transactions.
  </li>
</ul>
<p className="italic text-xs mt-2 pl-5">*Creating an admin account requires an authorized password</p>

              </Accordion.Content>
            </Accordion.Panel>
          </Accordion>
        </div>

        {/* Public Account Accordion */}
        <div className="mb-6">
          <h3 className="text-sm sm:text-base md:text-lg font-bold mb-2 dark:text-white">Settings</h3>
          <Accordion collapseAll>
            <Accordion.Panel defaultOpen={false}>
              <Accordion.Title className='md:p-3 py-2'>
                <h4 className="text-xs sm:text-sm md:text-base font-semibold dark:text-white">How do I update my profile information?</h4>
              </Accordion.Title>
              <Accordion.Content>
              <ul className="list-disc pl-5 text-xs sm:text-sm text-gray-700 dark:text-gray-300 space-y-1">
  <li>
   User and Admin accounts can change their personal username, email, password, and profile picture in settings under <a href='/settings' className='underline'>Profile</a> 
  </li>
  <li>
    <strong>Admin</strong> are able to change any user or map data at <a href='/database' className='underline'>Database</a>  
  </li>
  <li className='items-center flex italic text-xs'>
    *Sign out of an account by going to your profile picture at the top right <CgArrowTopRight className='ml-2 font-extrabold h-5 w-5 text-red-600'/>
  </li>
</ul>

              </Accordion.Content>
            </Accordion.Panel>
          </Accordion>
        </div>

        {/* User Account Accordion */}
        <div className="mb-6">
          <h3 className="text-sm sm:text-base md:text-lg font-bold mb-2 dark:text-white">Upload a File</h3>
          <Accordion collapseAll>
            <Accordion.Panel defaultOpen={false}>
              <Accordion.Title className='md:p-3 py-2'>
                <h4 className="text-xs sm:text-sm md:text-base font-semibold dark:text-white">How to Upload a File?</h4>
              </Accordion.Title>
              <Accordion.Content>
              <ul className="list-disc pl-5 text-xs sm:text-sm text-gray-700 dark:text-gray-300 space-y-1">
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
</ul>

              </Accordion.Content>
            </Accordion.Panel>

            <Accordion.Panel defaultOpen={false}>
              <Accordion.Title className='md:p-3 py-2'>
                <h4 className="text-xs sm:text-sm md:text-base font-semibold dark:text-white">How to Export a File to the Map?</h4>
              </Accordion.Title >
              <Accordion.Content>
              <ul className="list-disc pl-5 text-xs sm:text-sm text-gray-700 dark:text-gray-300 space-y-1">
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


              </Accordion.Content>
            </Accordion.Panel>
          </Accordion>
        </div>

        {/* Admin Account Accordion */}
        <div>
          <h3 className="text-sm sm:text-base md:text-lg font-bold mb-2 dark:text-white">Explore the Map</h3>
          <Accordion collapseAll>
            <Accordion.Panel defaultOpen={false}>
              <Accordion.Title className='md:p-3 py-2'>
                <h4 className="text-xs sm:text-sm md:text-base font-semibold dark:text-white">How to Filter and Search on the Map?</h4>
              </Accordion.Title>
              <Accordion.Content>
              <ul className="list-disc pl-5 text-xs sm:text-sm text-gray-700 dark:text-gray-300 space-y-1">
  <li>
    Navigate to the <strong>Map</strong> page. Once the data is loaded, pins will be displayed using <strong>coordinated colors</strong> based on their status.
  </li>
  <li>
    Status color coding:
    <ul className="list-disc pl-5 mt-1">
      <li className="text-yellow-400">Pending</li>
      <li className="text-blue-500">Accepted</li>
      <li className="text-orange-400">In-Progress</li>
      <li className="text-green-500">Completed</li>
      <li className="text-red-700">Deleted</li>
    </ul>
  </li>
  <li>
    Use the available search filters to dynamically update the pins displayed on the map based on criteria such as status, address, or contact name.
  </li>
  <li>
    Use the <strong>"Reset"</strong> button to clear all filters and return to the full dataset.
  </li>
  <li>
    Click on any pin to open a detailed popup with information about the report.
  </li>
  <li>
    Toggle the <strong>GeoJSON layer</strong> to view Ontario postal code boundaries overlaid on the map.
  </li>
  <li>
    In the <strong>bottom-right corner</strong> of the map, you’ll see a counter showing the number of currently filtered pins.
  </li>
  <li>
    Clicking on a postal code region will also display the corresponding <strong>postal code</strong> in that same corner.
  </li>
</ul>

              </Accordion.Content>
            </Accordion.Panel>

            <Accordion.Panel defaultOpen={false}>
              <Accordion.Title className='md:p-3 py-2'>
                <h4 className="text-xs sm:text-sm md:text-base font-semibold dark:text-white">How to Create or Update a Pin?</h4>
              </Accordion.Title>
              <Accordion.Content>
              <ul className="list-disc pl-5 text-xs sm:text-sm text-gray-700 dark:text-gray-300 space-y-1">
  <li>
    There are <strong>3 ways to create a pin</strong> on the map:
    <ul className="list-disc pl-5 mt-1">
      <li>Upload a file containing the pin data (e.g., CSV, JSON, or Excel).</li>
      <li>Use the <strong>Google Address Search</strong> to locate a specific address and create a pin.</li>
      <li><strong>Click on a location</strong> on the map to place a pin (Note: To use this method, the GeoJson layer must be off).</li>
    </ul>
  </li>
  <li>
    To create a single pin, <strong>you will need to provide the following information:</strong>
    <ul className="list-disc pl-5 mt-1 italic font-medium">
      <li>Contact Name</li>
      <li>Contact Email</li>
      <li>Contact Phone Number</li>
      <li>Optional: Populus ID</li>
      <li>Optional: Assigned To (for team-based tasks)</li>
      <li>Optional: Description</li>
      <li>Optional: Image File (can be uploaded with the pin)</li>
    </ul>
  </li>
  <li>
    <strong>Verify that the information is correct</strong> before submitting to ensure accuracy.
  </li>
  <li>
    Once the pin is created, <strong>check the status</strong> to ensure it is successfully created.
  </li>
</ul>

              </Accordion.Content>
            </Accordion.Panel>
            <Accordion.Panel defaultOpen={false}>
              <Accordion.Title className='md:p-3 py-2'>
                <h4 className="text-xs sm:text-sm md:text-base font-semibold dark:text-white">How Create Map Clusters and Export?</h4>
              </Accordion.Title>
              <Accordion.Content>
              <ul className="list-disc pl-5 text-xs sm:text-sm text-gray-700 dark:text-gray-300 space-y-1">
  <li>
    <strong>Filter the pins</strong> based on your desired criteria before proceeding with clustering.
  </li>
  <li>
    After filtering, you can <strong>download the filtered pins</strong> as an Excel spreadsheet:
    <ul className="list-disc pl-5 mt-1 pb-2">
      <li>Click on the <strong className='bg-blue-300 rounded-2xl px-2 py-0.5'>Download Excel Spreadsheet</strong> button to get a copy of the filtered data.</li>
    </ul>
  </li>
  <li>
    To create map clusters, go to the <strong className='bg-gray-100 border-2 border-black rounded-2xl px-2 py-0.5'>Show Clustered Map</strong> section.
    <ul className="list-disc pl-5 mt-1">
      <li>This will display a map where you can <strong>create optimized clusters</strong> or zones based on the radial size (from 200 to 2000 meters).</li>
    </ul>
  </li>
  <li>
    Optionally, you can <strong>change the "Group By Postal Code"</strong> setting to see the filtered pins in their designated postal code regions.
  </li>
  <li>
    Use the <strong className='text-orange-500'>sliders</strong> to adjust the cluster size and zoom level:
    <ul className="list-disc pl-5 mt-1">
      <li>Change the radial size for clusters, from 200 to 2000 meters.</li>
      <li>Adjust the zoom level for the map to control the level of detail for the clusters.</li>
    </ul>
  </li>
  <li>
    The resulting <strong className='text-green-800'>clusters</strong> will be displayed on the map.
    <ul className="list-disc pl-5 mt-1">
      <li>Click on a specific cluster to zoom in and view the pins within that cluster more closely.</li>
    </ul>
  </li>
  <li>
    You can also download a PDF of the clustered pin results for your records or further use.
    <ul className="list-disc pl-5 mt-1">
      <li>Click on the <strong className='bg-green-300 rounded-2xl px-2 py-0.5'>Download PDF</strong> button to export the clustered pin data as a PDF.</li>
    </ul>
  </li>
</ul>

              </Accordion.Content>
            </Accordion.Panel>
          </Accordion>
        </div>
      </div>

      {/* Settings Component */}
      <Settings />
    </div>
  );
}
