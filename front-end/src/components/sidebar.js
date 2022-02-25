import {Link} from 'react-router-dom';
import {ChartPieIcon, DocumentDuplicateIcon, UserIcon, UserGroupIcon, LogoutIcon} from '@heroicons/react/solid'
import { connect } from 'react-redux';
import { logout } from "../store/actions/authenticateAction";

const dashBoardRoute = [
  {
    to: "/",
    icon: () => <ChartPieIcon width={30} height={30} className="text-gray-500" />,
    name: "Dashboard",
  },
  {
    to: "/users",
    icon: () => <UserIcon width={30} height={30} className="text-gray-500" />,
    name: "Users",
  },
  {
    to: "/deparments",
    icon: () => <UserGroupIcon width={30} height={30} className="text-gray-500" />,
    name: "Departments",
  },
  {
    to: "/categories",
    icon: () => <DocumentDuplicateIcon width={30} height={30} className="text-gray-500" />,
    name: "Categories",
  },
];

const SideBar = ({authenticateReducer, doLogout}) => {
    return (
      <aside className="w-full h-full dark:bg-gray-800" aria-label="Sidebar">
        <div className="px-3 py-4 overflow-y-auto rounded">
          <ul className="space-y-2">
            {dashBoardRoute.map(({ to, icon: Icon, name }, index) => (
              <li key={index}>
                <Link
                  to={to}
                  className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Icon />
                  <span className="ml-3">{name}</span>
                </Link>
              </li>
            ))}
            <li>
              <Link
                to="/logout"
                className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <LogoutIcon width={30} height={30} className="text-gray-500" />
                <span className="ml-3">Logout</span>
              </Link>
            </li>
          </ul>
        </div>
      </aside>
    );
}

const mapStateToProps = (state) => {
  return {
    authenticateReducer: state.authenticateReducer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    doLogout: (refreshToken) => dispatch(logout({ refreshToken })),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SideBar);