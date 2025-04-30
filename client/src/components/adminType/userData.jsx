import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { HiDotsVertical, HiInformationCircle, HiMail } from 'react-icons/hi';
import { Dropdown, Button, Modal, ModalBody, ModalHeader, Alert } from 'flowbite-react'; 

export default function UserData() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useSelector((state) => state.user);

  // States for modals
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editedUser, setEditedUser] = useState({ username: '', email: '', profilePicture: '', userType: 'user', password: '' });
  const [password, setPassword] = useState('');
  const [showPasswordError, setShowPasswordError] = useState(false); // State for password error

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/user/getusers', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        const data = await response.json();
        setUsers(data.users);
        console.log(data.users)
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

  // Handle Action (Edit/Delete)
  const handleAction = (action, user) => {
    switch (action) {
      case 'edit':
        setEditedUser({ username: user.username, email: user.email, profilePicture: user.profilePicture, userType: user.userType });
        setSelectedUser(user);
        setShowEditModal(true);
        break;
      case 'delete':
        setSelectedUser(user);
        setShowDeleteModal(true);
        break;
      case 'email':
        console.log(`Send email to user with ID: ${user._id}`);
        break;
      default:
        break;
    }
  };

  // Handle Save Edit
  const handleSaveEdit = async () => {
    // If userType is "admin" and password is required, check if the password is correct
    if (editedUser.userType === 'admin' && password !== '4178') {
      setShowPasswordError(true); // Show the error alert
      return;
    }

    console.log('Edited User:', editedUser); // Log the edited data before making the request
    console.log('Selected User:', selectedUser); // Log the user being edited before making the request

    try {
      const response = await fetch(`/api/user/update/${selectedUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedUser), // Send edited data
        credentials: 'include',
      });

      if (!response.ok) {
        const errorResponse = await response.json(); // Get the error response from the server
        console.error('Error response:', errorResponse);
        throw new Error('Failed to update user');
      }

      const data = await response.json();
      console.log('Updated User Data:', data); // Log the response data from the API

      setUsers((prev) =>
        prev.map((user) =>
          user._id === selectedUser._id ? { ...user, ...data } : user
        )
      );

      setShowEditModal(false); // Close the modal after update
      console.log('User after update in state:', selectedUser); // Log the updated user in state
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  // Handle Delete
  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/user/delete/${selectedUser._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      setUsers(users.filter((user) => user._id !== selectedUser._id));
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold text-center mb-2">User Database</h1>

      <div className="overflow-x-auto rounded-lg shadow-lg">
        <table className="min-w-full table-auto border-collapse text-sm bg-white">
          <thead className="bg-gray-200 dark:bg-slate-700">
            <tr>
              <th className="pl-3 py-1 border-b text-left">Username</th>
              <th className="px-3 py-1 border-b text-left">Email</th>
              <th className="px-3 py-1 border-b text-left">Profile Picture</th>
              <th className="px-3 py-1 border-b text-left">User Type</th>
              <th className="px-3 py-1 border-b text-left">Created At</th>
              <th className="px-3 py-1 border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user._id} className="hover:bg-yellow-100 dark:hover:bg-blue-700 dark:bg-blue-950">
                  <td className="px-2 py-1 border-b">{user.username}</td>
                  <td className="px-2 py-1 border-b">{user.email}</td>
                  <td className="px-2 py-1 border-b">
                    <img
                      src={user.profilePicture || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'}
                      alt={user.username}
                      className="h-8 w-8 rounded-full"
                    />
                  </td>
                  <td className="px-2 py-1 border-b">{user.userType}</td>
                  <td className="px-2 py-1 border-b">{new Date(user.createdAt).toLocaleString()}</td>
                  <td className="px-0 py-1 border-b text-center">
                    <Dropdown label={<HiDotsVertical className="text-gray-600 dark:text-white cursor-pointer hover:opacity-40" size={20}/>} color="dark" arrowIcon={false} inline>
                      <Dropdown.Item onClick={() => handleAction('edit', user)} className='font-medium'>Edit</Dropdown.Item>
                      <Dropdown.Item onClick={() => handleAction('email', user)} className='text-[#296aa3] font-bold'>Send <HiMail className="ml-3" size={20}/></Dropdown.Item>
                      <Dropdown.Item onClick={() => handleAction('delete', user)} className='text-red-600 font-bold'>Delete</Dropdown.Item>
                    </Dropdown>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-2 py-1 border-b text-center">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <ModalHeader>Are you sure you want to delete this user?</ModalHeader>
        <ModalBody>
          <div className="flex justify-between">
            <Button color="failure" onClick={handleDelete}>Yes, Delete</Button>
            <Button color="gray" onClick={() => setShowDeleteModal(false)}>No, Cancel</Button>
          </div>
        </ModalBody>
      </Modal>

      {/* Edit User Modal */}
      <Modal show={showEditModal} onClose={() => setShowEditModal(false)}>
        <ModalHeader>Edit User</ModalHeader>
        <ModalBody>
          <div>
            <input
              type="text"
              className="block w-full p-2 mb-4 border rounded"
              value={editedUser.username}
              onChange={(e) => setEditedUser({ ...editedUser, username: e.target.value })}
              placeholder="Username"
            />
            <input
              type="email"
              className="block w-full p-2 mb-4 border rounded"
              value={editedUser.email}
              onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
              placeholder="Email"
            />
            <input
              type="text"
              className="block w-full p-2 mb-4 border rounded"
              value={editedUser.profilePicture}
              onChange={(e) => setEditedUser({ ...editedUser, profilePicture: e.target.value })}
              placeholder="Profile Picture URL"
            />
            <div className="mb-4">
              <label htmlFor="userType" className="block mb-2">User Type</label>
              <select
                id="userType"
                className="block w-full p-2 mb-4 border rounded"
                value={editedUser.userType}
                onChange={(e) => setEditedUser({ ...editedUser, userType: e.target.value })}
              >
                <option value="public">Public</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            {editedUser.userType === 'admin' && (
              <div className="mb-4">
                <input
                  type="password"
                  className="block w-full p-2 mb-4 border rounded"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password for admin"
                />
              </div>
            )}
          </div>

          {/* Show the password error alert */}
          {showPasswordError && (
            <div className='mb-4'>
              <Alert color="failure" icon={HiInformationCircle}>
              Cannot change this user's status to admin.
            </Alert>
            </div>
          )}

          <div className="flex justify-between">
            <Button onClick={handleSaveEdit}>Save Changes</Button>
            <Button color="gray" onClick={() => setShowEditModal(false)}>Cancel</Button>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
}
