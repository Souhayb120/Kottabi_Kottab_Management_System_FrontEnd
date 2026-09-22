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
import EnseignantDetails from "./pages/EnseignantDetails";
import Presences from "./pages/Presence";
import Progressions from "./pages/Progression";
import Concours from "./pages/Concours";
import Rapport from "./pages/Rapport";
import Participations from "./pages/Participations";
import AuthGuard from "./guards/AuthGuard";
import RoleGuard from "./guards/RoleGuard";
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
            <AuthGuard>
              <RoleGuard roles={["ROLE_ADMIN", "ROLE_ENSEIGNANT", "ROLE_ELEVE"]}>
                <Dashboard />
              </RoleGuard>
            </AuthGuard>
          }
        />
        <Route
          path="/eleve"
          element={
            <AuthGuard>
              <RoleGuard roles={["ROLE_ADMIN"]}>
                <Eleves />
              </RoleGuard>
            </AuthGuard>
          }
        />
        <Route
          path="/eleve/details/:username"
          element={
            <AuthGuard>
              <RoleGuard roles={["ROLE_ADMIN", "ROLE_ELEVE"]}>
                <EleveDetails />
              </RoleGuard>
            </AuthGuard>
          }
        />
        <Route
          path="/presence"
          element={
            <AuthGuard>
              <RoleGuard roles={["ROLE_ADMIN", "ROLE_ENSEIGNANT"]}>
                <Presences />
              </RoleGuard>
            </AuthGuard>
          }
        />
        <Route
          path="/progress"
          element={
            <AuthGuard>
              <RoleGuard roles={["ROLE_ADMIN", "ROLE_ENSEIGNANT"]}>
                <Progressions />
              </RoleGuard>
            </AuthGuard>
          }
        />
        <Route
          path="/competitions"
          element={
            <AuthGuard>
              <RoleGuard roles={["ROLE_ADMIN"]}>
                <Concours />
              </RoleGuard>
            </AuthGuard>
          }
        />
        <Route
          path="/participation"
          element={
            <AuthGuard>
              <RoleGuard roles={["ROLE_ADMIN", "ROLE_ENSEIGNANT"]}>
                <Participations />
              </RoleGuard>
            </AuthGuard>
          }
        />
        <Route
          path="/enseignant/details/:username"
          element={
            <AuthGuard>
              <RoleGuard roles={["ROLE_ADMIN", "ROLE_ENSEIGNANT"]}>
                <EnseignantDetails />
              </RoleGuard>
            </AuthGuard>
          }
        />
        <Route
          path="/reports"
          element={
            <AuthGuard>
              <RoleGuard roles={["ROLE_ADMIN", "ROLE_ENSEIGNANT"]}>
                <Rapport />
              </RoleGuard>
            </AuthGuard>
          }
        />
        <Route
          path="/enseignant"
          element={
            <AuthGuard>
              <RoleGuard roles={["ROLE_ADMIN"]}>
                <Enseignants />
              </RoleGuard>
            </AuthGuard>
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