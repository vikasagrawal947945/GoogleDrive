import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadFile } from "../slices/fileSlice";
import { FaPlus } from "react-icons/fa";

const UploadFile = () => {
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { uploading, error } = useSelector((state) => state.files);

  const handleUpload = () => {
    console.log("Upload button clicked");
    if (file) {
      console.log("Uploading file:", file);
      try {
        dispatch(uploadFile(file));
        setFile(null);
        setIsModalOpen(false);
      } catch (err) {
        console.error("File upload failed:", err);
      }
    } else {
      console.log("No file selected");
    }
  };

  return (
    <div className="relative">
      {/* Button to open modal */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="p-3 font-medium text-white rounded-full bg-gray-900 hover:bg-gray-700 flex items-center justify-center shadow-lg cursor-pointer"
      >
        <FaPlus className="text-gray-400 text-xl" />
        <span className="ml-2 font-normal">New</span>
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full relative">
            <h2 className="text-lg font-semibold mb-4">Upload File</h2>

            {/* Custom File Input */}
            <label className="block p-3 mb-4 border border-gray-300 rounded-md w-full text-gray-600 cursor-pointer hover:bg-gray-100 transition">
              {file ? file.name : "Choose a file..."}
              <input
                type="file"
                onChange={(e) => {
                  const selectedFile = e.target.files[0];
                  console.log("Selected file:", selectedFile);
                  setFile(selectedFile);
                }}
                className="hidden"
              />
            </label>

            <button
              disabled={!file || uploading}
              onClick={handleUpload}
              className={`p-3 font-medium text-white rounded-md w-full transition-colors ${
                uploading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>

            {error && <p className="mt-4 text-red-500 text-sm">{error}</p>}

            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-gray-600 text-2xl cursor-pointer"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadFile;