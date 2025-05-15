import React, { useState, useRef, useEffect } from "react";
import { FaSearch, FaMobileAlt, FaLaptop, FaUsers, FaHistory, FaStar, FaTrashAlt, FaSignOutAlt } from "react-icons/fa";
import { RiSpam2Line } from "react-icons/ri";
import { TiCloudStorageOutline } from "react-icons/ti";
import { FiHome } from "react-icons/fi";
import { auth } from "../firebase";
import { clearUser, setMessage } from "../slices/authSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "firebase/auth";
import Message from "../components/Message";
import UploadFile from "../components/UploadFile";
import MyDrive from "../components/MyDrive";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../firebase";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const profileRef = useRef(null);
  const [showInfo, setShowInfo] = useState(false);
  const [storageUsed, setStorageUsed] = useState(0); // State to store storage usage
  const [storageLimit] = useState(25 * 1024 * 1024 * 1024); // 25 GB limit in bytes
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
    const fetchStorageUsage = async () => {
      const snapshot = await getDocs(collection(db, "users", auth.currentUser.uid, "files"));
      let totalSize = 0;
      snapshot.docs.forEach((doc) => {
        const file = doc.data();
        totalSize += file.size || 0; // Assuming 'size' is stored for each file
      });
      setStorageUsed(totalSize);
    };

    if (user) {
      fetchStorageUsage();
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(clearUser());
      dispatch(setMessage("Logged out successfully ✅"));
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      dispatch(setMessage("Logout failed ❌"));
    }
  };

  const storagePercentage = (storageUsed / storageLimit) * 100; // Percentage of storage used

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-50 md:w-64 bg-gray-900 text-white p-5 hidden min-[500px]:flex flex-col">
        <UploadFile />
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
              style={{ width: `${storagePercentage}%` }}
            />
          </div>
          <div className="text-xs mt-1 text-gray-400">
            {Math.round(storageUsed / (1024 * 1024 * 1024))} GB of 25 GB used
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

        {/* Mobile Upload Button */}
        <div className="min-[500px]:hidden p-4 bg-gray-700 text-white">
          <UploadFile />
        </div>

        {/* Main Content */}
        <main className="flex-1 p-5 bg-gray-50">
          <div className="text-lg font-semibold mb-4">Welcome to Drive</div>
          <MyDrive />
        </main>
      </div>

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