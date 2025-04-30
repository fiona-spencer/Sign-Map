import React, { useState } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { fetchLatLng } from "../../../api/utils/geocoding";


export default function CreatePinsFromFile({
  parsedPins,
  fileTitle,
  currentUser,
  setIsLoading,
  onSuccess,
  onError,
}) {
  const [progress, setProgress] = useState(0);

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const createPin = async (dataToSend) => {
    if (dataToSend.location.lat === 0 && dataToSend.location.lng === 0) {
      try {
        const { lat, lng } = await fetchLatLng(dataToSend.location.address);
        dataToSend.location.lat = lat;
        dataToSend.location.lng = lng;
      } catch (err) {
        throw new Error(`Geocoding failed for address: ${dataToSend.location.address}`);
      }
    }
  
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
  

  const createPinsInBatch = async (pinsToCreate) => {
    try {
      const results = await Promise.all(
        pinsToCreate.map((pin) => createPin(pin))
      );
      return results;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const handleSubmit = async () => {
    let successCount = 0;
    let failCount = 0;
    const batchSize = 50; // number of pins to process in each batch

    setIsLoading(true);

    for (let i = 0; i < parsedPins.length; i += batchSize) {
      const batch = parsedPins.slice(i, i + batchSize);
      const dataToSendBatch = batch.map((pin) => ({
        createdBy: {
          userName: currentUser?.username,
          email: currentUser?.email,
        },
        location: {
          ...pin.location,
          info: {
            ...pin.location.info,
            fileName: fileTitle,
          },
          status: 'pending',
        },
      }));

      try {
        // Process each batch of pins
        await createPinsInBatch(dataToSendBatch);
        successCount += batch.length;
        console.log(`✅ Successfully created ${successCount}/${parsedPins.length}`);
      } catch (error) {
        failCount += batch.length;
        console.error(`❌ Failed to create batch ${i / batchSize + 1}:`, error.message);
      }

      setProgress(Math.round(((i + batchSize) / parsedPins.length) * 100));
      await delay(700); // adjust to ~0.7 seconds to avoid rate-limiting
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
