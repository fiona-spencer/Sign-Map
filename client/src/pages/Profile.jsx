import { Alert, Button, Modal, ModalBody, TextInput } from 'flowbite-react';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signoutSuccess,
} from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { Link, useNavigate } from 'react-router-dom';

export default function Profile() {
  const { currentUser, error, loading } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const filePickerRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };
  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () => {
    setImageFileUploading(true);
    setImageFileUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadError(
          'Could not upload image (File must be less than 2MB)'
        );
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
        setImageFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setFormData({ ...formData, profilePicture: downloadURL });
          setImageFileUploading(false);
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);
    if (Object.keys(formData).length === 0) {
      setUpdateUserError('No changes made');
      return;
    }
    if (imageFileUploading) {
      setUpdateUserError('Please wait for image to upload');
      return;
    }
    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      } else {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("User's profile updated successfully");
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
    }
  };
  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
      } else {
        dispatch(deleteUserSuccess(data));
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignout = () => {
    dispatch(signoutSuccess());  // Dispatch sign out action
    navigate('/signin');  // Redirect to Sign In page after signout
  };
  

  return (
<div className='max-w-lg mx-auto p-8 w-full border-2 bg-[#d7dad85c] dark:bg-gray-800 border-gray-300 dark:border-gray-700 m-9 rounded-lg'>
  <h1 className='my-7 text-center font-semibold text-3xl text-gray-900 dark:text-white'>Profile</h1>

  <form onSubmit={handleSubmit} className='flex flex-col gap-4'>

    {/* Image Upload Container */}
{/* Image Upload Container */}
<div
  className='relative w-52 h-52 self-center cursor-pointer shadow-md overflow-hidden rounded-full hover:border-red-500'
  onClick={() => filePickerRef.current.click()}
>
  {/* Image Upload Progress */}
  {imageFileUploadProgress && (
    <CircularProgressbar
      value={imageFileUploadProgress || 0}
      strokeWidth={5}
      styles={{
        root: {
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
        },
        path: {
          stroke: `rgba(42, 150, 50, ${imageFileUploadProgress / 100})`,
        },
      }}
    />
  )}

  <img
    src={imageFileUrl || currentUser.profilePicture}
    alt='user'
    className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] dark:border-gray-600 ${
      imageFileUploadProgress &&
      imageFileUploadProgress < 100 &&
      'opacity-60'
    }`}
  />
</div>

{/* Add this just below the image container */}
<input
  type="file"
  accept="image/*"
  onChange={handleImageChange}
  ref={filePickerRef}
  hidden
/>


    {/* Text Inputs (you may add dark variants if your TextInput component supports them) */}
    <TextInput
      type='text'
      id='username'
      placeholder='username'
      defaultValue={currentUser.username}
      onChange={handleChange}
      className='dark:text-white dark:bg-gray-700 dark:placeholder-gray-400'
    />
    <TextInput
      type='email'
      id='email'
      placeholder='email'
      defaultValue={currentUser.email}
      onChange={handleChange}
      className='dark:text-white dark:bg-gray-700 dark:placeholder-gray-400'
    />
    <TextInput
      type='password'
      id='password'
      placeholder='password'
      onChange={handleChange}
      className='dark:text-white dark:bg-gray-700 dark:placeholder-gray-400'
    />

    <Button
      type='submit'
      gradientDuoTone='greenToBlue'
      outline
      disabled={loading || imageFileUploading}
    >
      {loading ? 'Loading...' : 'Update'}
    </Button>

    {currentUser.isAdmin && (
      <Link to={'/create-post'}>
        <Button
          type='button'
          gradientDuoTone='purpleToPink'
          className='w-full'
        >
          Create a post
        </Button>
      </Link>
    )}
  </form>

  {/* Footer Actions */}
  <div className='text-red-700 flex justify-between mt-5'>
    <span onClick={() => setShowModal(true)} className='cursor-pointer font-bold  hover:text-red-500'>
      Delete Account
    </span>
    <span onClick={handleSignout} className='cursor-pointer font-bold  hover:text-red-500'>
      Sign Out
    </span>
  </div>

  {/* Alerts */}
  {updateUserSuccess && (
    <Alert color='success' className='mt-5'>
      {updateUserSuccess}
    </Alert>
  )}
  {updateUserError && (
    <Alert color='failure' className='mt-5'>
      {updateUserError}
    </Alert>
  )}
  {error && (
    <Alert color='failure' className='mt-5'>
      {error}
    </Alert>
  )}

  {/* Delete Confirmation Modal */}
  <Modal
    show={showModal}
    onClose={() => setShowModal(false)}
    popup
    size='md'
  >
    <Modal.Header />
    <Modal.Body>
      <div className='text-center'>
        <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
        <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-300'>
          Are you sure you want to delete your account?
        </h3>
        <div className='flex justify-center gap-4'>
          <Button color='failure' onClick={handleDeleteUser}>
            Yes, I'm sure
          </Button>
          <Button color='gray' onClick={() => setShowModal(false)}>
            No, cancel
          </Button>
        </div>
      </div>
    </Modal.Body>
  </Modal>
</div>

  );
}