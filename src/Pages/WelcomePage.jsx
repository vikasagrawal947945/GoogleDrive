import { Outlet } from "react-router-dom";

function WelcomePage() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#eef2ff" }}>
      <Outlet />
    </div>
  );
}

export default WelcomePage;
