import React, { useState } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function CreatePinsFromFile({ parsedPins, fileTitle, currentUser, setIsLoading, onSuccess, onError }) {
  const [progress, setProgress] = useState(0);

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const createPin = async (dataToSend) => {
    const res = await fetch('/api/pin/createPin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${currentUser.token}`,
      },
      body: JSON.stringify(dataToSend),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create pin');
    return data;
  };

  const handleSubmit = async () => {
    let successCount = 0;
    let failCount = 0;
    setIsLoading(true);

    for (let i = 0; i < parsedPins.length; i++) {
      const pin = parsedPins[i];
      const dataToSend = {
        createdBy: {
          userName: currentUser?.username,
          userEmail: currentUser?.email,
        },
        location: {
          ...pin.location,
          info: {
            ...pin.location.info,
            fileName: fileTitle,
          },
          status: 'pending',
        },
      };

      try {
        await createPin(dataToSend);
        successCount++;
      } catch (error) {
        console.error(`❌ Failed to create pin ${i + 1}:`, error.message);
        failCount++;
      }

      setProgress(Math.round(((i + 1) / parsedPins.length) * 100));
      await delay(700); // adjust to ~0.7 seconds
    }

    setIsLoading(false);
    if (failCount === 0) {
      onSuccess?.();
    } else {
      onError?.(`${failCount} out of ${parsedPins.length} pins failed.`);
    }
  };

  return (
    <div className="flex items-center gap-4 mt-6">
      <div className="w-16 h-16">
        <CircularProgressbar value={progress} text={`${progress}%`} />
      </div>
      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        disabled={progress > 0 && progress < 100}
      >
        {progress > 0 && progress < 100 ? 'Uploading...' : 'Submit'}
      </button>
    </div>
  );
}
