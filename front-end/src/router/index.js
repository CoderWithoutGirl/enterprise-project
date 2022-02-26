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
import ErrorPage from "../screens/error";
import { roles } from "../constants/role";
import UserInDepartment from "../screens/userInDepartment/";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <UnauthorizeRoute>
              <LoginPage />
            </UnauthorizeRoute>
          }
        />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
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
          path="/departments"
          element={
            <PrivateRoute>
              <Departments />
            </PrivateRoute>
          }
        />
        <Route
          path="/departments/:department"
          element={
            <PrivateRoute>
              <UserInDepartment />
            </PrivateRoute>
          }
        />
        <Route
          path="/categories"
          element={
            <PrivateRoute>
              <Categories />
            </PrivateRoute>
          }
        />
        <Route
          path="/users"
          element={
            <PrivateRoute allowRoles={[roles.QA_MANAGER, roles.ADMIN]}>
              <UserPage />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
