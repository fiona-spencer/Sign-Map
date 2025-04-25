import React from 'react';
import { Accordion } from 'flowbite-react';
import Settings from '../../pages/Settings';

export default function HelpCenter() {
  return (
    <div className="flex flex-col items-center justify-start p-6 w-full bg-[#695f567a] dark:bg-[#6a6e81e4] dark:text-white">
      <h1 className="text-3xl font-semibold text-center mb-4 pt-16 md:pt-0 dark:text-white">Help Center</h1>
      <p className="text-lg mb-6 text-center text-gray-700 dark:text-gray-100">
        Welcome to the Help Center! Here are some frequently asked questions (FAQs) to assist you.
      </p>

      {/* Accordion for Q&A */}
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg px-6 py-6 sm:pt-16 dark:bg-[#00000085] dark:text-white dark:border-2 dark:border-white">
        <h2 className="text-base sm:text-lg md:text-xl font-semibold text-center mb-6 dark:text-white">Frequently Asked Questions</h2>

        {/* No Account Accordion */}
        <div className="mb-6">
          <h3 className="text-sm sm:text-base md:text-lg font-bold mb-2 dark:text-white">No Account</h3>
          <Accordion collapseAll>
            <Accordion.Panel defaultOpen={false}>
              <Accordion.Title className='md:p-3 py-2'>
                <h4 className="text-xs sm:text-sm md:text-base font-semibold dark:text-white">How can I reset my password?</h4>
              </Accordion.Title>
              <Accordion.Content>
                <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                  Click on "Forgot Password" on the login page. Enter your registered email to receive a reset link.
                </p>
              </Accordion.Content>
            </Accordion.Panel>
          </Accordion>
        </div>

        {/* Public Account Accordion */}
        <div className="mb-6">
          <h3 className="text-sm sm:text-base md:text-lg font-bold mb-2 dark:text-white">Public Account</h3>
          <Accordion collapseAll>
            <Accordion.Panel defaultOpen={false}>
              <Accordion.Title className='md:p-3 py-2'>
                <h4 className="text-xs sm:text-sm md:text-base font-semibold dark:text-white">How do I update my profile information?</h4>
              </Accordion.Title>
              <Accordion.Content>
                <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                  Go to your account settings to update your username, email, and other details.
                </p>
              </Accordion.Content>
            </Accordion.Panel>
          </Accordion>
        </div>

        {/* User Account Accordion */}
        <div className="mb-6">
          <h3 className="text-sm sm:text-base md:text-lg font-bold mb-2 dark:text-white">User Account</h3>
          <Accordion collapseAll>
            <Accordion.Panel defaultOpen={false}>
              <Accordion.Title className='md:p-3 py-2'>
                <h4 className="text-xs sm:text-sm md:text-base font-semibold dark:text-white">What should I do if I encounter an error?</h4>
              </Accordion.Title>
              <Accordion.Content>
                <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                  Try refreshing the page. If it persists, clear your cache or contact support.
                </p>
              </Accordion.Content>
            </Accordion.Panel>

            <Accordion.Panel defaultOpen={false}>
              <Accordion.Title className='md:p-3 py-2'>
                <h4 className="text-xs sm:text-sm md:text-base font-semibold dark:text-white">How do I contact support?</h4>
              </Accordion.Title >
              <Accordion.Content>
                <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                  Visit the Contact Support page and fill out the form to get help.
                </p>
              </Accordion.Content>
            </Accordion.Panel>
          </Accordion>
        </div>

        {/* Admin Account Accordion */}
        <div>
          <h3 className="text-sm sm:text-base md:text-lg font-bold mb-2 dark:text-white">Admin Account</h3>
          <Accordion collapseAll>
            <Accordion.Panel defaultOpen={false}>
              <Accordion.Title className='md:p-3 py-2'>
                <h4 className="text-xs sm:text-sm md:text-base font-semibold dark:text-white">What are the system requirements to use the platform?</h4>
              </Accordion.Title>
              <Accordion.Content>
                <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                  Use a modern browser like Chrome, Firefox, or Safari. The platform is mobile-friendly.
                </p>
              </Accordion.Content>
            </Accordion.Panel>

            <Accordion.Panel defaultOpen={false}>
              <Accordion.Title className='md:p-3 py-2'>
                <h4 className="text-xs sm:text-sm md:text-base font-semibold dark:text-white">How do I delete my account?</h4>
              </Accordion.Title>
              <Accordion.Content>
                <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                  In account settings, select "Delete Account". This is irreversible and all your data will be lost.
                </p>
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
