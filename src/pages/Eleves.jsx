import Sidebar from "../components/SideBar";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import EleveList from "../components/EleveList";

const Eleves = () => {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main">
        <NavBar />
        <div className="content">
          <EleveList />
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Eleves;