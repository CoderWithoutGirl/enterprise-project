import React, { useState, useEffect, useCallback } from "react";
import { countIdea, tokenRequestInterceptor } from "../../apiServices/index.js";
import { getNewToken } from "../../store/actions/authenticateAction";
import ReactApexChart from "react-apexcharts";
import { connect } from "react-redux";
import FindPost from "./findPost.js";
import StaffPostedDepart from "./StaffPostedDepart.js";
import DepartmentChart from "./DepartmentChart.js";

const CoordinatorStatistic = ({ authenticateReducer, getNewTokenRequest }) => {
  const { token } = authenticateReducer;

  const [categories, setCategories] = useState([]);
  const [data, setData] = useState([]);

  const loadData = useCallback(async () => {
    const department = [];
    const count = [];
    const loadAllDataOfIdea = async () => {
      const { data, status } = await countIdea(token);
      return { data, status };
    };
    const { status, data } = await tokenRequestInterceptor(
      loadAllDataOfIdea,
      getNewTokenRequest
    );
    if (status === 200) {
      data.map(async (item) => {
        await department.push(item._id);
        await count.push(item.count);
        setCategories(department);
        setData(count);
      });
    }
  }, [token, getNewTokenRequest]);

  useEffect(() => {
    loadData();
  }, [loadData]);
  return (
    <div className="my-5 w-full flex justify-center items-center">
      <div className="w-4/5 grid grid-cols-4 grid-row-3 gap-8">
        <div className="col-span-4 lg:col-span-2 lg:row-span-3 border rounded-md px-4 py-3 shadow-xl h-full">
          <span className="text-xs font-bold text-gray-500">
            User's submitted Ideas
          </span>
          <DepartmentChart />
        </div>
        <div className="col-span-4 lg:col-span-2 lg:row-span-3 border rounded-md px-4 py-3 shadow-2xl w-full h-fit">
          <span className="text-xs font-bold text-gray-500">
            Percentage of users had submitted/not yet
          </span>
          <StaffPostedDepart />
        </div>
      </div>
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    authenticateReducer: state.authenticateReducer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getNewTokenRequest: () => dispatch(getNewToken()),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(CoordinatorStatistic);
