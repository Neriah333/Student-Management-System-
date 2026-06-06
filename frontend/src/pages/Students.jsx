import { useEffect, useState } from "react";
import api from "../services/api";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [streams, setStreams] = useState([]);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    admissionNumber: ""
  });

  const [classStreamId, setClassStreamId] = useState("");
  const [editingId, setEditingId] = useState(null);

  // ======================
  // FETCH STUDENTS
  // ======================
  const fetchStudents = async () => {
    try {
      const res = await api.get("/students");
      setStudents(res.data.data || res.data || []);
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
    fetchStudents();
    fetchStreams();
  }, []);

  // ======================
  // HANDLE INPUT
  // ======================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ======================
  // SUBMIT (CREATE / UPDATE)
  // ======================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      firstName: form.firstName,
      lastName: form.lastName,
      admissionNumber: form.admissionNumber,
      classStreamId: classStreamId
    };

    try {
      if (editingId) {
        await api.put(`/students/${editingId}`, payload);
      } else {
        await api.post("/students", payload);
      }

      setForm({ firstName: "", lastName: "", admissionNumber: "" });
      setClassStreamId("");
      setEditingId(null);
      fetchStudents();

    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  // ======================
  // EDIT
  // ======================
  const handleEdit = (student) => {
    setForm({
      firstName: student.firstName,
      lastName: student.lastName,
      admissionNumber: student.admissionNumber
    });

    setClassStreamId(student.classStreamId || "");
    setEditingId(student.id);
  };

  // ======================
  // DELETE
  // ======================
  const handleDelete = async (id) => {
    try {
      await api.delete(`/students/${id}`);
      fetchStudents();
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  return (
    <div className="p-6 space-y-6">

      {/* ================= FORM ================= */}
      <form
        onSubmit={handleSubmit}
        className="space-y-3 bg-gray-100 p-4 rounded"
      >
        <h2 className="font-bold text-lg">
          {editingId ? "Edit Student" : "Add Student"}
        </h2>

        <input
          name="firstName"
          placeholder="First Name"
          value={form.firstName}
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <input
          name="lastName"
          placeholder="Last Name"
          value={form.lastName}
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <input
          name="admissionNumber"
          placeholder="Admission Number"
          value={form.admissionNumber}
          onChange={handleChange}
          className="border p-2 w-full"
        />

        {/* STREAM DROPDOWN */}
        <select
          value={classStreamId}
          onChange={(e) => setClassStreamId(e.target.value)}
          className="border p-2 w-full"
        >
          <option value="">Select Class Stream</option>
          {streams.map((s) => (
            <option key={s.id} value={s.id}>
              {s.form} {s.stream}
            </option>
          ))}
        </select>

        <button className="bg-blue-500 text-white px-4 py-2">
          {editingId ? "Update" : "Save"}
        </button>
      </form>

      {/* ================= TABLE ================= */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th>Name</th>
            <th>Admission</th>
            <th>Stream</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {students.map((s) => (
            <tr key={s.id} className="border-t">
              <td>{s.firstName} {s.lastName}</td>
              <td>{s.admissionNumber}</td>

              <td>
                {s.classStream
                  ? `${s.classStream.form} ${s.classStream.stream}`
                  : "Not assigned"}
              </td>

              <td className="space-x-2">
                <button
                  onClick={() => handleEdit(s)}
                  className="bg-yellow-500 px-2 text-white"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(s.id)}
                  className="bg-red-500 px-2 text-white"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}