import { Avatar, Button, Dropdown, Navbar } from 'flowbite-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { signoutSuccess } from '../redux/user/userSlice';
import { toggleTheme } from '../redux/theme/themeSlice';
import { FaMoon, FaSun } from 'react-icons/fa';
import pinImage from '../assets/pin.png';
import { useEffect, useState } from 'react';

export default function Header() {
  const path = useLocation().pathname;
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);

  // Local state to track the toggle button press
  const [isToggled, setIsToggled] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
  }, [location.search]);

  const handleSignout = async () => {
    try {
      const res = await fetch('/api/user/signout', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) console.log(data.message);
      else dispatch(signoutSuccess());
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleToggle = () => {
    // Dispatch theme toggle action
    dispatch(toggleTheme());

    // Set the local state to track the toggle status
    setIsToggled(!isToggled);
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
          color={theme === 'light' ? "dark" : ""}
          className={`w-10 h-10 hidden sm:flex items-center justify-center rounded-full ${
            isToggled ? 'hover:bg-yellow-100 bg-blue-900 bg-white' : 'bg-blue-900 hover:bg-black'
          } text-white `}
          onClick={handleToggle}
        >
          {theme === 'light' ? (
            <FaMoon className="text-blue-100" /> // Moon icon with blue color in light mode
          ) : (
            <FaSun className="text-yellow-400" /> // Sun icon with yellow color in dark mode
          )}
        </Button>

        {/* User Dropdown */}
        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar
                alt="User avatar"
                img={currentUser.profilePicture}
                rounded
                className="w-10 h-10"
              />
            }
          >
            <Dropdown.Header>
              <span className="text-sm font-medium">@{currentUser.username}</span>
              <span className="text-xs text-gray-500 truncate">{currentUser.email}</span>
            </Dropdown.Header>
            <Link to="/dashboard?tab=profile">
              <Dropdown.Item>Profile</Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleSignout}>Sign out</Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to="/signin">
            <Button
              color="light"
              pill
              className="transition hover:bg-emerald-100 text-sm px-4 py-1"
            >
              Sign In
            </Button>
          </Link>
        )}
        <Navbar.Toggle className="text-white hover:text-black" />
      </div>

      {/* Nav Links */}
      <Navbar.Collapse className="mt-3 md:mt-0">
        {[
          { path: '/', label: 'About' },
          { path: '/map', label: 'Map' },
          { path: '/departments', label: 'Data Sheets' },
        ].map(({ path: linkPath, label }) => (
          <Navbar.Link
            key={linkPath}
            as="div"
            active={path === linkPath}
            className={`text-2xl px-4 py-2 rounded-md transition-all ${
              isToggled
                ? ''
                : path === linkPath
                ? 'bg-orange-400 text-white' // active state (clicked)
                : 'text-white hover:bg-orange-400 dark:hover:bg-orange-400' // default and hover states, with dark mode hover
            }`}
          >
            <Link
              to={linkPath}
              className={`no-underline text-inherit focus:outline-none text-2xl px-4 py-2 rounded-md transition-all
                ${path === linkPath ? 'bg-orange-400 text-white' : ''} // active state (clicked)
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
