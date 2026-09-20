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
import RequireAuth from "./components/RequireAuth";
import NotFound from "./components/NotFound";

function App() {
  const { i18n } = useTranslation();
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/eleve"
          element={
            <RequireAuth>
              <Eleves />
            </RequireAuth>
          }
        />
        <Route
          path="/eleve/details/:username"
          element={
            <RequireAuth>
              <EleveDetails />
            </RequireAuth>
          }
        />
        <Route
          path="/presence"
          element={
            <RequireAuth>
              <Presences />
            </RequireAuth>
          }
        />
        <Route
          path="/progress"
          element={
            <RequireAuth>
              <Progressions />
            </RequireAuth>
          }
        />
        <Route
          path="/competitions"
          element={
            <RequireAuth>
              <Concours />
            </RequireAuth>
          }
        />
        <Route
          path="/participation"
          element={
            <RequireAuth>
              <Participations />
            </RequireAuth>
          }
        />
        <Route
          path="/reports"
          element={
            <RequireAuth>
              <Rapport />
            </RequireAuth>
          }
        />
        <Route
          path="/enseignant"
          element={
            <RequireAuth>
              <Enseignants />
            </RequireAuth>
          }
        />
        <Route path="*" element={<NotFound />} />
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