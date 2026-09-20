import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useTranslation } from "react-i18next";
import "react-toastify/dist/ReactToastify.css";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Eleves from "./pages/eleves";
import EleveDetails from "./pages/EleveDetails";
import Enseignants from "./pages/Enseignants";
import Presences from "./pages/Presence";
import Progressions from "./pages/Progression";
import Concours from "./pages/Concours";
import Rapport from "./pages/Rapport";
import Participations from "./pages/Participations";

function App() {
  const { i18n } = useTranslation();
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/eleve" element={<Eleves />} />
        <Route path="/eleve/details/:username" element={<EleveDetails />} />
        <Route path="/presence" element={<Presences />} />
        <Route path="/progress" element={<Progressions />} />
        <Route path="/competitions" element={<Concours />} />
        <Route path="/participation" element={<Participations />} />
        <Route path="/reports" element={<Rapport />} />
        <Route path="/enseignant" element={<Enseignants />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={i18n.language === "ar"}
        theme="light"
      />
    </>
  );
}

export default App;
