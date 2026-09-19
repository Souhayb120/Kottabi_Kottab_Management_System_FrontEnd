import Sidebar from "../components/SideBar";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import ConcourList from "../components/ConcourList";

const Concours = () => {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main">
        <NavBar />
        <div className="content">
          <ConcourList />
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Concours;