import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setMessage } from '../slices/authSlice';

const Message = () => {
  const { message } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (message) {
      setProgress(100);

      // Decrease progress over time
      const interval = setInterval(() => {
        setProgress((prev) => {
          const next = prev - 4;
          return next >= 0 ? next : 0;
        });
      }, 100);

      // Clear the message after a duration
      const timeout = setTimeout(() => {
        dispatch(setMessage(null));
      }, 2500); // Duration matches with progress animation

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [message, dispatch]);

  if (!message) return null;

  return (
    <div className="fixed top-5 right-5 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 text-white px-6 py-4 rounded-2xl shadow-2xl z-50 w-96 transform transition-all duration-300 hover:scale-105">
      <p className="font-semibold text-lg">{message}</p>
      <div className="h-1 bg-white mt-2 rounded-xl">
        <div
          className="h-full bg-gradient-to-r from-pink-300 to-indigo-400 transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default Message;
