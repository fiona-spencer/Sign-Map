import { Label, TextInput, Button, Alert, Spinner, Select } from "flowbite-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";  // OAuth component will use userType
import mapImage from "../assets/map.png";

export default function SignUp() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    userType: '', // Will be used to send to backend during sign-up
  });
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSelectChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, email, password, userType } = formData;

    // Ensure all fields are filled, including userType
    if (!username || !email || !password || !userType) {
      setErrorMessage("Please fill out all fields, including selecting a user type.");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);

      // Send sign-up request to the backend
      const res = await fetch('api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData), // Send all form data including userType
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        setErrorMessage(data.message || "Signup failed. Please try again.");
        setLoading(false);
        return;
      }

      setLoading(false);
      navigate('/signin'); // Redirect to sign-in page after successful signup
    } catch (error) {
      setErrorMessage("An error occurred while signing up.");
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-green-700 dark:bg-gray-900 flex justify-center items-center'>
      <div className="bg-white dark:bg-gray-800 px-6 pb-6 rounded-lg shadow-lg w-full max-w-lg">
        {/* Logo and Title */}
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

        {/* Sign Up Form */}
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
              <option value="public">Public</option>
              <option value="user">User</option>
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
          <div>
            <Label className="text-gray-700 dark:text-gray-300" value="Your password" />
            <TextInput
              type="password"
              placeholder="Password"
              id="password"
              onChange={handleChange}
              className="border-green-500 focus:ring-green-500 dark:border-green-400 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Submit Button */}
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

          {/* Conditionally Render OAuth */}
          {formData.userType && (
            <OAuth userType={formData.userType} />  
          )}

          {/* Error Message */}
          {errorMessage && (
            <Alert className="mt-5" color='failure'>
              {errorMessage}
            </Alert>
          )}
        </form>

        {/* Sign In Link */}
        <div className="flex gap-2 text-sm mt-5 text-gray-600 dark:text-gray-300">
          <span>Already have an account?</span>
          <Link to='/signin' className="text-green-600 dark:text-green-400 hover:underline">Sign In</Link>
        </div>
      </div>
    </div>
  );
}
