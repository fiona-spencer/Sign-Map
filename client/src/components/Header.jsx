import { Avatar, Button, Dropdown, Navbar } from 'flowbite-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { signoutSuccess } from '../redux/user/userSlice';
import { useEffect, useState } from 'react';

export default function Header() {
  const path = useLocation().pathname;
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
  }, [location.search]);

  const handleSignout = async () => {
    try {
      const res = await fetch('/api/user/signout', {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <Navbar className='border-b-2 bg-[#87b5d6]'>
      <Link
        to='/'
        className='self-center whitespace-nowrap sm:text-2xl md:text-3xl lg:text-4xl md:py-4 lg:py-6 font-semibold dark:text-white m-4'
      >
        <span className=' px-4 py-5 bg-gradient-to-r from-blue-900 via-blue-600 to-blue-600 rounded-md text-white'>
          <img
            className='inline-grid h-10 mb-3'
            src="https://www.toronto.ca/wp-content/themes/cot/img/logo.svg"
            alt="City of Toronto"
          />
        </span>
        &nbsp;Report Application
      </Link>

      <div className='flex gap-2 md:order-2'>
        {/* User Dropdown or Sign In Button */}
        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar alt='user' img={currentUser.profilePicture} rounded sx={{ width: 1, height: 80 }}/>
            }
          >
            <Dropdown.Header>
              <span className='block text-sm'>@{currentUser.username}</span>
              <span className='block text-sm font-medium truncate'>
                {currentUser.email}
              </span>
            </Dropdown.Header>
            <Link to={'/dashboard?tab=profile'}>
              <Dropdown.Item>Profile</Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleSignout}>Sign out</Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to='/signin'>
            <Button color="blue" outline>
              Sign In
            </Button>
          </Link>
        )}
      </div>

      <Navbar.Toggle />

      <Navbar.Collapse>
        <Navbar.Link active={path === '/'} as={'div'} className='lg:text-2xl font-extrabold'>
          <Link to='/'>
            Info
          </Link>
        </Navbar.Link>
        <Navbar.Link active={path === '/map'} as={'div'} className='lg:text-2xl font-extrabold'>
          <Link to='/map'>
            Map
          </Link>
        </Navbar.Link>
        <Navbar.Link active={path === '/departments'} as={'div'} className='lg:text-2xl font-extrabold'>
          <Link to='/departments'>
            Departments
          </Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
