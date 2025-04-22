import { useSelector, useDispatch } from 'react-redux';
import { Card, Label, TextInput, Button, Modal } from 'flowbite-react';
import { useState } from 'react';
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signoutSuccess,
} from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [editMode, setEditMode] = useState(false);
  const [username, setUsername] = useState(currentUser?.username || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (username === currentUser.username && email === currentUser.email) {
      setEditMode(false);
      return;
    }
  
    dispatch(updateStart());
  
    try {
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies if needed
        body: JSON.stringify({ username, email }),
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        throw new Error(data.message || 'Update failed');
      }
  
      dispatch(updateSuccess(data));
      setEditMode(false);
    } catch (err) {
      dispatch(updateFailure(err.message));
      alert(err.message);
    }
  };

  const handleDelete = async () => {
    dispatch(deleteUserStart());
    setLoading(true);

    try {
      const res = await fetch(`/api/user/${currentUser._id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Deletion failed');
      }

      dispatch(deleteUserSuccess());
      navigate('/signup');
    } catch (err) {
      dispatch(deleteUserFailure(err.message));
      alert(err.message);
    } finally {
      setLoading(false);
      setShowModal(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="text-center mt-10 text-red-500 dark:text-red-400">
        No user data available.
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4 md:px-10 bg-gray-100 dark:bg-gray-900">
      <h1 className="text-3xl font-bold text-green-700 dark:text-green-300 mb-6 text-center">
        Profile Overview
      </h1>

      <Card className="max-w-3xl mx-auto bg-white dark:bg-gray-800 shadow-lg p-8">
        {/* Avatar + Info */}
        <div className="flex flex-col items-center space-y-4 mb-8">
          <img
            src={currentUser.profilePicture || '/default-avatar.png'}
            alt="User Avatar"
            className="w-40 h-40 rounded-full border-4 border-green-500 shadow-md object-cover"
          />
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {currentUser.username}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{currentUser.userType}</p>
          </div>
        </div>

        {/* Editable Form */}
        <form className="space-y-5">
          <div>
            <Label htmlFor="username" className="text-green-700 dark:text-green-300">
              Username
            </Label>
            <TextInput
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              readOnly={!editMode}
            />
          </div>

          <div>
            <Label htmlFor="email" className="text-green-700 dark:text-green-300">
              Email
            </Label>
            <TextInput
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              readOnly={!editMode}
            />
          </div>

          {!editMode ? (
            <Button
              type="button"
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => setEditMode(true)}
            >
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-4">
              <Button
                type="button"
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={handleSave}
              >
                Save Changes
              </Button>
              <Button
                type="button"
                className="bg-gray-400 hover:bg-gray-500 text-white"
                onClick={() => {
                  setUsername(currentUser.username);
                  setEmail(currentUser.email);
                  setEditMode(false);
                }}
              >
                Cancel
              </Button>
            </div>
          )}

          {/* Delete Profile */}
          <Button
            type="button"
            color="failure"
            className="w-full"
            onClick={() => setShowModal(true)}
          >
            Delete Account
          </Button>
        </form>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal show={showModal} size="md" onClose={() => setShowModal(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <h3 className="mb-5 text-lg font-normal text-gray-700 dark:text-gray-300">
              Are you sure you want to delete your account?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDelete} isProcessing={loading}>
                Yes, delete
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
