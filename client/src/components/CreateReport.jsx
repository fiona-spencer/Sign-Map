import React, { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  TextInput,
  Checkbox
} from 'flowbite-react';
import { useSelector } from 'react-redux';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from 'react-router-dom';
import { FaMapPin, FaTimes } from 'react-icons/fa';

export default function CreateReport({ apiKey, location, onClose, onSubmit, isSubmitting }) {
  const [address, setAddress] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [publishError, setPublishError] = useState(null);
  const [image, setImage] = useState(null);
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    email: '',
    userName: '',
    location: { lat: 0, lng: 0 },
    address: '',
    description: '',
    icon: 'default',
    image: '',
    populusId: '',
    contactName: '', // Added contactName field
    contactEmail: '',
    contactPhoneNumber: '',
    assigned: ''
  });

  useEffect(() => {
    if (currentUser) {
      setFormData((prev) => ({
        ...prev,
        email: currentUser.email || '',
        userName: currentUser.username || '',
      }));
    }

    if (location && location.lat && location.lng) {
      const fetchAddress = async () => {
        const lat = location.lat();
        const lng = location.lng();
        try {
          const res = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
          );
          const data = await res.json();
          if (data.status === 'OK') {
            const formatted = data.results[0]?.formatted_address || '';
            setAddress(formatted);
            setFormData((prev) => ({
              ...prev,
              address: formatted,
              location: { lat, lng },
            }));
          }
        } catch (error) {
          console.error('Geocoding error:', error);
        }
      };

      fetchAddress();
    }
  }, [currentUser, location]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setFormData({ ...formData, image: file });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isVerified) {
      setPublishError('Please verify your submission.');
      return;
    }

    const dataToSend = {
      createdBy: {
        userName: formData.userName,
        email: formData.email
      },
      location: {
        address: formData.address,
        lat: formData.location.lat,
        lng: formData.location.lng,
        info: {
          description: formData.description,
          icon: formData.icon,
          image: formData.image,
          populusId: formData.populusId,
          contactName: formData.contactName, // Added contactName to the data
          contactEmail: formData.contactEmail,
          contactPhoneNumber: formData.contactPhoneNumber,
          assigned: formData.assigned,
          fileName: "System"
        },
        status: 'pending',
      }
    };

    try {
      const res = await fetch('/api/pin/createPin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentUser.token}`,
        },
        body: JSON.stringify(dataToSend),
      });

      const data = await res.json();

      if (!res.ok) {
        setPublishError(data.message || 'Server error occurred');
        return;
      }

      setPublishError(null);
      navigate(`/successfullyCreated`);
    } catch (error) {
      console.error('Error submitting pin:', error);
      setPublishError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="bg-opacity-50 flex justify-center items-center z-50 mt-20">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg w-full max-w-2xl shadow-xl relative text-gray-900 dark:text-white">
        <button onClick={onClose} className="absolute top-2 right-2 text-xl text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
          <FaTimes />
        </button>

        <h3 className="text-xl font-semibold text-center mb-4">Create a Report</h3>
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* User Info */}
          <div className=" border-b pb-4">
            <h4 className="text-lg font-semibold flex justify-center m-2">User Info</h4>
            <TextInput
              type="email"
              readOnly
              value={formData.email}
              addon="Email"
              className="dark:bg-gray-700 dark:text-white mb-2"
            />
            <TextInput
              type="text"
              readOnly
              value={formData.userName}
              addon="Name"
              className="dark:bg-gray-700 dark:text-white"
            />
          </div>

       

          {/* Location Info */}
          <div className="border-b pb-4">
          <div className="flex m-2 justify-center items-center">
            <h4 className="text-lg font-semibold px-2">Location Info</h4>
              <div className="text-xl text-white bg-red-600 p-2 rounded-lg"><FaMapPin /></div>
            </div>
            <TextInput
              type="text"
              readOnly
              value={formData.address}
              addon="Address"
              className="dark:bg-gray-700 dark:text-white mb-2"
            />
            <TextInput
              type="text"
              readOnly
              value={`${formData.location.lat}, ${formData.location.lng}`}
              
              addon="Lat/Lng"
              className="dark:bg-gray-700 dark:text-white"
            />
          </div>

   {/* Contact Info */}
   <div className="border-b pb-4">
            <h4 className="text-lg font-semibold flex justify-center m-2">Contact Info</h4>
            <TextInput
              type="text"
              value={formData.contactName}
              onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
              placeholder="Contact Name"
              className="dark:bg-gray-700 dark:text-white mb-2"
            />
            
            <TextInput
              type="email"
              value={formData.contactEmail}
              onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
              placeholder="Contact Email"
              className="dark:bg-gray-700 dark:text-white mb-2"
            />
            <TextInput
              type=""
              value={formData.contactPhoneNumber}
              onChange={(e) => setFormData({ ...formData, contactPhoneNumber: e.target.value })}
              placeholder="Contact Phone Number (xxx-xxx-xxxx)"
              className="dark:bg-gray-700 dark:text-white mb-2"
            />
            <TextInput
              type="text"
              value={formData.populusId}
              onChange={(e) => setFormData({ ...formData, populusId: e.target.value })}
              placeholder="Populus ID"
              className="dark:bg-gray-700 dark:text-white mb-2"
            />
            <TextInput
              type="text"
              value={formData.assigned}
              onChange={(e) => setFormData({ ...formData, assigned: e.target.value })}
              placeholder="Assigned To"
              className="dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Description */}
          <ReactQuill
            theme="snow"
            placeholder="Enter description..."
            value={formData.description}
            onChange={(value) => setFormData({ ...formData, description: value })}
            className="h-48 overflow-y-auto mt-2"
          />

          {/* Verification */}
          <div className="flex items-center">
            <Checkbox checked={isVerified} onChange={(e) => setIsVerified(e.target.checked)} id="verify" />
            <label htmlFor="verify" className="ml-2 text-sm dark:text-gray-300">
              I verify that all the information provided is correct.
            </label>
          </div>

          {/* Image Upload */}
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="block w-full text-sm text-gray-700 dark:text-gray-300 py-2"
            />
            {image && (
              <div className="mt-2">
                <img src={image} alt="Preview" className="max-w-xs max-h-48 object-cover rounded" />
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="flex gap-4 justify-between">
            <Button onClick={onClose} color="gray" outline>Cancel</Button>
            <Button type="submit" disabled={isSubmitting} gradientDuoTone="greenToBlue">
              {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </Button>
          </div>

          {publishError && <Alert color="failure" className="mt-2">{publishError}</Alert>}
        </form>
      </div>
    </div>
  );
}
