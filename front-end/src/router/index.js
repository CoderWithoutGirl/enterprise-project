import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from "./customRouters/privateRouter";
import UnauthorizeRoute from "./customRouters/unauthorizeRouter";

import ApplicationBaseLayout from "../layout/ApplicationBaseLayout";
import HomePage from "../screens/home";
import LoginPage from "../screens/login";
import TestScreen from "../screens/test";
import Departments from "../screens/departments";
import Categories from "../screens/categories";
import UserPage from "../screens/users/";
import ErrorPage from '../screens/error'
import { roles } from "../constants/role";

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
          path="/login"
          element={
            <UnauthorizeRoute>
              <LoginPage />
            </UnauthorizeRoute>
          }
        />
        <Route
          path="/department"
          element={
            <PrivateRoute>
              <Departments />
            </PrivateRoute>
          }
        />
        <Route
          path="/category"
          element={
            <PrivateRoute>
              <Categories />
            </PrivateRoute>
          }
        />
        <Route
            path="/user"
            element={
              <PrivateRoute allowRoles={[roles.QA_MANAGER, roles.ADMIN]}>
                <UserPage />
              </PrivateRoute>
            }
          />
        <Route
            path="*"
            element={
              <ApplicationBaseLayout>
                <ErrorPage />
              </ApplicationBaseLayout>
            }
          />
        </Routes>
      </BrowserRouter>
    );
}

export default AppRouter;