import React, { useState } from 'react';
import { Timeline, TimelineItem, TimelinePoint, TimelineContent, TimelineTime, TimelineTitle, TimelineBody, Button, Card } from 'flowbite-react';
import { HiCalendar, HiArrowNarrowRight } from 'react-icons/hi';
import CNTower from '../assets/CNTower.jpg'; // Adjust path as needed

export default function ReleaseNotes() {
  const [hovered, setHovered] = useState(false);

  return (
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
            width={500}
            height={500}
          >
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Noteworthy technology acquisitions 2021
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.
            </p>
          </Card>

          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              hovered ? 'max-h-40 opacity-100 mt-4' : 'max-h-0 opacity-0'
            } w-full bg-white p-4 rounded-lg shadow-md dark:bg-gray-800`}
          >
          </div>
        </div>
      </div>
    </div>
  );
}
