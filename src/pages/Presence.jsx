import Sidebar from "../components/SideBar";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import PresenceList from "../components/PresenceList";

const Presences = () => {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main">
        <NavBar />
        <div className="content">
          <PresenceList />
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Presences;