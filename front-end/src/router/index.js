import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from "./customRouters/privateRouter";
import UnauthorizeRoute from "./customRouters/unauthorizeRouter";

import ApplicationBaseLayout from "../layout/ApplicationBaseLayout";
import HomePage from "../screens/home";
import LoginPage from "../screens/login";
import TestScreen from "../screens/test";

const AppRouter = () => {
    return (
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ApplicationBaseLayout>
                <HomePage />
              </ApplicationBaseLayout>
            }
          />
          <Route
            path="/test"
            element={
              <ApplicationBaseLayout>
                <TestScreen />
              </ApplicationBaseLayout>
            }
          />
          <Route
            path="/private"
            element={
              <PrivateRoute>
                <HomePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/login"
            element={
              <UnauthorizeRoute>
                <LoginPage />
              </UnauthorizeRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    );
}

export default AppRouter;