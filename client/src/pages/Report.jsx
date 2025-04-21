import React from 'react';
import CreateReport from '../components/createReport';
import {
  Accordion,
  AccordionPanel,
  AccordionTitle,
  AccordionContent,
} from 'flowbite-react';

export default function Report() {
  return (
    <div className="bg-[#d1cfcd] dark:bg-[#1d1d22] p-6 px-8 min-h-screen">
      {/* Instructions Accordion */}
      <Accordion className="mb-8 text-lg">
        {/* Intro */}
        <AccordionPanel>
          <AccordionTitle className="text-xl font-semibold">Why Create a Report?</AccordionTitle>
          <AccordionContent>
            <p className="text-base text-gray-700 dark:text-gray-300">
              Submitting a report helps local authorities respond faster to public safety issues, infrastructure problems, or disturbances in your area.
            </p>
          </AccordionContent>
        </AccordionPanel>

        {/* Fields Required */}
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

        {/* Best Practices */}
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

        {/* What Happens Next */}
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

      {/* Create Report Form */}
      <CreateReport />
    </div>
  );
}
