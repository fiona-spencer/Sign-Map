import React, { useState } from 'react';
import { Card } from 'flowbite-react';
import CNTower from '../assets/CNTower.jpg'; // or use a placeholder
import paiImage from '../assets/pai.jpg'
import previewImage from '../assets/preview.png'
import uploadFile from '../assets/uploadFile.png'
import submitFile from '../assets/submit.png'
import JsonUpload from './json_upload';

export default function FileCards() {
  const [hovered, setHovered] = useState(null);
  const [cards, setCards] = useState([
    {
      imgSrc: previewImage,
      title: 'Preview a File',
      content: 'Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.'
    },
    {
      imgSrc: uploadFile,
      title: 'Upload a File',
      content: 'Second card content goes here. You can update this too.'
    },
    {
      imgSrc: submitFile,
      title: 'Submit Data to Map',
      content: 'Second card content goes here. You can update this too.'
    }
  ]);

  const handleChange = (index, field, value) => {
    const updatedCards = [...cards];
    updatedCards[index][field] = value;
    setCards(updatedCards);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      {cards.map((card, index) => (
        <div
          key={index}
          className="group"
          onMouseEnter={() => setHovered(index)}
          onMouseLeave={() => setHovered(null)}
        >
<Card className="transition-transform duration-300 ease-in-out group-hover:scale-[1.02]">
  <img
    src={card.imgSrc}
    alt="Card image"
    className="w-full h-56 object-cover rounded-md"
  />
  <input
    type="text"
    value={card.title}
    onChange={(e) => handleChange(index, 'title', e.target.value)}
    className="font-bold text-2xl text-gray-900 dark:text-white bg-transparent border-none w-full focus:outline-none mt-2 text-wrap"
  />
  <textarea
    value={card.content}
    onChange={(e) => handleChange(index, 'content', e.target.value)}
    className="font-normal text-gray-700 dark:text-gray-400 bg-transparent border-none w-full focus:outline-none"
    rows={3}
  />
</Card>



          {/* Hover section for extra controls or info */}
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              hovered === index ? 'max-h-40 opacity-100 mt-4' : 'max-h-0 opacity-0'
            } w-full bg-white p-4 rounded-lg shadow-md dark:bg-gray-800`}
          >
            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
              Change Image URL
            </label>
            <input
              type="text"
              value={card.imgSrc}
              onChange={(e) => handleChange(index, 'imgSrc', e.target.value)}
              className="p-2 w-full rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Enter image URL"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
