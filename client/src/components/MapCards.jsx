import React, { useState } from 'react';
import { Card, Modal } from 'flowbite-react';

//Images
import mapPins from '../assets/mapPins.png'
import createReport from '../assets/CreateReport.png'
import filterMap from '../assets/filterMap.png'
import spreedsheet from '../assets/spreedsheet.png'
import clickImage from '../assets/clickImage.png'
import cluster from '../assets/cluster.png'


//Videos
import searchVideo from '../assets/videos/search.mov'
import reportVideo from '../assets/videos/createReport.mov'
import clickVideo from '../assets/videos/click.mov'
import filterVideo from '../assets/videos/filter.mov'
import datasheetVideo from '../assets/videos/datasheet.mov'
import clusterVideo from '../assets/videos/clusterPdf.mov'


export default function MapCards() {
  const [hovered, setHovered] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeVideo, setActiveVideo] = useState(null);
  const [cards, setCards] = useState([
    {
      imgSrc: mapPins,
      title: 'Search and View Map',
      videoSrc: searchVideo,
      content: 'Dynamically view your data on the map with corresponding pins colours. Use google map to search addresses'
    },
    {
      imgSrc: createReport,
      title: 'Create a Report',
      videoSrc: reportVideo,
      content: 'Pin a report on the map by clicking on the map or searching up an address.'
    },
    {
      imgSrc: filterMap,
      title: 'Filter the Pins and Map',
      videoSrc: filterVideo,
      content: 'Dynamically filter pin result by: Status, Name Email, Phone Number, Postal Code, Street Name, and more ...'
    },
    {
      imgSrc: clickImage,
      title: 'Click Pin for More Info',
      videoSrc: clickVideo,
      content: 'Click on a specific pin to open a get a more detailed review'
    },
    {
      imgSrc: spreedsheet,
      title: 'Dynamic Datasheet',
      videoSrc: datasheetVideo,
      content: 'View your filtered results in a downloadable spreed sheet'
    },
    {
      imgSrc: cluster,
      title: 'Cluster Data and Export',
      videoSrc: clusterVideo,
      content: 'View your filtered dataset by clusters of area distance or postal code. Download the map and clustered results as a PDF'
    }
  ]);

  const handleChange = (index, field, value) => {
    const updatedCards = [...cards];
    updatedCards[index][field] = value;
    setCards(updatedCards);
  };

  const handleVideoClick = (videoSrc) => {
    setActiveVideo(videoSrc);
    setModalOpen(true);
  };

  return (
    <>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
      {cards.map((card, index) => (
        <div
          key={index}
          className="group"
          onMouseEnter={() => setHovered(index)}
          onMouseLeave={() => setHovered(null)}
        >
<Card className="transition-transform duration-300 ease-in-out group-hover:scale-[1.02] md:min-h-[390px]">
  <img
    src={card.imgSrc}
    alt="Card image"
    className="w-full min-h-[200px] h-48 object-cover rounded-md"
  />
 <p
  className="font-bold text-2xl text-gray-900 dark:text-white bg-transparent border-none w-full focus:outline-none"
>
  {card.title}
</p>


<p className="font-normal text-gray-700 dark:text-gray-400 bg-transparent w-full">
  {card.content}
</p>

</Card>



          {/* Hover section for extra controls or info */}
          <div
  className={`overflow-hidden transition-all duration-300 ease-in-out ${
    hovered === index ? 'max-h-full opacity-100 mt-4 mb-10' : 'max-h-0 opacity-0'
  } w-full bg-[#13805186] p-2 rounded-lg shadow-md dark:bg-gray-800`}
>
  {/* Video Preview (optional, static video for now) */}
  <video
  className="w-full rounded flex"
  muted
  autoPlay
  loop
  src={card.videoSrc}
  onClick={() => handleVideoClick(card.videoSrc)}
>
  Your browser does not support the video tag.
</video>

</div>

        </div>
      ))}

      
    </div>
{/* Modal for Enlarged Video */}
<Modal show={modalOpen} onClose={() => setModalOpen(false)} size="6xl">
        <Modal.Header className='bg-[#8b89892b]'>
          <span className="text-lg font-semibold">Video Preview</span>
        </Modal.Header>
        <Modal.Body className='bg-gray-800'>
          <div className="flex justify-center">
            <video
              src={activeVideo}
              autoPlay
              loop
              muted
              className="w-full max-w-6xl rounded-lg"
            />
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
