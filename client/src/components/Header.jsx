import { Button, Navbar, Dropdown } from 'flowbite-react'; // Import Dropdown from Flowbite
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { signoutSuccess } from '../redux/user/userSlice';
import { toggleTheme } from '../redux/theme/themeSlice';
import { FaMoon, FaSun } from 'react-icons/fa';
import pinImage from '../assets/pin.png';
import { Avatar } from 'flowbite-react'; // Import Avatar component
import { useEffect, useState } from 'react';

export default function Header() {
  const location = useLocation();  // Get the current path
  const dispatch = useDispatch();
  const navigate = useNavigate(); // To navigate after sign out
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);

  // Local state to track the toggle button press
  const [isToggled, setIsToggled] = useState(false);

  const handleToggle = () => {
    // Dispatch theme toggle action
    dispatch(toggleTheme());
    // Set the local state to track the toggle status
    setIsToggled(!isToggled);
  };

  // Determine button color based on the current path
  const getButtonColor = () => {
    if (location.pathname === '/signin') {
      return ' text-green-100 bg-green-800 hover:bg-green-700'; // Blue color for Sign In page
    }
    if (location.pathname === '/signup') {
      return 'text-green-800 bg-green-200 hover:bg-green-700'; // Green color for Sign Up page
    }
    return 'bg-green-600 hover:bg-green-700'; // Default color
  };

  // Handle sign out
  const handleSignOut = () => {
    dispatch(signoutSuccess());  // Dispatch sign out action
    navigate('/signin');  // Redirect to Sign In page after signout
  };

  return (
    <Navbar
      fluid
      rounded
      className={`border-b shadow-md px-4 py-4 ${
        theme === 'dark'
          ? 'bg-gray-900 text-white border-gray-800'
          : 'bg-green-700 text-white border-green-900'
      }`}
    >
      {/* Brand */}
      <Link to="/" className="flex items-center gap-3 text-2xl font-semibold">
        <img src={pinImage} alt="City of Toronto" className="h-10 animate-dropPin" />
        <span>Drop a Pin</span>
      </Link>

      {/* Right section */}
      <div className="flex items-center gap-4 md:order-2">
        {/* Theme toggle button */}
        <Button
          color={theme === 'light' ? 'dark' : ''}
          className={`w-10 h-10 hidden sm:flex items-center justify-center rounded-full ${
            isToggled ? 'hover:bg-yellow-100 bg-blue-900 bg-white' : 'bg-blue-900 hover:bg-black'
          } text-white`}
          onClick={handleToggle}
        >
          {theme === 'light' ? (
            <FaMoon className="text-blue-100" /> // Moon icon with blue color in light mode
          ) : (
            <FaSun className="text-yellow-400" /> // Sun icon with yellow color in dark mode
          )}
        </Button>

        

        {/* Avatar and Dropdown if User is Logged In */}

{currentUser ? (
  <Dropdown
    arrowIcon={false}
    inline
    label={
      <Avatar
        alt="user"
        img={currentUser.profilePicture || '/default-avatar.png'}
        rounded
        className="w-10 h-10"
      />
    }
  >
    <div className="px-4 py-3">
      <span className="block text-sm font-medium text-gray-900 dark:text-white">
        {currentUser.username}
      </span>
      <span className="block text-sm text-gray-500 dark:text-gray-400">
        {currentUser.userType}
      </span>
    </div>
    <Dropdown.Divider />
    <Dropdown.Item onClick={() => navigate("/profile")}>Profile</Dropdown.Item>
    <Dropdown.Item onClick={() => navigate("/settings")}>Settings</Dropdown.Item>
    <Dropdown.Item onClick={handleSignOut} className='text-white bg-red-500 font-bold'>Sign out</Dropdown.Item>
  </Dropdown>
        ) : (
          // Sign In / Sign Up Button if user is not logged in
          <Link to={location.pathname === '/signin' ? '/signup' : '/signin'}>
            <Button
              className={`transition text-sm px-4 py-1 rounded-md text-white ${getButtonColor()}`}
            >
              {location.pathname === '/signin' ? 'Sign Up' : 'Sign In'}
            </Button>
          </Link>
        )}

        <Navbar.Toggle className="text-white hover:text-black" />
      </div>

      {/* Nav Links */}
      <Navbar.Collapse className="mt-3 md:mt-0">
        {[
          { path: '/', label: 'Home' },
          { path: '/report', label: 'Info' },
          { path: '/datasheets', label: 'Map' },
        ].map(({ path: linkPath, label }) => (
          <Navbar.Link
            key={linkPath}
            as="div"
            active={location.pathname === linkPath}
            className={`text-2xl px-4 py-2 rounded-md transition-all ${
              isToggled
                ? ''
                : location.pathname === linkPath
                ? 'bg-orange-400 text-white' // active state (clicked)
                : 'text-white hover:bg-orange-400 dark:hover:bg-orange-400' // default and hover states, with dark mode hover
            }`}
          >
            <Link
              to={linkPath}
              className={`no-underline text-inherit focus:outline-none text-2xl px-4 py-2 rounded-md transition-all
                ${location.pathname === linkPath ? 'bg-orange-400 text-white' : ''} // active state (clicked)
                text-white hover:bg-orange-400 dark:hover:bg-orange-400`} // default and hover states, with dark mode hover
            >
              {label}
            </Link>
          </Navbar.Link>
        ))}
      </Navbar.Collapse>
    </Navbar>
  );
}
