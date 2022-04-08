import React from "react";
import StaffPostedDepart from "./StaffPostedDepart.js";
import DepartmentChart from "./DepartmentChart.js";

const CoordinatorStatistic = () => {
    document.title = "Statistics";

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

export default CoordinatorStatistic;
