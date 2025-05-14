import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../firebase'; // Firebase Firestore

// Function to upload file to Cloudinary
const uploadToCloudinary = async (file) => {
  const cloudName = 'dgpzoqts7'; // Cloudinary cloud name
  const uploadPreset = 'my_unsigned_preset'; // Cloudinary upload preset

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  // Upload the file to Cloudinary
  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
    method: 'POST',
    body: formData,
  });
  const data = await res.json();
  return data; // Cloudinary response contains the URL and other data
};

// Fetch files from Firestore
export const fetchFiles = createAsyncThunk('files/fetchFiles', async (email) => {
  const snapshot = await db.collection('myfiles').where('email', '==', email).get();
  return snapshot.docs.map(doc => ({ id: doc.id, data: doc.data() }));
});

// Add a new file to Firebase Firestore
export const addFile = createAsyncThunk('files/addFile', async ({ file, email }) => {
  // Upload the file to Cloudinary first
  const cloudinaryData = await uploadToCloudinary(file);

  // Save the file metadata (URL, filename, size) to Firestore
  const fileData = {
    filename: file.name,
    url: cloudinaryData.secure_url, // Store the Cloudinary URL
    size: file.size,
    email: email, // Store the associated user's email
  };

  // Save the metadata to Firestore
  await db.collection('myfiles').add(fileData);
  return fileData; // Return the metadata to be added to Redux state
});

const driveSl = createSlice({
  name: 'files',
  initialState: {
    files: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchFiles.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchFiles.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.files = action.payload;
      })
      .addCase(fetchFiles.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addFile.fulfilled, (state, action) => {
        state.files.push(action.payload); // Add file metadata to the state
      });
  },
});

export const driveSlice = driveSl.reducer;
