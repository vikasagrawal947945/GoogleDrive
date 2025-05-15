import axios from "axios";

export async function uploadToCloudinary(file) {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "my_unsigned_preset"); // ensure this exists in Cloudinary
  
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dwp7cmnqk/auto/upload",
        formData
      );
  
      return {
        url: res.data.secure_url,
        format: res.data.format,
        type: res.data.resource_type,
        name: file.name,
        size: file.size,
      };
    } catch (error) {
      console.error("Cloudinary upload error:", error.response?.data || error.message);
      throw new Error("Upload to Cloudinary failed");
    }
  }
  