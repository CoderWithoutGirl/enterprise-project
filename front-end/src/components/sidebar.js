import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  ChartPieIcon,
  DocumentDuplicateIcon,
  UserIcon,
  UserGroupIcon,
  LogoutIcon,
  CalendarIcon
} from "@heroicons/react/solid";
import { connect } from "react-redux";
import { logout } from "../store/actions/authenticateAction";
import { subRouterUpdate } from "../store/actions/subRouterAction";
import { useEffect, useState } from "react";
import {ChevronDoubleDownIcon} from '@heroicons/react/solid'

const SideBar = ({
  authenticateReducer,
  doLogout,
  getAllDepartment,
  subRouterReducer,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = authenticateReducer;
  const { departmentRouters, categoryRouters } = subRouterReducer;
  
  const [toggleRoute, setToggleRoute]  = useState({
    name: '',
    value: false
  });

  const toggleRouterHandler = (e, subRoute) => {
    e.preventDefault();
    setToggleRoute(prev => ({
      name: subRoute,
      value: !prev.value
    }))
  }

  const [dashBoardRoute, setDashBoardRoute] = useState([
    {
      to: "/",
      icon: () => <ChartPieIcon className="text-gray-500 w-[30px] h-[30px]" />,
      name: "Dashboard",
    },
    {
      to: "/users",
      icon: () => <UserIcon className="text-gray-500 w-[30px] h-[30px]" />,
      name: "Users",
    },
    {
      to: "/departments",
      icon: () => <UserGroupIcon className="text-gray-500 w-[30px] h-[30px]" />,
      name: "Departments",
      subRouters: departmentRouters.map((item, index) => ({
        to: `/departments/${item.name}`,
        icon: () => (
          <UserGroupIcon className="text-gray-500 sm:inline-block hidden w-[30px] h-[30px]" />
        ),
        name: item.name,
      })),
    },
    {
      to: "/categories",
      icon: () => (
        <DocumentDuplicateIcon className="text-gray-500 w-[30px] h-[30px]" />
      ),
      name: "Categories",
      subRouters: categoryRouters.map((item, index) => ({
        to: `/categories/${item.name}`,
        icon: () => (
          <UserGroupIcon className="text-gray-500 sm:inline-block hidden w-[30px] h-[30px]" />
        ),
        name: item.name,
      })),
    },
    {
      to: "/academic",
      icon: () => <CalendarIcon className="text-gray-500 w-[30px] h-[30px]" />,
      name: "Academic Years",
    },
  ]);

  const handleLogout = (e) => {
    e.preventDefault();
    doLogout();
    navigate("/login");
  };

  useEffect(() => {
    getAllDepartment(token);
  }, [getAllDepartment, token]);

  return (
    <aside
      className="w-full h-full dark:bg-gray-800 shadow-2xl"
      aria-label="Sidebar"
    >
      <div className="px-3 py-4 overflow-y-auto rounded">
        <ul className="space-y-2">
          <div className="flex sm:flex-row flex-col items-center justify-center">
            <div className="shrink-0">
              <img
                src="https://mdbcdn.b-cdn.net/img/new/avatars/8.webp"
                className="rounded-full w-10"
                alt="Avatar"
              />
            </div>
            <div className="grow ml-3">
              <p className="hidden sm:inline-block text-sm font-semibold text-blue-600">
                {authenticateReducer?.user?.fullname}
              </p>
            </div>
          </div>
          {dashBoardRoute.map(({ to, icon: Icon, name, subRouters }, index) => (
            <li key={index}>
              <Link
                to={to}
                className={`flex items-center p-2 text-base justify-between font-normal ${
                  location.pathname === to
                    ? "bg-gray-700 dark:bg-gray-900"
                    : "bg-inherit"
                } text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700`}
              >
                <div className="flex">
                  <Icon />
                  <span className="hidden sm:inline-block ml-3">{name}</span>
                </div>
                {subRouters && (
                  <button
                    className="hover:bg-gray-500"
                    onClick={(e) => toggleRouterHandler(e, name.toLowerCase())}
                  >
                    <ChevronDoubleDownIcon
                      width={30}
                      height={30}
                      className="text-gray-500"
                    />
                  </button>
                )}
              </Link>

              {subRouters && (
                <ul
                  className={`${
                    (toggleRoute.name === name.toLowerCase()) &
                    toggleRoute.value
                      ? null
                      : "hidden"
                  } sm:ml-4 space-y-2`}
                >
                  {subRouters?.map(({ name, icon: Icon, to }, index) => (
                    <li key={index}>
                      <Link
                        to={to}
                        className={`flex items-center p-2 text-base font-normal ${
                          location.pathname === to
                            ? "bg-gray-700 dark:bg-gray-900"
                            : "bg-inherit"
                        } text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700`}
                      >
                        <Icon />
                        <span className="sm:ml-3">
                          {name}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
          <li>
            <Link
              to="/"
              onClick={handleLogout}
              className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <LogoutIcon className="text-gray-500 w-[30px] h-[30px]" />
              <span className="hidden sm:inline-block ml-3">Logout</span>
            </Link>
          </li>
        </ul>
      </div>
    </aside>
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
