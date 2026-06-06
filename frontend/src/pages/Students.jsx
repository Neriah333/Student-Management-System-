import { useEffect, useState } from "react";
import api from "../services/api";

export default function Students() {
  const [students, setStudents] = useState([]);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    admissionNumber: ""
  });

  const [editingId, setEditingId] = useState(null);

  // ======================
  // FETCH
  // ======================
  const fetchStudents = async () => {
    const res = await api.get("/students");
    setStudents(res.data);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // ======================
  // HANDLE INPUT
  // ======================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ======================
  // CREATE OR UPDATE
  // ======================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId) {
      await api.put(`/students/${editingId}`, form);
    } else {
      await api.post("/students", form);
    }

    setForm({ firstName: "", lastName: "", admissionNumber: "" });
    setEditingId(null);
    fetchStudents();
  };

  // ======================
  // EDIT
  // ======================
  const handleEdit = (student) => {
    setForm(student);
    setEditingId(student.id);
  };

  // ======================
  // DELETE
  // ======================
  const handleDelete = async (id) => {
    await api.delete(`/students/${id}`);
    fetchStudents();
  };

  return (
    <div className="p-6 space-y-6">

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-2 bg-gray-100 p-4 rounded">
        <h2 className="font-bold">
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

        <button className="bg-blue-500 text-white px-4 py-2">
          {editingId ? "Update" : "Save"}
        </button>
      </form>

      {/* TABLE */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th>Name</th>
            <th>Admission</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {students.map(s => (
            <tr key={s.id} className="border-t">
              <td>{s.firstName} {s.lastName}</td>
              <td>{s.admissionNumber}</td>

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