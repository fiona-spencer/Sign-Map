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

// Import Icons
import { FaFireExtinguisher, FaTaxi, FaPlug, FaSkullCrossbones, FaDog, FaBuilding, FaLandmark, FaRegTrashAlt, FaWater, FaWineBottle, FaTree, FaSnowflake, FaBug, FaTimes } from 'react-icons/fa';

export default function CreateReport({ position, onClose, onSubmit, isSubmitting }) {
  const [address, setAddress] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [publishError, setPublishError] = useState(null);
  const [image, setImage] = useState(null); // State to hold the uploaded image

  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    title: '',
    category: 'fire', // default category
    content: '',
    locationName: '',
    position: { lat: 0, lng: 0 }, // Default position if no valid position is provided
    fullName: '',
    name: '',
    email: '',
    phoneNumber: '',
    severity: 5,
    dateOfIncident: '',
  });

  // Define icon mapping based on categories
  const categoryIcons = {
    fire: <FaFireExtinguisher />,
    ttc: <FaTaxi />,
    hydro: <FaPlug />,
    poison: <FaSkullCrossbones />,
    animal: <FaDog />,
    building: <FaBuilding />,
    parks: <FaLandmark />,
    garbage: <FaRegTrashAlt />,
    water: <FaWater />,
    graffiti: <FaWineBottle />,
    tree: <FaTree />,
    snow: <FaSnowflake />,
    health: <FaBug />,
  };

  // Fetch address based on lat/lng
  useEffect(() => {
    if (currentUser) {
      console.log('Current User:', currentUser);
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
    } else {
      console.warn('Position is not available or invalid');
    }
  }, [currentUser, position]); // Only run when `currentUser` or `position` changes

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file)); // Preview the image
      setFormData({ ...formData, image: file }); // Save the file in the form data
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isVerified) {
      setPublishError('Please verify your submission.');
      return;
    }

    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      if (key !== 'image') {
        formDataToSend.append(key, formData[key]);
      }
    });
    if (formData.image) {
      formDataToSend.append('image', formData.image);
    }

    try {
      const res = await fetch('/api/report/create', {
        method: 'POST',
        body: formDataToSend,
      });

      const text = await res.text();
      console.log('Response Text:', text);

      let data = {};
      if (text) {
        try {
          data = JSON.parse(text);
        } catch (error) {
          throw new Error('Invalid JSON response from server');
        }
      }

      if (!res.ok) {
        setPublishError(data.message || 'Server error occurred');
        return;
      }

      setPublishError(null);
      navigate(`/submitreport`);
    } catch (error) {
      console.error('Error submitting report:', error);
      setPublishError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="bg-gray-500 bg-opacity-50 flex justify-center items-center z-50 mt-20">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl shadow-xl relative">
        {/* Close Button (X) */}
        <button 
          onClick={onClose} 
          className="absolute top-2 right-2 text-xl text-gray-600 hover:text-gray-900"
        >
          <FaTimes />
        </button>

        <h3 className="text-xl font-semibold text-center mb-4">Create a Report</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextInput type="text" readOnly value={address} className="bg-gray-100" addon="Address" />
          <TextInput type="text" readOnly value={`${formData.position.lat}, ${formData.position.lng}`} className="bg-gray-100" addon="Lat/Lng" />
          <TextInput type="text" placeholder="Full Name" required value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} />
          <TextInput type="email" placeholder="Email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          <TextInput type="tel" placeholder="Phone Number" required value={formData.phoneNumber} onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} />
          <TextInput type="number" placeholder="Severity (1–10)" min={1} max={10} required value={formData.severity} onChange={(e) => setFormData({ ...formData, severity: parseInt(e.target.value) })} />
          <TextInput type="date" required value={formData.dateOfIncident} onChange={(e) => setFormData({ ...formData, dateOfIncident: e.target.value })} />
          <TextInput type="text" placeholder="Title" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
          
          {/* Category Dropdown */}
          <Select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
            <option value="fire">Fire/Ambulance</option>
            <option value="ttc">TTC</option>
            <option value="hydro">Hydro</option>
            <option value="poison">Poison Centre</option>
            <option value="animal">Animal Services</option>
            <option value="building">Building Permits</option>
            <option value="parks">Parks & Recreation</option>
            <option value="garbage">Waste Collection</option>
            <option value="water">Water Main</option>
            <option value="graffiti">Graffiti Removal</option>
            <option value="tree">Tree Maintenance</option>
            <option value="health">Public Health</option>
            <option value="snow">Snow Removal</option>
          </Select>

          {/* Icon Preview */}
          <div className="flex items-center mt-4">
            <div className="mr-2">Selected Icon: </div>
            <div className="text-xl">{categoryIcons[formData.category]}</div>
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

          {/* File Upload Section */}
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
