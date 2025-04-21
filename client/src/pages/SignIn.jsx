import { Label, TextInput, Button, Alert, Spinner } from "flowbite-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInStart, signInSuccess, signInFailure } from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import mapImage from "../assets/map.png";
import OAuth from "../components/OAuth";

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error: errorMessage } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return dispatch(signInFailure('Please fill all the fields'));
    }
    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
      }

      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate('/map', { state: { successMessage: 'Your report has been successfully submitted!' } });
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className='min-h-screen bg-[#489856ce] dark:bg-gray-900 flex justify-center items-center'>
      <div className="bg-white dark:bg-gray-800 px-6 pb-6 rounded-lg shadow-lg w-full max-w-lg">
        
        {/* Logo and Title */}
        <Link to='/' className='font-bold text-green-700 dark:text-green-400 text-4xl'>
          <span className='rounded-sm'>
            <img 
              className='mx-auto h-40 mt-6'
              src={mapImage}
              alt="City of Toronto" 
            />
          </span>
        </Link>
        <div className="text-lg font-semibold text-green-700 dark:text-green-400 text-center mt-2">
          TO ISSUE A REPORT
        </div>
        <p className='text-md text-green-600 dark:text-green-300 text-center'>
          Sign in with your email and password or with Google.
        </p>

        {/* Sign In Form */}
        <form className="flex flex-col gap-4 mt-5" onSubmit={handleSubmit}>
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
              placeholder="********" 
              id="password" 
              onChange={handleChange} 
              className="border-green-500 focus:ring-green-500 dark:border-green-400 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Sign In Button */}
          <Button 
            type="submit" 
            disabled={loading} 
            className="bg-gradient-to-r from-green-500 to-green-600 text-white hover:bg-gradient-to-l focus:ring-green-300 dark:focus:ring-green-800"
          >
            {
              loading ? (
                <>
                  <Spinner size='sm' />
                  <span className="pl-3">Loading...</span>
                </>
              ) : 'Sign In'
            }
          </Button>

          {/* OAuth */}
          <OAuth />

          {/* Error Message */}
          {
            errorMessage && (
              <Alert className="mt-5" color='failure'>
                {errorMessage}
              </Alert>
            )
          }
        </form>

        {/* Sign Up Link */}
        <div className="flex gap-2 text-sm mt-5 text-gray-600 dark:text-gray-300">
          <span>Don't have an account?</span>
          <Link to='/signup' className="text-green-600 dark:text-green-400 hover:underline">Sign Up</Link>
        </div>
      </div>
    </div>
  );
}
