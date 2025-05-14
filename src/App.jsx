import { createBrowserRouter } from "react-router-dom";
import { RouterProvider } from "react-router";
import WelcomePage from "./Pages/WelcomePage";
import SignIn from "./Pages/SignIn";
import Home from "./Pages/Home";
import Route from "./components/Route";
import AuthStatusListener from "./components/AuthStatusListener";

const customRouter = createBrowserRouter([
  {
    path: "/",
    element: <WelcomePage />,
    children: [
      {
        index: true,
        element: (
        <Route>
          <Home></Home>
        </Route>
        ),
      },
      {
        path: "/login",
        element: <SignIn />,
      },
    ],
  },
]);

export default function App() {
  return (
    <AuthStatusListener>
      <RouterProvider router={customRouter} />
    </AuthStatusListener>
  );
}
