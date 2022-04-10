import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  ChartPieIcon,
  DocumentDuplicateIcon,
  UserIcon,
  UserGroupIcon,
  LogoutIcon,
  CalendarIcon,
  DuplicateIcon,
  DocumentIcon
} from "@heroicons/react/solid";
import { connect } from "react-redux";
import { logout } from "../store/actions/authenticateAction";
import { subRouterUpdate } from "../store/actions/subRouterAction";
import { useEffect, useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import Modal from "./modal";
import Profile from "../screens/users/profile";
import {roles} from '../constants/role'
import avatar from '../assets/logo.png'

const SideBar = ({
  authenticateReducer,
  doLogout,
  getAllDepartment,
  subRouterReducer,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token, user } = authenticateReducer;
  const { departmentRouters, categoryRouters } = subRouterReducer;

  const [departmentToggle, setDepartmentToggle] = useState(false);

  const [categoryToggle, setCategoryToggle] = useState(false);

  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState("");

  const handleDepToggle = (e) => {
    setDepartmentToggle((prev) => !prev);
    setCategoryToggle(false);
  };

  const handleCateToggle = (e) => {
    setCategoryToggle((prev) => !prev);
    setDepartmentToggle(false);
  };

  const handleLogout = (e) => {
    e.preventDefault();
    doLogout();
    navigate("/login");
  };

  useEffect(() => {
    getAllDepartment(token);
  }, [getAllDepartment, token]);

  const editUserHandler = (e, id) => {
    e.preventDefault();
    setUserId(id);
    setOpen((prev) => !prev);
  };

  return (
    <>
      <aside
        className="w-full md:h-full bg-gray-800 shadow-2xl"
        aria-label="Sidebar"
      >
        <div className="w-full px-3 py-4 overflow-y-auto rounded">
          <ul className="w-full flex items-center justify-evenly md:flex-col md:items-start">
            <li
              className="w-full h-fit flex sm:flex-row flex-col items-center justify-center"
              onClick={(e) => editUserHandler(e, authenticateReducer?.user?.id)}
            >
              <div className="shrink-0">
                <img src={avatar} className="rounded-full w-10" alt="Avatar" />
              </div>
              <div className="grow ml-3">
                <button
                  onClick={(e) =>
                    editUserHandler(e, authenticateReducer?.user?.id)
                  }
                >
                  <p className="hidden sm:inline-block text-sm font-semibold text-blue-600">
                    {authenticateReducer?.user?.fullname}
                  </p>
                </button>
              </div>
            </li>
            {user?.role === roles.QA_MANAGER && (
              <>
                <li className="w-full">
                  <Link
                    to="/dashboard"
                    className={`flex items-center p-2 text-base justify-between font-normal ${
                      location.pathname === "/dashboard"
                        ? "bg-gray-700 dark:bg-gray-900"
                        : "bg-inherit"
                    } rounded-lg text-white hover:bg-gray-100 dark:hover:bg-gray-700`}
                  >
                    <div className="flex items-center">
                      <ChartPieIcon className="text-gray-500 w-5 h-5" />
                      <span className="hidden md:inline-block ml-3">
                        Statistics
                      </span>
                    </div>
                  </Link>
                </li>
                <li className="w-full">
                  <Link
                    to="/categories"
                    className={`flex items-center p-2 text-base justify-between font-normal ${
                      location.pathname === "/categories"
                        ? "bg-gray-700 dark:bg-gray-900"
                        : "bg-inherit"
                    } rounded-lg text-white hover:bg-gray-100 dark:hover:bg-gray-700`}
                  >
                    <div className="flex items-center">
                      <DocumentDuplicateIcon className="text-gray-500 w-5 h-5" />
                      <span className="hidden md:inline-block ml-3">
                        Categories
                      </span>
                    </div>
                    <ChevronDownIcon
                      onClick={handleCateToggle}
                      className="text-gray-500 w-10 h-10"
                    />
                  </Link>
                  <ul
                    className={`${
                      categoryToggle ? "flex flex-col sm:block" : "hidden"
                    } sm:ml-4 space-y-2 absolute bottom-[90px] sm:bottom-0 sm:relative bg-gray-800`}
                  >
                    {categoryRouters?.map((item, index) => (
                      <li key={index} className="w-full">
                        <Link
                          to={`/categories/${item.name}`}
                          className={`flex items-center p-2 text-base font-normal ${
                            location.pathname === `/departments/${item.name}`
                              ? "bg-gray-700 dark:bg-gray-900"
                              : "bg-inherit"
                          } rounded-lg text-white hover:bg-gray-100 dark:hover:bg-gray-700`}
                        >
                          <DuplicateIcon className="text-gray-500 w-5 h-5" />
                          <span className="sm:ml-3">{item.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              </>
            )}
            {user?.role === roles.QA_COORDINATOR && (
              <li className="w-full">
                <Link
                  to="/statistics"
                  className={`flex items-center p-2 text-base justify-between font-normal ${
                    location.pathname === "/statistics"
                      ? "bg-gray-700 dark:bg-gray-900"
                      : "bg-inherit"
                  } rounded-lg text-white hover:bg-gray-100 dark:hover:bg-gray-700`}
                >
                  <div className="flex items-center">
                    <ChartPieIcon className="text-gray-500 w-5 h-5" />
                    <span className="hidden md:inline-block ml-3">
                      Statistics
                    </span>
                  </div>
                </Link>
              </li>
            )}
            <li className="w-full">
              <Link
                to="/ideas"
                className={`flex items-center p-2 text-base justify-between font-normal ${
                  location.pathname === "/ideas"
                    ? "bg-gray-700 dark:bg-gray-900"
                    : "bg-inherit"
                } rounded-lg text-white hover:bg-gray-100 dark:hover:bg-gray-700`}
              >
                <div className="flex items-center">
                  <DocumentIcon className="text-gray-500 w-5 h-5" />
                  <span className="hidden md:inline-block ml-3">All Ideas</span>
                </div>
              </Link>
            </li>
            {user?.role === roles.ADMIN && (
              <>
                <li className="w-full">
                  <Link
                    to="/users"
                    className={`flex items-center p-2 text-base justify-between font-normal ${
                      location.pathname === "/users"
                        ? "bg-gray-700 dark:bg-gray-900"
                        : "bg-inherit"
                    } rounded-lg text-white hover:bg-gray-100 dark:hover:bg-gray-700`}
                  >
                    <div className="flex items-center">
                      <UserIcon className="text-gray-500 w-5 h-5" />
                      <span className="hidden md:inline-block ml-3">Users</span>
                    </div>
                  </Link>
                </li>
                <li className="w-full">
                  <Link
                    to="/departments"
                    className={`w-full flex items-center p-2 text-base justify-between font-normal ${
                      location.pathname === "/departments"
                        ? "bg-gray-700 dark:bg-gray-900"
                        : "bg-inherit"
                    } rounded-lg text-white hover:bg-gray-100 dark:hover:bg-gray-700`}
                  >
                    <div className="flex items-center">
                      <UserGroupIcon className="text-gray-500 w-5 h-5" />
                      <span className="hidden md:inline-block ml-3">
                        Departments
                      </span>
                    </div>
                    <ChevronDownIcon
                      onClick={handleDepToggle}
                      className="text-gray-500 w-10 h-10"
                    />
                  </Link>
                  <ul
                    className={`${
                      departmentToggle ? "flex flex-col sm:block" : "hidden"
                    } sm:ml-4 space-y-2 absolute bottom-[90px] sm:bottom-0 z-50 sm:relative bg-gray-800`}
                  >
                    {departmentRouters?.map((item, index) => (
                      <li key={index} className="w-full">
                        <Link
                          to={`/departments/${item.name}`}
                          className={`flex items-center p-2 text-base font-normal ${
                            location.pathname === `/departments/${item.name}`
                              ? "bg-gray-700 dark:bg-gray-900"
                              : "bg-inherit"
                          } rounded-lg text-white hover:bg-gray-100 dark:hover:bg-gray-700`}
                        >
                          <UserGroupIcon className="text-gray-500 w-5 h-5" />
                          <span className="md:ml-3">{item.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
                <li className="w-full">
                  <Link
                    to="/academic"
                    className={` flex items-center p-2 text-base justify-between font-normal ${
                      location.pathname === "/academic"
                        ? "bg-gray-700 dark:bg-gray-900"
                        : "bg-inherit"
                    } rounded-lg text-white hover:bg-gray-100 dark:hover:bg-gray-700`}
                  >
                    <div className="flex items-center">
                      <CalendarIcon className="text-gray-500 w-5 h-5" />
                      <span className="hidden md:inline-block ml-3">
                        Academic Years
                      </span>
                    </div>
                  </Link>
                </li>
              </>
            )}
            <li className="w-full">
              <div
                onClick={handleLogout}
                className="flex items-center p-2 text-base font-normal rounded-lg text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <LogoutIcon className="text-gray-500 w-5 h-5" />
                <span className="hidden md:inline-block ml-3">Logout</span>
              </div>
            </li>
          </ul>
        </div>
      </aside>
      <Modal open={open} setOpen={setOpen}>
        <Profile close={() => setOpen(!open)} userId={userId} />
        {/* <EditUserPage close={() => setOpen(!open)} userId={userId} /> */}
      </Modal>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    authenticateReducer: state.authenticateReducer,
    subRouterReducer: state.subRouterReducer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    doLogout: (refreshToken) => dispatch(logout({ refreshToken })),
    getAllDepartment: (token, data) => dispatch(subRouterUpdate(token, data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SideBar);
