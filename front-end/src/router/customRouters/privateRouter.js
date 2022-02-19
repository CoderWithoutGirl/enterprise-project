import ApplicationBaseLayout from "../../layout/ApplicationBaseLayout";
import { Navigate, useLocation } from "react-router-dom";
import { connect } from "react-redux";
import { roles } from "../../constants/role";

const PrivateRoute = ({ isAuthenticated, children, allowRoles = roles.ALL, user }) => {
  const location = useLocation();
  return isAuthenticated ? (
    allowRoles?.includes(user?.role) ? (
      <ApplicationBaseLayout>{children}</ApplicationBaseLayout>
    ) : (
      <Navigate to="/error" state={{ from: location }} replace />
    )
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.authenticateReducer.isAuthenticated,
    user: state.authenticateReducer.user,
  };
};


export default connect(mapStateToProps)(PrivateRoute);
