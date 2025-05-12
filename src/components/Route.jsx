
import Loading from "./Loading";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function Route({ children }) {
  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);

  // If data is loading, show a stylish Loading
  if (loading) return <Loading />;

  // If no user is authenticated, redirect to login page with some animation
  if (!user) return <Navigate to="/login" replace />;

  return children;
}

export default Route;
