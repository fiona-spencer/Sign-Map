import React from 'react';
import AllPins from '../components/AllPins';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button } from 'flowbite-react';

export default function SearchPage() {
  const { currentUser } = useSelector((state) => state.user);
  const hasAccess = currentUser?.userType === 'admin' || currentUser?.userType === 'user';

  return (
    <div>
      {!hasAccess && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50 text-white text-center p-8">
          <div>
            <h2 className="text-3xl font-bold mb-4">Access Restricted</h2>
            <p className="text-lg">
              You do not have permission to access this page, please create an account.
            </p>
            <Link to="/signup">
              <Button className="w-full mt-10" color="dark">
                Sign Up
              </Button>
            </Link>
            <Link to="/startHere">
              <Button className="w-full mt-2 font-bold text-green-950 bg-[#1e915260] underline outline-none border-2" color="green">
                Learn More Here
              </Button>
            </Link>
          </div>
        </div>
      )}

      <div className={`relative bg-[#F5F5F5] dark:bg-[#121212] p-8 min-h-screen ${!hasAccess ? 'pointer-events-none blur-sm' : ''}`}>
        <AllPins />
      </div>
    </div>
  );
}
