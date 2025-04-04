import { createBrowserRouter,  RouterProvider } from "react-router";


import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import App from "./App";
import CampaignPage from "./pages/CampaignPage";
import CreateCampaignForm from "./components/ui/campaign/CreateCampaignForm";
import CampaignEditPage from "./pages/CampaignEditPage";
import Route from "@/components/ui/Route";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/login",
        element: (
            <Route><LoginPage /></Route>
        ),
      },
      {
        path: "/register",
        element: (
          <Route><RegisterPage /></Route>
        ),
      },
      {
        path: "/",
        element: (
          <Route ><HomePage /></Route>
        ),
      },
      {
        path: "/campaign",
        element: (
          <Route ><HomePage /></Route>
        ),
      },
      {
        path: "/campaign/my",
        element: (
          <Route isProtected><CampaignPage /></Route>
        ),
      },
      {
        path: "/campaign/create",
        element: (
          <Route isProtected><CreateCampaignForm /></Route>
        ),
      },
      {
        path: "/campaign/:id/edit",
        element: (
          <Route isProtected><CampaignEditPage /></Route>
        ),
      },
    ],
  },
]);

const Router = () => <RouterProvider router={router} />;

export default Router;