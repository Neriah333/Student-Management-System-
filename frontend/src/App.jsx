import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Subjects from "./pages/Subjects";
import Assessments from "./pages/Assessments";
import Rankings from "./pages/Ranking";

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex">
        <Sidebar />

        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/students" element={<Students />} />
            <Route path="/subjects" element={<Subjects />} />
            <Route path="/assessments" element={<Assessments />} />
            <Route path="/rankings" element={<Rankings />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}