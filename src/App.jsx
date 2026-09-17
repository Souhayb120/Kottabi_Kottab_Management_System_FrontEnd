import { Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Eleves from "./pages/eleves";
import EleveDetails from "./pages/EleveDetails";
import Enseignants from "./pages/Enseignants";
import Presences from "./pages/Presence";
import Progressions from "./pages/Progression";

function App() {
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
        <Route path="/enseignant" element={<Enseignants />} />
      </Routes>
    </>
  );
}

export default App;
