import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { HiDotsVertical } from 'react-icons/hi'; // Import the three vertical dots icon
import { Dropdown } from 'flowbite-react'; // Import Flowbite's Dropdown component

export default function userData() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/user/getusers', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Include cookies in the request
        });

        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        const data = await response.json();
        setUsers(data.users);
      } catch (error) {
        setError(error.message);
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // Placeholder function for actions like Edit, Delete, and Send Email
  const handleAction = (action, userId) => {
    switch (action) {
      case 'edit':
        console.log(`Edit user with ID: ${userId}`);
        break;
      case 'delete':
        console.log(`Delete user with ID: ${userId}`);
        break;
      case 'email':
        console.log(`Send email to user with ID: ${userId}`);
        break;
      default:
        break;
    }
  };

  return (
    <div className="p-10 ">
      <h1 className="text-3xl font-bold text-center mb-2">User Database</h1>

      <div className="overflow-x-auto rounded-lg shadow-lg">
        <table className="min-w-full table-auto border-collapse text-sm bg-white ">
          <thead className="bg-gray-200 dark:bg-slate-700 ">
            <tr className=''>
              <th className="pl-3 py-1 border-b text-left">Username</th>
              <th className="px-3 py-1 border-b text-left">Email</th>
              <th className="px-3 py-1 border-b text-left">Profile Picture</th>
              <th className="px-3 py-1 border-b text-left">User Type</th>
              <th className="px-3 py-1 border-b text-left">Created At</th>
              <th className="px-3 py-1 border-b text-center">Actions</th> {/* Added Actions column */}
            </tr>
          </thead>
          <tbody className=''>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user._id} className='hover:bg-yellow-100 dark:hover:bg-blue-700 dark:bg-blue-950'>
                  <td className="px-2 py-1 border-b">{user.username}</td>
                  <td className="px-2 py-1 border-b">{user.email}</td>
                  <td className="px-2 py-1 border-b">
                    <img
                      src={
                        user.profilePicture ||
                        'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
                      }
                      alt={user.username}
                      className="h-8 w-8 rounded-full"
                    />
                  </td>
                  <td className="px-2 py-1 border-b">{user.userType}</td>
                  <td className="px-2 py-1 border-b">
                    {new Date(user.createdAt).toLocaleString()}
                  </td>
                  {/* Actions Column with Flowbite Dropdown */}
                  <td className="px-0 py-1 border-b text-center justify-items-center">
                    <Dropdown label={<HiDotsVertical className="text-gray-600 dark:text-white cursor-pointer" size={20}/>} color='dark' arrowIcon={false} inline className=''>
                      <Dropdown.Item onClick={() => handleAction('edit', user._id)}>Edit</Dropdown.Item>
                      <Dropdown.Item onClick={() => handleAction('delete', user._id)}>Delete</Dropdown.Item>
                      <Dropdown.Item onClick={() => handleAction('email', user._id)}>Send Email</Dropdown.Item>
                    </Dropdown>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-2 py-1 border-b text-center">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
