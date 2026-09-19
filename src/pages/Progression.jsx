import Sidebar from "../components/SideBar";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import ProgressionList from "../components/ProgressionList";

const Progressions = () => {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main">
        <NavBar />
        <div className="content">
          <ProgressionList />
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Progressions;