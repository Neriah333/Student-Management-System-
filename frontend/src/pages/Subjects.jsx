import { useEffect, useState } from "react";
import api from "../services/api";

export default function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [streams, setStreams] = useState([]);

  const [form, setForm] = useState({
    name: "",
    code: ""
  });

  const [editingId, setEditingId] = useState(null);

  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedStream, setSelectedStream] = useState("");

  // ======================
  // FETCH SUBJECTS
  // ======================
  const fetchSubjects = async () => {
    try {
      const res = await api.get("/subjects");
      setSubjects(res.data.data || res.data || []);
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  // ======================
  // FETCH STREAMS
  // ======================
  const fetchStreams = async () => {
    try {
      const res = await api.get("/classstreams");
      setStreams(res.data.data || res.data || []);
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchSubjects();
    fetchStreams();
  }, []);

  // ======================
  // CREATE / UPDATE SUBJECT
  // ======================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await api.put(`/subjects/${editingId}`, form);
      } else {
        await api.post("/subjects", form);
      }

      setForm({ name: "", code: "" });
      setEditingId(null);
      fetchSubjects();
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  // ======================
  // DELETE SUBJECT
  // ======================
  const handleDelete = async (id) => {
    try {
      await api.delete(`/subjects/${id}`);
      fetchSubjects();
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  // ======================
  // ASSIGN SUBJECT → STREAM
  // ======================
  const assignSubjectToStream = async () => {
    if (!selectedSubject || !selectedStream) {
      return alert("Select subject and stream");
    }

    try {
      await api.post("/subject-streams", {
        subjectId: selectedSubject,
        classStreamId: selectedStream
      });

      alert("Subject assigned successfully");
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  return (
    <div className="p-6 space-y-8">

      {/* ================= SUBJECT FORM ================= */}
      <div className="bg-white p-4 shadow rounded">
        <h2 className="text-xl font-bold mb-3">
          {editingId ? "Edit Subject" : "Add Subject"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-2">
          <input
            className="border p-2 w-full"
            placeholder="Subject Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            className="border p-2 w-full"
            placeholder="Subject Code"
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value })}
          />

          <button className="bg-green-600 text-white px-4 py-2">
            {editingId ? "Update Subject" : "Save Subject"}
          </button>
        </form>
      </div>

      {/* ================= ASSIGN SUBJECT TO STREAM ================= */}
      <div className="bg-blue-50 p-4 shadow rounded">
        <h2 className="font-bold mb-3">Assign Subject to Stream</h2>

        <div className="flex gap-2">
          <select
            className="border p-2 w-1/2"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
          >
            <option value="">Select Subject</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          <select
            className="border p-2 w-1/2"
            value={selectedStream}
            onChange={(e) => setSelectedStream(e.target.value)}
          >
            <option value="">Select Stream</option>
            {streams.map((s) => (
              <option key={s.id} value={s.id}>
                {s.form} {s.stream}
              </option>
            ))}
          </select>

          <button
            onClick={assignSubjectToStream}
            className="bg-blue-600 text-white px-4"
          >
            Assign
          </button>
        </div>
      </div>

      {/* ================= SUBJECT LIST ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {subjects.map((s) => (
          <div key={s.id} className="bg-white p-4 shadow rounded">
            <h3 className="font-bold">{s.name}</h3>
            <p className="text-sm text-gray-500">{s.code}</p>

            <div className="flex gap-2 mt-3">
              <button
                onClick={() => {
                  setForm({ name: s.name, code: s.code });
                  setEditingId(s.id);
                }}
                className="bg-yellow-400 px-2"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(s.id)}
                className="bg-red-500 px-2 text-white"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}