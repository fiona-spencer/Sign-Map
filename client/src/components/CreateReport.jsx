import React, { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  TextInput,
  Checkbox,
  Select,
} from 'flowbite-react';
import { useSelector } from 'react-redux';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from 'react-router-dom';
import { FaMapPin, FaTimes } from 'react-icons/fa';

export default function CreateReport({ position, onClose, onSubmit, isSubmitting }) {
  const [address, setAddress] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [publishError, setPublishError] = useState(null);
  const [image, setImage] = useState(null);

  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    title: '',
    category: 'default',
    content: '',
    position: { lat: 0, lng: 0 },
    fullName: '',
    name: '',
    email: '',
    phoneNumber: '',
    dateOfIncident: new Date().toISOString().split('T')[0],
    icon: 'default', // You can adjust the default icon as needed
    image: '', // This will hold the image URL after upload
  });

  useEffect(() => {
    if (currentUser) {
      setFormData((prev) => ({
        ...prev,
        fullName: currentUser.username || '',
        name: currentUser.username || '',
        email: currentUser.email || '',
      }));
    }

    if (position && position.lat && position.lng) {
      const fetchAddress = async () => {
        const lat = position.lat();
        const lng = position.lng();
        const apiKey = 'AIzaSyA1wOqcLSGKkhNJQYP9wH06snRuvSJvRJY';
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
              locationName: formatted,
              position: { lat, lng },
            }));
          }
        } catch (error) {
          console.error('Geocoding error:', error);
        }
      };

      fetchAddress();
    }
  }, [currentUser, position]);

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
      location: {
        address: address, // <-- ✅ add this line
        lat: formData.position.lat,
        lng: formData.position.lng,
        info: {
          title: formData.title,
          description: formData.content,
          category: formData.category,
          fullName: formData.fullName,
          name: formData.name,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          dateOfIncident: formData.dateOfIncident,
          icon: formData.icon,
          image: formData.image,
        },
        status: 'pending',
      },
      phoneNumber: formData.phoneNumber,
    };
    
  
    try {
      const res = await fetch('/api/pin/createPin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentUser.token}`, // assuming token is stored in currentUser
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
    <div className="bg-gray-500 bg-opacity-50 flex justify-center items-center z-50 mt-20">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl shadow-xl relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-xl text-gray-600 hover:text-gray-900">
          <FaTimes />
        </button>

        <h3 className="text-xl font-semibold text-center mb-4">Create a Report</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextInput type="text" readOnly value={address} className="bg-gray-100" addon="Address" />
          <TextInput type="text" readOnly value={`${formData.position.lat}, ${formData.position.lng}`} className="bg-gray-100" addon="Lat/Lng" />
          <TextInput type="text" placeholder="Full Name" required value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} />
          <TextInput type="email" placeholder="Email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          <TextInput type="tel" placeholder="Phone Number" required value={formData.phoneNumber} onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} />
          <TextInput type="date" required value={formData.dateOfIncident} onChange={(e) => setFormData({ ...formData, dateOfIncident: e.target.value })} />
          <TextInput type="text" placeholder="Title" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />

          <Select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
            <option value="default">Pin</option>
          </Select>

          <div className="flex items-center mt-4">
            <div className="mr-2">Selected Icon:</div>
            <div className="text-xl"><FaMapPin /></div>
          </div>

          <ReactQuill
            theme="snow"
            placeholder="Enter a description..."
            value={formData.content}
            onChange={(value) => setFormData({ ...formData, content: value })}
            className="h-48 overflow-y-auto text-clip text-sm"
          />

          <div className="flex items-center">
            <Checkbox checked={isVerified} onChange={(e) => setIsVerified(e.target.checked)} id="verify" />
            <label htmlFor="verify" className="ml-2 text-sm">I verify that all the information provided is correct.</label>
          </div>

          <div>
            <input type="file" accept="image/*" onChange={handleImageUpload} className="block w-full text-sm text-gray-700 py-2" />
            {image && (
              <div className="mt-2">
                <img src={image} alt="Preview" className="max-w-xs max-h-48 object-cover" />
              </div>
            )}
          </div>

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
