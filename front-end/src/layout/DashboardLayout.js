import SideBar from "../components/sidebar";

const DashBoardLayout = ({ children }) => {
  return (
    <div className="w-full h-screen flex">
      <div className="w-1/6 h-full">
        <SideBar />
      </div>
      <main className="w-5/6 h-full">{children}</main>
    </div>
  );
};
export default DashBoardLayout;
