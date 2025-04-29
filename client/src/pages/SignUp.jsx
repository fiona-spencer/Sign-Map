import {
  Label,
  TextInput,
  Button,
  Alert,
  Spinner,
  Select,
  Modal
} from "flowbite-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";
import mapImage from "../assets/map.png";

export default function SignUp() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    profilePicture: 'default',
    userType: '',
  });
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [passwordInput, setPasswordInput] = useState(''); // for user/public password input
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false); // for password creation modal
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSelectChange = (e) => {
    const selectedType = e.target.value;
    setFormData({ ...formData, userType: selectedType });

    // If user/public is selected, show password creation modal
    if (selectedType === "user" || selectedType === "public") {
      setIsPasswordModalOpen(true);
    }

    // If admin is selected, show admin authentication modal
    if (selectedType === "admin") {
      setIsModalOpen(true);
    }
  };

  const handleAdminAuth = () => {
    const correctAdminPassword = process.env.ADMIN_SECRET; // Replace this with the actual SECRET password
    if (adminPasswordInput === correctAdminPassword) {
      setFormData(prev => ({ ...prev, userType: 'admin' }));
      setErrorMessage(null);
      setIsModalOpen(false);
    } else {
      setErrorMessage('Incorrect admin password');
    }
  };

  const handlePasswordCreation = () => {
    if (!passwordInput) {
      setErrorMessage("Please create a password.");
      return;
    }

    // If a password is entered, save it to formData
    setFormData(prev => ({ ...prev, password: passwordInput }));
    setIsPasswordModalOpen(false);
    setErrorMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!formData.username || !formData.email || !formData.password || !formData.userType.trim()) {
      setErrorMessage("Please fill out all fields, including selecting a user type.");
      return;
    }
  
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }
  
    try {
      setLoading(true);
      setErrorMessage(null);
  
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
  
      const data = await res.json();
  
      if (!res.ok || data.success === false) {
        setErrorMessage(data.message || "Signup failed. Please try again.");
        setLoading(false);
        return;
      }
  
      setLoading(false);
      navigate('/signin');
    } catch (error) {
      setErrorMessage("An error occurred while signing up.");
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-[#483929ce] dark:bg-gray-900 flex justify-center items-center'>
      <div className="bg-white dark:bg-gray-800 px-6 pb-6 rounded-lg shadow-lg w-full max-w-lg">
        <Link to='/' className='font-bold text-green-700 dark:text-green-400 text-4xl'>
          <span className='rounded-sm'>
            <img className='mx-auto h-40 mt-6' src={mapImage} alt="City of Toronto" />
          </span>
        </Link>
        <div className="text-lg font-semibold text-green-700 dark:text-green-400 mt-4 text-center">
          Sign Up
        </div>
        <p className='text-md mt-2 text-green-600 dark:text-green-300 text-center'>
          Create a new account by providing your email, username, password, and user type.
        </p>

        <form className="flex flex-col gap-4 mt-5" onSubmit={handleSubmit}>
          {/* Select User Type */}
          <div>
            <Label className="text-gray-700 dark:text-gray-300" value="Select User Type" />
            <Select
              id="userType"
              value={formData.userType}
              onChange={handleSelectChange}
              className="border-green-500 focus:ring-green-500 dark:border-green-400 dark:bg-gray-700 dark:text-white"
            >
              <option value="">-- Select User Type --</option>
              {/* <option value="public">Public</option> */}
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </Select>
          </div>

          <div>
            <Label className="text-gray-700 dark:text-gray-300" value="Your username" />
            <TextInput
              type="text"
              placeholder="Username"
              id="username"
              onChange={handleChange}
              className="border-green-500 focus:ring-green-500 dark:border-green-400 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <Label className="text-gray-700 dark:text-gray-300" value="Your email" />
            <TextInput
              type="email"
              placeholder="name@company.com"
              id="email"
              onChange={handleChange}
              className="border-green-500 focus:ring-green-500 dark:border-green-400 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white hover:bg-gradient-to-l focus:ring-green-300 dark:focus:ring-green-800"
          >
            {loading ? (
              <>
                <Spinner size='sm' />
                <span className="pl-3">Loading...</span>
              </>
            ) : 'Sign Up'}
          </Button>

          {formData.userType && (
            <OAuth userType={formData.userType} />
          )}

          {errorMessage && (
            <Alert className="mt-5" color='failure'>
              {errorMessage}
            </Alert>
          )}
        </form>

        <div className="flex gap-2 text-sm mt-5 text-gray-600 dark:text-gray-300">
          <span>Already have an account?</span>
          <Link to='/signin' className="text-green-600 dark:text-green-400 hover:underline">Sign In</Link>
        </div>
      </div>

      {/* Admin Password Modal */}
      <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Modal.Header>Admin Authentication</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              Please enter the SECRET password to continue.
            </p>
            <TextInput
              type="password"
              placeholder="Enter SECRET password"
              value={adminPasswordInput}
              onChange={(e) => setAdminPasswordInput(e.target.value)}
            />
            {errorMessage && <Alert color="failure">{errorMessage}</Alert>}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleAdminAuth}>Submit</Button>
          <Button
            color="gray"
            onClick={() => {
              setIsModalOpen(false);
              setFormData(prev => ({ ...prev, userType: '' }));
              setAdminPasswordInput('');
              setErrorMessage(null);
            }}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Password Creation Modal (for user/public types) */}
      <Modal show={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)}>
        <Modal.Header>Create a Password</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              Please create a password for your account.
            </p>
            <TextInput
              type="password"
              placeholder="Create your password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
            />
            {errorMessage && <Alert color="failure">{errorMessage}</Alert>}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handlePasswordCreation}>Create Password</Button>
          <Button
            color="gray"
            onClick={() => {
              setIsPasswordModalOpen(false);
              setPasswordInput('');
              setErrorMessage(null);
            }}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
