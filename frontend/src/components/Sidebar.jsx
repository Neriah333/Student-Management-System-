import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-gray-900 text-white p-4">
      <h1 className="text-xl font-bold mb-6">School Admin</h1>

      <nav className="space-y-3">
        <Link to="/" className="block">Dashboard</Link>
        <Link to="/students" className="block">Students</Link>
        <Link to="/subjects" className="block">Subjects</Link>
        <Link to="/assessments" className="block">Assessments</Link>
        <Link to="/rankings" className="block">Rankings</Link>
      </nav>
    </div>
  );
}