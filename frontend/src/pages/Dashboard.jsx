import { useEffect, useState } from "react";
import api from "../services/api";

export default function Dashboard() {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [assessments, setAssessments] = useState([]);

  useEffect(() => {
    api.get("/students").then(res => setStudents(res.data));
    api.get("/subjects").then(res => setSubjects(res.data));
    api.get("/assessments").then(res => setAssessments(res.data.data || []));
  }, []);

  const avg =
    assessments.reduce((sum, a) => sum + Number(a.totalScore || 0), 0) /
    (assessments.length || 1);

  return (
    <div className="p-6 grid grid-cols-3 gap-4">

      <div className="bg-blue-500 text-white p-4 rounded">
        Students: {students.length}
      </div>

      <div className="bg-green-500 text-white p-4 rounded">
        Subjects: {subjects.length}
      </div>

      <div className="bg-purple-500 text-white p-4 rounded">
        Avg Score: {avg.toFixed(2)}
      </div>

    </div>
  );
}