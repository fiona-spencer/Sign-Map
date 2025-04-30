import React, { useState } from 'react';
import { Card, Modal } from 'flowbite-react';
import previewImage from '../assets/preview.png';
import uploadFile from '../assets/uploadFile.png';
import submitFile from '../assets/submit.png';

// Placeholder video
import previewVideo from '../assets/videos/previewFile.mov'
import uploadFileVideo from '../assets/videos/uploadFile.mov'
import submitFileVideo from '../assets/videos/moveToMap.mov'

export default function FileCards() {
  const [hovered, setHovered] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeVideo, setActiveVideo] = useState(null);

  const cards = [
    {
      imgSrc: previewImage,
      title: 'Preview a File',
      content: 'Preview your dataset to confirm configuration is correct before uploading',
      videoSrc: previewVideo
    },
    {
      imgSrc: uploadFile,
      title: 'Upload a File',
      content: 'Upload a file in JSON, CSV, or Excel (.xlsx). Convert address to coordinate pins on a dynamic map with your data',
      videoSrc: uploadFileVideo
    },
    {
      imgSrc: submitFile,
      title: 'Submit Data to Map',
      content: 'Send data to the dynamic map to view, submitted data will have a default status of "pending" for admin approval',
      videoSrc: submitFileVideo
    }
  ];

  const handleVideoClick = (videoSrc) => {
    setActiveVideo(videoSrc);
    setModalOpen(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4 mb-10">
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
              <p className="font-bold text-2xl text-gray-900 dark:text-white bg-transparent border-none w-full focus:outline-none">
                {card.title}
              </p>
              <p className="font-normal text-gray-700 dark:text-gray-400 bg-transparent w-full">
                {card.content}
              </p>
            </Card>

            {/* Hover Video Preview */}
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                hovered === index ? 'max-h-full opacity-100 mt-4 mb-10' : 'max-h-0 opacity-0'
              } w-full bg-[#13805186] p-2 rounded-lg shadow-md dark:bg-gray-800`}
            >
              <video
                className="w-full rounded flex cursor-pointer"
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
        <Modal.Header className="bg-[#8b89892b]">
          <span className="text-lg font-semibold">Video Preview</span>
        </Modal.Header>
        <Modal.Body className="bg-gray-800">
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
