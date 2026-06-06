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
    examScore: "",
  });

  // FIX: safe extractor
  const extract = (res) => res?.data?.data ?? res?.data ?? [];

  const fetchAll = async () => {
    try {
      const [a, s, su] = await Promise.all([
        api.get("/assessments"),
        api.get("/students"),
        api.get("/subjects"),
      ]);

      setData(extract(a));
      setStudents(extract(s));
      setSubjects(extract(su));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await api.post("/assessments", {
      ...form,
      studentId: Number(form.studentId),
      subjectId: Number(form.subjectId),
      continuousAssessmentScore: Number(form.continuousAssessmentScore),
      examScore: Number(form.examScore),
    });

    setForm({
      studentId: "",
      subjectId: "",
      continuousAssessmentScore: "",
      examScore: "",
    });

    fetchAll();
  };

  return (
    <div className="p-6 space-y-6">

      <form onSubmit={handleSubmit} className="space-y-3">

        <select
          value={form.studentId}
          onChange={(e) => setForm({ ...form, studentId: e.target.value })}
        >
          <option value="">Select Student</option>
          {students.map((s) => (
            <option key={s.id} value={s.id}>
              {s.firstName} {s.lastName}
            </option>
          ))}
        </select>

        <select
          value={form.subjectId}
          onChange={(e) => setForm({ ...form, subjectId: e.target.value })}
        >
          <option value="">Select Subject</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="CA"
          value={form.continuousAssessmentScore}
          onChange={(e) =>
            setForm({ ...form, continuousAssessmentScore: e.target.value })
          }
        />

        <input
          type="number"
          placeholder="Exam"
          value={form.examScore}
          onChange={(e) =>
            setForm({ ...form, examScore: e.target.value })
          }
        />

        <button>Save</button>
      </form>

      <table border="1">
        <thead>
          <tr>
            <th>Student</th>
            <th>Subject</th>
            <th>Total</th>
            <th>Grade</th>
          </tr>
        </thead>

        <tbody>
          {data.map((a) => (
            <tr key={a.id}>
              <td>{a.student?.firstName}</td>
              <td>{a.subject?.name}</td>
              <td>{a.totalScore}</td>
              <td>{a.grade}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}