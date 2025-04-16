import EmployeeSlider from "./EmployeeSlider";
import "../Employee/RootLayout.css";
import SideBar from "../../layouts/SideBar";
function RootLayout({ children }) {
  return (
    <div className="mainContainer">
      <div className="crow">
        <div className="sub">
          {/* <EmployeeSlider /> */}
          <SideBar/>
        </div>
        <div className="sub2">{children}</div>
      </div>
    </div>
  );
}

export default RootLayout;
