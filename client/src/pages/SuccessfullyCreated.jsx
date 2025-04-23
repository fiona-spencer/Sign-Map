import React from 'react';
import { Button } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';

export default function SuccessfullyCreated() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
        <FaCheckCircle className="text-green-500 text-5xl mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Report Submitted Successfully!</h2>
        <p className="text-gray-600 mb-6">Thank you for your contribution. Your report has been created and will be reviewed shortly.</p>
        <Button gradientDuoTone="greenToBlue" onClick={() => navigate('/datasheets')}>
          Back to Map
        </Button>
      </div>
    </div>
  );
}
