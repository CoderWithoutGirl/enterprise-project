import ApplicationBaseLayout from "../../layout/ApplicationBaseLayout";
import { Navigate } from "react-router-dom";
import { connect } from "react-redux";

const PrivateRoute = ({ isAuthenticated, children }) => {
  return (
    isAuthenticated ? (<ApplicationBaseLayout>
      {children}
    </ApplicationBaseLayout>) : <Navigate to="/login" />
  );
};

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.authenticateReducer.isAuthenticated,
  };
};


export default connect(mapStateToProps)(PrivateRoute);
