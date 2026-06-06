import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Layers,
  BookOpen,
  ClipboardList,
  Trophy,
} from "lucide-react";

export default function Sidebar() {
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 p-2 rounded ${
      isActive ? "bg-blue-500 text-white" : "hover:bg-gray-200"
    }`;

  return (
    <div className="w-full md:w-64 md:h-screen bg-gray-100 p-4 space-y-2">

      <div className="mb-6 mt-4 px-2 border-b pb-4">
        <h1 className="text-xl font-bold mb-4">Student Management System</h1>
      </div>

      <NavLink to="/" className={linkClass}>
        <LayoutDashboard size={18} />
        Dashboard
      </NavLink>

      <NavLink to="/classes" className={linkClass}>
        <Layers size={18} />
        Streams
      </NavLink>

      <NavLink to="/students" className={linkClass}>
        <Users size={18} />
        Students
      </NavLink>

      <NavLink to="/subjects" className={linkClass}>
        <BookOpen size={18} />
        Subjects
      </NavLink>

      <NavLink to="/assessments" className={linkClass}>
        <ClipboardList size={18} />
        Assessments
      </NavLink>

      <NavLink to="/rankings" className={linkClass}>
        <Trophy size={18} />
        Rankings
      </NavLink>
    </div>
  );
}