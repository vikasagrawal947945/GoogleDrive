// src/redux/fileSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { uploadToCloudinary } from "../utils/uploadToCloudinary";
import { db, auth } from "../firebase";
import { addDoc, collection } from "firebase/firestore";

// Async thunk to upload file to Cloudinary & save metadata to Firestore
export const uploadFile = createAsyncThunk("files/uploadFile", async (file) => {
  // Upload to Cloudinary
  const uploaded = await uploadToCloudinary(file);

  const fileData = {
    name: uploaded.name,
    url: uploaded.url,
    type: uploaded.type,
    format: uploaded.format,
    size: uploaded.size,
    createdAt: new Date(),
  };

  const user = auth.currentUser;

  // Save file metadata to Firestore and get document reference
  const docRef = await addDoc(collection(db, "users", user.uid, "files"), fileData);

  // Attach Firestore ID for use in the UI (delete, update, etc.)
  return { ...fileData, id: docRef.id };
});

const fileSl = createSlice({
  name: "files",
  initialState: {
    files: [],
    uploading: false,
    error: null,
  },
  reducers: {
    setFiles(state, action) {
      state.files = action.payload;
    },
    removeFile(state, action) {
      // Optional: helpful if you want to update Redux state immediately after deletion
      state.files = state.files.filter((file) => file.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadFile.pending, (state) => {
        state.uploading = true;
        state.error = null;
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
        state.uploading = false;
        state.files.push(action.payload); // now has .id
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.uploading = false;
        state.error = action.error.message;
      });
  },
});

export const { setFiles, removeFile } = fileSl.actions;
export const fileSlice = fileSl.reducer;