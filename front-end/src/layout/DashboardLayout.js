import SideBar from "../components/sidebar";

const DashBoardLayout = ({ children }) => {
  return (
    <div className="w-full h-screen flex">
      <div className="w-max sm:w-1/6 h-full">
        <SideBar />
      </div>
      <main className="w-5/6 flex justify-center h-full">
        <div className="w-4/5 sm:mt-20">{children}</div>
      </main>
    </div>
  );
};
export default DashBoardLayout;
