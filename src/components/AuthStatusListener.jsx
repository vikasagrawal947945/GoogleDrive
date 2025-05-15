import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { useDispatch } from "react-redux";
import { setUserInfo , clearUser } from "../slices/authSlice";

function AuthStatusListener({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // Extracting essential fields
        const { uid, email, displayName, photoURL } = currentUser;
        dispatch(setUserInfo({ uid, email, displayName, photoURL }));
      } else {
        dispatch(clearUser());
      }
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [dispatch]);

  return children;
}

export default AuthStatusListener;
