import Sidebar from "../components/SideBar";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import EnseignantList from "../components/EnseignantList";

const Enseignants = () => {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main">
        <NavBar />
        <div className="content">
          <EnseignantList />
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Enseignants;