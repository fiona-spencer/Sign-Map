import CNTower from '../../assets/CNTower.jpg'
import JsonUpload from '../json_upload'; // make sure the path is correct
import React, { useState } from 'react';
import {
  Button,
  Timeline,
  TimelineBody,
  TimelineContent,
  TimelineItem,
  TimelinePoint,
  TimelineTime,
  TimelineTitle,
  Card
} from "flowbite-react";
import { HiArrowNarrowRight, HiCalendar } from "react-icons/hi";

export default function StartHere() {
  const [hovered, setHovered] = useState(false);


  return (
    <div className="inline items-center justify-center p-6">
      <h1 className="text-3xl font-semibold text-center mb-8">Welcome! Please Sign In or Create an Account</h1>
      <p className="text-lg mb-6 text-center text-gray-700">
        To get started, please sign in or create an account. Once you're logged in, you can choose one of the following account types.
      </p>


      {/* Account Card Wrapper with Flex */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center lg:px-40 px-10">
  <div className="w-full">
    <Card className="h-full flex flex-col justify-between bg-white shadow-lg z-20 dark:bg-gray-800 rounded-lg p-6 hover:shadow-xl transition transform hover:scale-105 animate-fade-in">
       <h5 className="mb-4 text-xl font-medium text-gray-500 dark:text-gray-400">Public Account</h5>
            <ul className="my-7 space-y-5">
              <li className="flex space-x-3">
                <svg
                  className="h-5 w-5 shrink-0 text-cyan-600 dark:text-cyan-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">
                  View content and browse the platform
                </span>
              </li>
              <li className="flex space-x-3">
                <svg
                  className="h-5 w-5 shrink-0 text-cyan-600 dark:text-cyan-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">
                  Limited access to features
                </span>
              </li>
            </ul>
            <button
              type="button"
              className="inline-flex w-full justify-center rounded-lg bg-gray-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-900"
            >
              Choose Public
            </button>
          </Card>
        </div>

        {/* User Account Card Wrapper */}
        <div className="w-full">
    <Card className="h-full flex flex-col justify-between bg-white shadow-lg z-20 dark:bg-gray-800 rounded-lg p-6 hover:shadow-xl transition transform hover:scale-105 animate-fade-in">
     <h5 className="mb-4 text-xl font-medium text-gray-500 dark:text-gray-400">User Account</h5>
            <ul className="my-7 space-y-5">
              <li className="flex space-x-3">
                <svg
                  className="h-5 w-5 shrink-0 text-cyan-600 dark:text-cyan-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">
                  Access to most platform features
                </span>
              </li>
              <li className="flex space-x-3">
                <svg
                  className="h-5 w-5 shrink-0 text-cyan-600 dark:text-cyan-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">
                  Create and share content
                </span>
              </li>
            </ul>
            <button
              type="button"
              className="inline-flex w-full justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900"
            >
              Choose User
            </button>
          </Card>
        </div>

        {/* Admin Account Card Wrapper */}
        <div className="w-full">
    <Card className="h-full flex flex-col justify-between bg-white shadow-lg z-20 dark:bg-gray-800 rounded-lg p-6 hover:shadow-xl transition transform hover:scale-105 animate-fade-in">
     <h5 className="mb-4 text-xl font-medium text-gray-500 dark:text-gray-400">Admin Account</h5>
            <ul className="my-7 space-y-5">
              <li className="flex space-x-3">
                <svg
                  className="h-5 w-5 shrink-0 text-cyan-600 dark:text-cyan-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">
                  Full access to the platform
                </span>
              </li>
              <li className="flex space-x-3">
                <svg
                  className="h-5 w-5 shrink-0 text-cyan-600 dark:text-cyan-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">
                  Manage users and settings
                </span>
              </li>
              <li className="flex space-x-3">
                <svg
                  className="h-5 w-5 shrink-0 text-cyan-600 dark:text-cyan-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">
                  Access advanced tools
                </span>
              </li>
            </ul>
            <button
              type="button"
              className="inline-flex w-full justify-center rounded-lg bg-green-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-200 dark:focus:ring-green-900"
            >
              Choose Admin
            </button>
          </Card>
        </div>
        </div>

      {/* Timeline */}
      <div className="px-10 pt-12">
  {/* Centered Timeline */}
  <div className="mb-12 flex justify-center">
    <div className="w-full max-w-3xl">
      <Timeline>
        <TimelineItem>
          <TimelinePoint icon={HiCalendar} />
          <TimelineContent>
            <TimelineTime>February 2022</TimelineTime>
            <TimelineTitle>Application UI code in Tailwind CSS</TimelineTitle>
            <TimelineBody>
              Get access to over 20+ pages including a dashboard layout, charts, kanban board, calendar, and more.
            </TimelineBody>
            <Button color="gray" size="sm">
              Learn More
              <HiArrowNarrowRight className="ml-2 h-3 w-3" />
            </Button>
          </TimelineContent>
        </TimelineItem>

        <TimelineItem>
          <TimelinePoint icon={HiCalendar} />
          <TimelineContent>
            <TimelineTime>March 2022</TimelineTime>
            <TimelineTitle>Marketing UI design in Figma</TimelineTitle>
            <TimelineBody>
              Components are first designed in Figma with full parity in the Tailwind implementation.
            </TimelineBody>
          </TimelineContent>
        </TimelineItem>

        <TimelineItem>
          <TimelinePoint icon={HiCalendar} />
          <TimelineContent>
            <TimelineTime>April 2022</TimelineTime>
            <TimelineTitle>E-Commerce UI code in Tailwind CSS</TimelineTitle>
            <TimelineBody>
              Interactive elements built on top of Tailwind CSS.
            </TimelineBody>
          </TimelineContent>
        </TimelineItem>
      </Timeline>
    </div>
  </div>


      {/* Feature List Cards */}
        <div className="flex flex-col items-center mt-8">
      <div
        className="flex flex-col items-center w-full max-w-xl group"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <Card
          className="w-full transition-transform duration-300 ease-in-out group-hover:scale-[1.02]"
          imgAlt="CN Tower at dusk"
          imgSrc={CNTower}
          width={500} height={500}
        >

          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Noteworthy technology acquisitions 2021
          </h5>
          <p className="font-normal text-gray-700 dark:text-gray-400">
            Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.
          </p>
        </Card>

        {/* Reveal on hover with smooth animation */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            hovered ? 'max-h-40 opacity-100 mt-4' : 'max-h-0 opacity-0'
          } w-full bg-white p-4 rounded-lg shadow-md dark:bg-gray-800`}
        >
          <JsonUpload />
        </div>
      </div>
    </div>
    </div>
</div>

  );
}
