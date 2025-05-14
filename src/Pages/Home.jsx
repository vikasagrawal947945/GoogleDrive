import React, { useState, useRef, useEffect } from "react";
import { auth } from "../firebase";
import { removeUserInfo, setMessage } from "../slices/authSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "firebase/auth";
import axios from "axios";
import { addFile, fetchFiles } from "../slices/driveSlice"; 
import { FaSearch, FaCloudUploadAlt, FaMobileAlt, FaLaptop, FaUsers, FaHistory, FaStar, FaTrashAlt, FaCloud, FaSignOutAlt } from "react-icons/fa";
import { RiSpam2Line } from "react-icons/ri";
import { TiCloudStorageOutline } from "react-icons/ti";
import { FiHome } from "react-icons/fi";
import Message from "../components/Message";
 
import base64 from 'base-64'; // Or use btoa()

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const [files, setFiles] = useState([]); // Store files from Cloudinary
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const profileRef = useRef(null);
  const [showInfo, setShowInfo] = useState(false);
  const displayName = user?.displayName;
  const email = user?.email;
  const initial = (displayName || email || "U")[0].toUpperCase();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowInfo(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (user) {
      dispatch(fetchFiles(user.email)); // Fetch files from Redux store
      fetchCloudinaryFiles();
    }
  }, [dispatch, user]);

  // Fetch files from Cloudinary
const fetchCloudinaryFiles = async () => {
  const cloudName = 'dgpzoqts7'; // ✅ Removed extra space
  const apiKey = '981818695295234';
  const apiSecret = '43g_F5YGZp2E054Z3MSfYrGmpto';

  try {
    const response = await axios.get(`https://api.cloudinary.com/v1_1/cloudName/resources/image`, {
      auth: {
        username: apiKey,
        password: apiSecret,
      },
      params: {
        max_results: 30,
      },
    });

    setFiles(response.data.resources); // Your logic to store results
  } catch (error) {
    console.error('Error fetching Cloudinary files:', error);
  }
};

const handleFileChange = (event) => {
  setSelectedFile(event.target.files[0]); // Set the selected file for upload
};

const handleFileUpload = async () => {
  if (selectedFile && user) {
    setLoading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('upload_preset', 'my_unsigned_preset');

    try {
      const response = await axios.post('https://api.cloudinary.com/v1_1/dgpzoqts7/image/upload', formData);
      const fileUrl = response.data.secure_url;
      console.log(fileUrl);

      dispatch(addFile({ file: selectedFile, url: fileUrl, email: user.email })); // Add file to Redux
      fetchCloudinaryFiles(); // Fetch updated files
      setLoading(false);
    } catch (error) {
      console.error('File upload failed:', error);
      setLoading(false);
    }
  }
};


  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(removeUserInfo());
      dispatch(setMessage("Logged out successfully ✅"));
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      dispatch(setMessage("Logout failed ❌"));
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-50 md:w-64 bg-gray-900 text-white p-5 hidden min-[500px]:flex flex-col">
        <button
          className="flex items-center text-lg space-x-3 p-3 hover:bg-gray-800 rounded-md w-full"
          onClick={() => document.getElementById('file-input').click()} // Trigger file input
        >
          <FaCloudUploadAlt />
          <span>New</span>
        </button>
        <div className="mt-5 space-y-4">
          <SidebarOption Icon={FiHome} label="Home" />
          <SidebarOption Icon={FaMobileAlt} label="My Drive" />
          <SidebarOption Icon={FaLaptop} label="Computers" />
          <SidebarOption Icon={FaUsers} label="Shared with me" />
          <SidebarOption Icon={FaHistory} label="Recent" />
          <SidebarOption Icon={FaStar} label="Starred" />
          <SidebarOption Icon={RiSpam2Line} label="Spam" />
          <SidebarOption Icon={FaTrashAlt} label="Trash" />
          <SidebarOption Icon={TiCloudStorageOutline} label="Storage" />
        </div>
        <hr className="my-5 border-gray-700" />
        <div className="mt-auto">
          <div className="text-sm mb-1 text-gray-300">Storage Used</div>
          <div className="w-full bg-gray-700 h-2 rounded">
            <div
              className="h-full bg-green-400 rounded transition-all duration-300"
              style={{ width: `${(files.length / 30) * 100}%` }} // Adjust this logic as per your actual data
            />
          </div>
          <div className="text-xs mt-1 text-gray-400">
            {files.length} files uploaded
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between p-5 bg-gray-800 text-white relative">
          <div className="flex items-center space-x-3">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/d/da/Google_Drive_logo.png"
              alt="Google Drive"
              className="w-10"
            />
            <span className="text-2xl">Drive</span>
          </div>
          <div className="flex items-center space-x-4" ref={profileRef}>
            <FaSearch className="text-gray-400" />
            <input
              type="text"
              placeholder="Search in Drive"
              className="bg-gray-700 text-white p-2 rounded-md outline-none hidden md:block"
            />
            {/* Initial Avatar */}
            <div
              onClick={() => setShowInfo(!showInfo)}
              className="w-10 h-10 flex items-center justify-center bg-gray-600 rounded-full text-white text-xl font-semibold cursor-pointer relative"
              title="Click to view user info"
            >
              {initial}
              {showInfo && (
                <div className="absolute right-0 top-12 bg-white text-black shadow-lg rounded-md p-3 z-50 w-56 text-sm">
                  <div className="font-semibold mb-1">
                    {displayName || "User"}
                  </div>
                  <div className="text-gray-600 break-all">{email}</div>
                </div>
              )}
            </div>

            <FaSignOutAlt
              className="text-red-400 text-2xl cursor-pointer hover:text-red-600"
              onClick={handleLogout}
              title="Logout"
            />
          </div>
        </header>

        {/* Button seen only on small screen */}
        <div className="min-[500px]:hidden p-4 bg-gray-900 text-white">
          <button
            onClick={() => document.getElementById('file-input').click()} // Trigger file input
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md w-full justify-center"
          >
            <FaCloudUploadAlt />
            <span>New</span>
          </button>
        </div>

        {/* File Grid */}
        <main className="flex-1 p-5 bg-gray-50">
          <div className="text-lg font-semibold mb-4">My Drive</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {files.map((file) => (
              <div
                key={file.public_id}
                className="text-center p-5 bg-white rounded-lg shadow-lg"
              >
                <FaCloud className="text-gray-400 text-6xl mb-3" />
                <p className="text-sm break-words">{file.filename}</p>
                <p className="text-sm">{file.bytes} bytes</p>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        id="file-input"
        className="hidden"
        onChange={handleFileChange}
        accept="image/*"
      />

      <Message />
    </div>
  );
};

const SidebarOption = ({ Icon, label }) => (
  <div className="flex items-center p-2 rounded-lg hover:bg-gray-700 cursor-pointer">
    <Icon className="text-gray-400 text-xl" />
    <span className="ml-3">{label}</span>
  </div>
);

export default Home;
