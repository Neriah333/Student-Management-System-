import { useEffect, useState } from "react";
import api from "../services/api";

export default function Assessments() {
  const [data, setData] = useState([]);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [form, setForm] = useState({
    studentId: "",
    subjectId: "",
    continuousAssessmentScore: "",
    examScore: ""
  });

  const fetchAll = async () => {
    const res = await api.get("/assessments");
    setData(res.data.data || res.data);

    const stu = await api.get("/students");
    setStudents(stu.data);

    const sub = await api.get("/subjects");
    setSubjects(sub.data.data || sub.data);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await api.post("/assessments", form);

    setForm({
      studentId: "",
      subjectId: "",
      continuousAssessmentScore: "",
      examScore: ""
    });

    fetchAll();
  };

  return (
    <div className="p-6 space-y-6">

      {/* FORM */}
      <form onSubmit={handleSubmit} className="bg-gray-100 p-4 space-y-2">

        <select
          value={form.studentId}
          onChange={(e) => setForm({ ...form, studentId: e.target.value })}
          className="border p-2 w-full"
        >
          <option>Select Student</option>
          {students.map(s => (
            <option key={s.id} value={s.id}>
              {s.firstName} {s.lastName}
            </option>
          ))}
        </select>

        <select
          value={form.subjectId}
          onChange={(e) => setForm({ ...form, subjectId: e.target.value })}
          className="border p-2 w-full"
        >
          <option>Select Subject</option>
          {subjects.map(s => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        <input
          placeholder="CA Score"
          value={form.continuousAssessmentScore}
          onChange={(e) => setForm({ ...form, continuousAssessmentScore: e.target.value })}
          className="border p-2 w-full"
        />

        <input
          placeholder="Exam Score"
          value={form.examScore}
          onChange={(e) => setForm({ ...form, examScore: e.target.value })}
          className="border p-2 w-full"
        />

        <button className="bg-blue-600 text-white px-4 py-2">
          Save Marks
        </button>

      </form>

      {/* TABLE */}
      <table className="w-full border">
        <thead>
          <tr>
            <th>Student</th>
            <th>Subject</th>
            <th>Total</th>
            <th>Grade</th>
          </tr>
        </thead>

        <tbody>
          {data.map(a => (
            <tr key={a.id}>
              <td>{a.student.firstName}</td>
              <td>{a.subject.name}</td>
              <td>{a.totalScore}</td>
              <td>{a.grade}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}