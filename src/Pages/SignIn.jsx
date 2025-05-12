import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserInfo, setLoading, setMessage } from "../slices/authSlice";
import heroImage from "../assets/img.jpg";
import logoImage from "../assets/drive-logo.png";
import Message from "../components/Message";

function SignInPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleGoogleLogin = async () => {
    try {
      dispatch(setLoading(true));
      const result = await signInWithPopup(auth, provider);

      const user = result.user;
      const cleanUser = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      };

      dispatch(setUserInfo(cleanUser));
      dispatch(setMessage("Welcome back! 🎉"));
      navigate("/");
    } catch (error) {
      if (error.code === "auth/popup-closed-by-user") {
        dispatch(setMessage("Login cancelled ❌"));
      } else {
        console.error("Auth error:", error);
        dispatch(setMessage("Oops! Something went wrong."));
      }
    }
  };

  return (
    <>
      {/* Header */}
      <header className="flex justify-between items-center px-6 md:px-16 py-4 min-h-[15dvh] bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg">
        <div className="flex items-center space-x-2">
          <img src={logoImage} alt="logo" className="w-10 h-10" />
          <span className="text-3xl font-semibold tracking-tight">Google Drive</span>
        </div>
        <button
          onClick={handleGoogleLogin}
          className="bg-white text-indigo-600 hover:bg-gray-100 font-semibold py-2 px-6 rounded-lg transition duration-200 shadow-md"
        >
          Sign In
        </button>
      </header>

      {/* Main Content */}
      <section className="flex flex-col-reverse md:flex-row items-center justify-between bg-gray-50 px-6 md:px-16 py-12 min-h-[85dvh]">
        {/* Text */}
        <div className="w-full md:w-1/2 space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold text-indigo-700">
            Safe & Easy File Access
          </h1>
          <p className="text-lg md:text-2xl text-gray-600">
            Upload, manage, and collaborate—effortlessly.
          </p>
          <button
            onClick={handleGoogleLogin}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-10 rounded-md transition duration-200 shadow-lg"
          >
            Continue with Google
          </button>
        </div>

        {/* Image */}
        <div className="hidden md:flex w-1/2 justify-center">
          <img
            src={heroImage}
            alt="Hero"
            className="max-w-full h-auto rounded-xl shadow-md"
          />
        </div>
      </section>

      <Message />
    </>
  );
}

export default SignInPage;
