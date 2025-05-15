// src/utils/saveToFirestore.js
import { collection, addDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

export async function saveFileMetaToFirestore(fileData) {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  await addDoc(collection(db, "users", user.uid, "files"), {
    ...fileData,
    uploadedAt: new Date(),
  });
}