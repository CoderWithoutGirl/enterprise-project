import React, { useState, useEffect, useCallback } from "react";
import { countIdea, tokenRequestInterceptor } from "../../apiServices/index.js";
import { getNewToken } from "../../store/actions/authenticateAction";
import ReactApexChart from "react-apexcharts";
import { connect } from "react-redux";
import FindPost from "./findPost.js";

const ManagerStatistic = ({ authenticateReducer, getNewTokenRequest }) => {
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
            Users had posted ideas/not yet in each department
          </span>
          <FindPost />
        </div>
        <div className="col-span-4 lg:col-span-2 border rounded-md px-4 py-3 shadow-2xl h-fit">
          <span className="text-xs font-bold text-gray-500">
            Ideas Submitted of each department
          </span>
          <ReactApexChart
            height={300}
            options={{
              chart: {
                id: "apexchart-example",
              },
              xaxis: {
                categories: categories,
              },
            }}
            series={[
              {
                name: "series-1",
                data: data,
              },
            ]}
            type="bar"
          />
        </div>
        <div className="col-span-4 lg:col-span-2 border rounded-md px-4 py-3 shadow-2xl w-full h-fit">
          <span className="text-xs font-bold text-gray-500">
            Percentage of users in department
          </span>
          <ReactApexChart
            type="pie"
            options={{
              labels: categories,
            }}
            series={data}
            width="100%"
          />
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
export default connect(mapStateToProps, mapDispatchToProps)(ManagerStatistic);
