import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import Streams from "./pages/Streams";
import StreamDetails from "./pages/StreamDetails";
import Students from "./pages/Students";
import Subjects from "./pages/Subjects";
import Assessments from "./pages/Assessments";
import Rankings from "./pages/Ranking";
import Reportcard from "./pages/Reportcard";

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col md:flex-row">
        <Sidebar />

        <div className="flex-1 min-h-screen">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/classes" element={<Streams />} />
            <Route path="/streams/:id" element={<StreamDetails />} />
            <Route path="/students" element={<Students />} />
            <Route path="/subjects" element={<Subjects />} />
            <Route path="/assessments" element={<Assessments />} />
            <Route path="/rankings" element={<Rankings />} />
            <Route path="/report-card/:studentId" element={<Reportcard />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}