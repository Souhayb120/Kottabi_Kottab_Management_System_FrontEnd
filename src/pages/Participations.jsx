import Sidebar from "../components/SideBar";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import ParticipationList from "../components/ParticipationList";

const Participations = () => {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main">
        <NavBar />
        <div className="content">
          <ParticipationList />
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Participations;