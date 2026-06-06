import { useEffect, useState } from "react";
import api from "../services/api";

export default function Subjects() {
  const [subjects, setSubjects] = useState([]);

  const [form, setForm] = useState({
    name: "",
    code: ""
  });

  const [editingId, setEditingId] = useState(null);

  const fetchSubjects = async () => {
    const res = await api.get("/subjects");
    setSubjects(res.data.data || res.data);
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId) {
      await api.put(`/subjects/${editingId}`, form);
    } else {
      await api.post("/subjects", form);
    }

    setForm({ name: "", code: "" });
    setEditingId(null);
    fetchSubjects();
  };

  const handleDelete = async (id) => {
    await api.delete(`/subjects/${id}`);
    fetchSubjects();
  };

  return (
    <div className="p-6 space-y-6">

      <form onSubmit={handleSubmit} className="bg-gray-100 p-4 space-y-2">
        <input
          name="name"
          placeholder="Subject Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border p-2 w-full"
        />

        <input
          name="code"
          placeholder="Subject Code"
          value={form.code}
          onChange={(e) => setForm({ ...form, code: e.target.value })}
          className="border p-2 w-full"
        />

        <button className="bg-green-600 text-white px-4 py-2">
          {editingId ? "Update" : "Save"}
        </button>
      </form>

      <ul className="space-y-2">
        {subjects.map(s => (
          <li key={s.id} className="flex justify-between bg-gray-200 p-2">
            {s.name} ({s.code})

            <div className="space-x-2">
              <button onClick={() => setForm(s)} className="bg-yellow-500 px-2 text-white">
                Edit
              </button>

              <button onClick={() => handleDelete(s.id)} className="bg-red-500 px-2 text-white">
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

    </div>
  );
}