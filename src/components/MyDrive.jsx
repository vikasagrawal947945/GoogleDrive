import React, { useEffect, useRef, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useDispatch, useSelector } from "react-redux";
import { setFiles, removeFile } from "../slices/fileSlice";
import { setMessage } from "../slices/authSlice";

const MyDrive = () => {
  const dispatch = useDispatch();
  const fileState = useSelector((state) => state.files);
  const [loading, setLoading] = useState(true);
  const [contextMenu, setContextMenu] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) fetchFiles();
    });

    async function fetchFiles() {
      const snapshot = await getDocs(
        collection(db, "users", auth.currentUser.uid, "files")
      );
      const fileList = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      dispatch(setFiles(fileList));
      setLoading(false);
    }

    return () => unsubscribe();
  }, [dispatch]);

  const handleContextMenu = (e, file) => {
    e.preventDefault();
    setSelectedFile(file);

    const containerRect = containerRef.current.getBoundingClientRect();
    const menuWidth = 150;
    const menuHeight = 90;
    const padding = 10;

    let x = e.clientX - containerRect.left;
    let y = e.clientY - containerRect.top;

    if (x + menuWidth + padding > containerRect.width) {
      x = containerRect.width - menuWidth - padding;
    }

    if (y + menuHeight + padding > containerRect.height) {
      y = containerRect.height - menuHeight - padding;
    }

    setContextMenu({ x, y });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(selectedFile.url);
    dispatch(setMessage("Link copied to clipboard!"));
    setContextMenu(null);
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${selectedFile.name}"?`
    );
    if (!confirmed) return;

    try {
      await deleteDoc(
        doc(db, "users", auth.currentUser.uid, "files", selectedFile.id)
      );
      dispatch(removeFile(selectedFile.id)); // ✅ Immediately remove from Redux
    } catch (err) {
      alert("Failed to delete file: " + err.message);
    }

    setContextMenu(null);
  };

  useEffect(() => {
    document.addEventListener("click", () => setContextMenu(null));
    return () => document.removeEventListener("click", () => setContextMenu(null));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <p className="text-gray-500 text-lg">Loading files...</p>
      </div>
    );
  }

  return (
    <div className="relative" ref={containerRef}>
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* Uploading placeholder */}
        {fileState.uploading && (
          <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200 animate-pulse">
            <div className="h-5 bg-gray-300 rounded w-2/3 mb-2"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <p className="text-gray-500 text-sm mt-2">Uploading...</p>
          </div>
        )}

        {fileState.files.map((file, idx) => (
          <div
            key={file.id || idx}
            className="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-lg transition"
            onContextMenu={(e) => handleContextMenu(e, file)}
          >
            <h3 className="text-md font-semibold text-gray-800 mb-1 truncate">
              {file.name}
            </h3>

            {file.type === "image" && (
              <a href={file.url} target="_blank" rel="noreferrer">
                <img
                  src={file.url}
                  alt={file.name}
                  className="rounded-md max-h-48 object-cover w-full"
                />
              </a>
            )}

            {file.type === "video" && (
              <a href={file.url} target="_blank" rel="noreferrer">
                <video
                  controls
                  className="w-full rounded-md pointer-events-none"
                >
                  <source src={file.url} type={file.format} />
                  Your browser does not support the video tag.
                </video>
              </a>
            )}

            {file.type === "audio" && (
              <a href={file.url} target="_blank" rel="noreferrer">
                <audio controls className="w-full mt-2 pointer-events-none">
                  <source src={file.url} type={file.format} />
                  Your browser does not support the audio element.
                </audio>
              </a>
            )}

            {file.format === "application/pdf" && (
              <a
                href={file.url}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:underline mt-2 block text-sm"
              >
                Open PDF
              </a>
            )}

            {file.type === "raw" && file.format !== "application/pdf" && (
              <a
                href={file.url}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:underline mt-2 block text-sm"
              >
                Download file
              </a>
            )}
          </div>
        ))}
      </div>

      {contextMenu && (
        <div
          className="absolute z-50 bg-white border border-gray-300 rounded shadow-md py-1"
          style={{ top: contextMenu.y, left: contextMenu.x, minWidth: 150 }}
        >
          <button
            onClick={handleCopyLink}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
          >
            📋 Copy Link
          </button>
          <button
            onClick={handleDelete}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-600"
          >
            🗑️ Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default MyDrive;