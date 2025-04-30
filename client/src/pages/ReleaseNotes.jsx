import React, { useState } from 'react';
import { Timeline, TimelineItem, TimelinePoint, TimelineContent, TimelineTime, TimelineTitle, TimelineBody, Button, Card } from 'flowbite-react';
import { HiCalendar, HiArrowNarrowRight, HiInformationCircle, HiOutlineInformationCircle } from 'react-icons/hi';
import CNTower from '../assets/CNTower.jpg'; // Adjust path as needed
import { MdAddTask } from "react-icons/md";
import dataImage from '../assets/data.jpeg'
import collaboration from '../assets/collaboration.jpg'
import smartCity from '../assets/smartcity.jpg'



export default function ReleaseNotes() {
  const [hovered, setHovered] = useState(false);

  const visionCards = [
    {
      title: "Empowering Data-Driven Decision Making",
      description:
        "We aim to simplify location-based insights through intuitive tools that turn your data into action.",
      image: dataImage,
    },
    {
      title: "Enhancing Transparency & Collaboration",
      description:
        "Our platform fosters trust and collaboration by enabling clear data reporting and shared access.",
      image: collaboration,
    },
    {
      title: "Building Tools for Smarter Cities",
      description:
        "We’re committed to helping communities thrive by making geographic data accessible and impactful.",
      image: smartCity,
    },
  ];
  

  return (
    <div className="px-10 pt-12">
      {/* Centered Timeline */}
      <div className="mb-12 flex justify-center">
        <div className="w-full max-w-3xl">
          <div className="text-6xl font-extrabold pb-4">Feature Release Note</div>
          <div className="text-3xl font-semibold pb-8">  Today is {" "}
  {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
</div>
        <Timeline>
        
{/* Initial Launch */}
<TimelineItem className=''>
  <TimelinePoint icon={MdAddTask}/>
  <TimelineContent>
    <TimelineTime>April 2025</TimelineTime>
    <TimelineTitle>Populus ID Mapping App Launch</TimelineTitle>
    <TimelineBody>
      Initial release of the site with functionality to map Populus ID data and view status updates on the map.
    </TimelineBody>
  </TimelineContent>
  <Button
          href='/datasheets'
            color="light"
            pill
            className="items-center group transition-all duration-300  hover:bg-green-400 dark:hover:bg-green-400"
          >  Learn More
                  <HiArrowNarrowRight className="ml-2 h-3 w-3" />
                </Button>
</TimelineItem>

{/* Feature: Cluster Analysis */}
<TimelineItem>
  <TimelinePoint icon={MdAddTask} />
  <TimelineContent>
    <TimelineTime>May 2025</TimelineTime>
    <TimelineTitle>Cluster Analysis & Heat Mapping</TimelineTitle>
    <TimelineBody>
      Added visual cluster grouping of pins and interactive heatmap overlays to help analyze geographic trends.
    </TimelineBody>
  </TimelineContent>
  <Button
          href='/datasheets'
            color="light"
            pill
            className=" items-center group transition-all duration-300 hover:bg-green-400 dark:hover:bg-green-400"
          >                  Learn More
                  <HiArrowNarrowRight className="ml-2 h-3 w-3" />
                </Button>
</TimelineItem>

{/* Feature: Data Export */}
<TimelineItem>
  <TimelinePoint icon={MdAddTask} />
  <TimelineContent>
    <TimelineTime>May 2025</TimelineTime>
    <TimelineTitle>Download Filtered Results</TimelineTitle>
    <TimelineBody>
      Users can now download filtered results in both Excel and PDF formats.
    </TimelineBody>
  </TimelineContent>
</TimelineItem>

{/* Upcoming: Site Analytics */}
<TimelineItem>
  <TimelinePoint icon={HiCalendar}/>
  <TimelineContent>
    <TimelineTime>Coming Soon</TimelineTime>
    <TimelineTitle>Site Analytics Dashboard</TimelineTitle>
    <TimelineBody>
      Admins will have access to usage metrics, activity logs, and map interaction analytics.
    </TimelineBody>
  </TimelineContent>
</TimelineItem>

{/* Upcoming: Transactions Page */}
<TimelineItem>
  <TimelinePoint icon={HiCalendar} />
  <TimelineContent>
    <TimelineTime>Coming Soon</TimelineTime>
    <TimelineTitle>Admin Transactions Page</TimelineTitle>
    <TimelineBody>
      Track and view user actions, downloads, and transactional events across the platform.
    </TimelineBody>
  </TimelineContent>
</TimelineItem>

{/* Upcoming: Favourites */}
<TimelineItem>
  <TimelinePoint icon={HiCalendar} />
  <TimelineContent>
    <TimelineTime>Coming Soon</TimelineTime>
    <TimelineTitle>User Favourites Feature</TimelineTitle>
    <TimelineBody>
      Users will be able to mark and save favourite map items or searches for quick access.
    </TimelineBody>
  </TimelineContent>
</TimelineItem>

{/* Upcoming: "Your Data" Page */}
<TimelineItem>
  <TimelinePoint icon={HiCalendar} />
  <TimelineContent>
    <TimelineTime>Coming Soon</TimelineTime>
    <TimelineTitle>Your Data Dashboard</TimelineTitle>
    <TimelineBody>
      Personalized view for each user showing uploaded datasets, saved reports, and recent activity.
    </TimelineBody>
  </TimelineContent>
</TimelineItem>

</Timeline>

        </div>
      </div>

      {/* Feature List Cards */}
      <div className="flex justify-center px-6 mt-10">
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
    {visionCards.map((card, index) => (
      <div
        key={index}
        className="flex flex-col items-center group transition-transform duration-300 ease-in-out hover:scale-[1.02] mb-10"
      >
        <Card
          className="w-full min-h-[420px]"
          imgAlt={card.title}
          imgSrc={card.image}
        >
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white text-center">
            {card.title}
          </h5>
          <p className="font-normal text-gray-700 dark:text-gray-400 text-center">
            {card.description}
          </p>
        </Card>
      </div>
    ))}
  </div>
</div>


    </div>
  );
}
