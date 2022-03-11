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
import AcademicPage from "../screens/academics/index";
import ErrorPage from "../screens/error";
import { roles } from "../constants/role";
import UserInDepartment from "../screens/userInDepartment/";
import PostIdea from "../screens/postIdea";
import IdeaDetail from "../screens/IdeaDetail";

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
          path="/post/:id"
          element={
            <PrivateRoute>
              <IdeaDetail />
            </PrivateRoute>
          }
        />
        <Route
          path="/contribute"
          element={
            <PrivateRoute>
              <PostIdea />
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
            <PrivateRoute allowRoles={[roles.ADMIN]}>
              <Departments />
            </PrivateRoute>
          }
        />
        <Route
          path="/departments/:department"
          element={
            <PrivateRoute allowRoles={[roles.ADMIN]}>
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
          path="/academic"
          element={
            <PrivateRoute allowRoles={[roles.ADMIN]}>
              <AcademicPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/users"
          element={
            <PrivateRoute allowRoles={[roles.ADMIN]}>
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
