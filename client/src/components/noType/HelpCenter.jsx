import React from 'react';
import { Accordion } from 'flowbite-react';
import Settings from '../../pages/Settings';

export default function HelpCenter() {
  return (
    <div className="flex flex-col items-center justify-start p-6 w-full">
      <h1 className="text-3xl font-semibold text-center mb-4">Help Center</h1>
      <p className="text-lg mb-6 text-center text-gray-700">
        Welcome to the Help Center! Here are some frequently asked questions (FAQs) to assist you.
      </p>

      {/* Accordion for Q&A */}
      <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg">
        <Accordion>
          <Accordion.Panel>
            <Accordion.Title>
              <h3 className="text-lg font-semibold">How can I reset my password?</h3>
            </Accordion.Title>
            <Accordion.Content>
              <p className="text-sm text-gray-700">
                To reset your password, click on the "Forgot Password" link on the login page. You will be prompted to enter your registered email address, and we will send you a link to reset your password.
              </p>
            </Accordion.Content>
          </Accordion.Panel>

          <Accordion.Panel>
            <Accordion.Title>
              <h3 className="text-lg font-semibold">How do I update my profile information?</h3>
            </Accordion.Title>
            <Accordion.Content>
              <p className="text-sm text-gray-700">
                You can update your profile information by going to your account settings. From there, you can edit your username, email, and other personal details. Don't forget to save your changes.
              </p>
            </Accordion.Content>
          </Accordion.Panel>

          <Accordion.Panel>
            <Accordion.Title>
              <h3 className="text-lg font-semibold">What should I do if I encounter an error?</h3>
            </Accordion.Title>
            <Accordion.Content>
              <p className="text-sm text-gray-700">
                If you encounter an error, first try refreshing the page. If the issue persists, clear your browser's cache and cookies. If the problem continues, feel free to contact our support team for further assistance.
              </p>
            </Accordion.Content>
          </Accordion.Panel>

          <Accordion.Panel>
            <Accordion.Title>
              <h3 className="text-lg font-semibold">How do I contact support?</h3>
            </Accordion.Title>
            <Accordion.Content>
              <p className="text-sm text-gray-700">
                You can contact support by visiting the Contact Support page. Simply fill out the form with your details and message, and our support team will get back to you as soon as possible.
              </p>
            </Accordion.Content>
          </Accordion.Panel>

          <Accordion.Panel>
            <Accordion.Title>
              <h3 className="text-lg font-semibold">What are the system requirements to use the platform?</h3>
            </Accordion.Title>
            <Accordion.Content>
              <p className="text-sm text-gray-700">
                Our platform is compatible with modern browsers such as Chrome, Firefox, and Safari. It is recommended to use the latest version of your browser for optimal performance. The platform is also mobile-friendly.
              </p>
            </Accordion.Content>
          </Accordion.Panel>

          <Accordion.Panel>
            <Accordion.Title>
              <h3 className="text-lg font-semibold">How do I delete my account?</h3>
            </Accordion.Title>
            <Accordion.Content>
              <p className="text-sm text-gray-700">
                If you wish to delete your account, go to your account settings and select the "Delete Account" option. Please note that this action is irreversible, and all your data will be permanently deleted.
              </p>
            </Accordion.Content>
          </Accordion.Panel>
        </Accordion>
      </div>

      {/* Settings Component */}
      <Settings />
    </div>
  );
}
