import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Stream() {
  const [streams, setStreams] = useState([]);

  const [form, setForm] = useState("");
  const [stream, setStream] = useState("");

  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState("");
  const [editStream, setEditStream] = useState("");

  // ======================
  // FETCH STREAMS
  // ======================
  const fetchStreams = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/classstreams");
      setStreams(res.data);
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchStreams();
  }, []);

  // ======================
  // ADD STREAM
  // ======================
  const handleAdd = async (e) => {
    e.preventDefault();

    if (!form || !stream) return alert("Select form and stream");

    await axios.post("http://localhost:5000/api/classstreams", {
      form,
      stream,
    });

    setForm("");
    setStream("");
    fetchStreams();
  };

  // ======================
  // DELETE STREAM
  // ======================
  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/classstreams/${id}`);
    fetchStreams();
  };

  // ======================
  // UPDATE STREAM
  // ======================
  const handleUpdate = async () => {
    await axios.put(`http://localhost:5000/api/classstreams/${editId}`, {
      form: editForm,
      stream: editStream,
    });

    setEditId(null);
    fetchStreams();
  };

  return (
    <div className="p-6 space-y-6">

      {/* ================= ADD ================= */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-bold mb-3">Add Stream</h2>

        <form onSubmit={handleAdd} className="flex gap-3">

          <select
            className="border p-2 rounded w-1/3"
            value={form}
            onChange={(e) => setForm(e.target.value)}
          >
            <option value="">Select Form</option>
            <option>Form 1</option>
            <option>Form 2</option>
            <option>Form 3</option>
            <option>Form 4</option>
          </select>

          <select
            className="border p-2 rounded w-1/3"
            value={stream}
            onChange={(e) => setStream(e.target.value)}
          >
            <option value="">Select Stream</option>
            <option>A</option>
            <option>B</option>
            <option>C</option>
          </select>

          <button className="bg-blue-500 text-white px-4 rounded">
            Add
          </button>
        </form>
      </div>

      {/* ================= LIST ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {streams.map((s) => (
          <div key={s.id} className="bg-white p-4 shadow rounded">

            {/* VIEW SINGLE STREAM */}
            <Link
              to={`/streams/${s.id}`}
              className="text-lg font-bold text-blue-600"
            >
              {s.form} {s.stream}
            </Link>

            {/* students */}
            <p className="text-sm text-gray-500">
              Students: {s.students?.length || 0}
            </p>

            {/* subjects (ONLY works if backend includes them) */}
            <p className="text-sm text-gray-500">
              Subjects: {s.subjects?.length || 0}
            </p>

            <div className="flex gap-2 mt-2">
              <button
                onClick={() => {
                  setEditId(s.id);
                  setEditForm(s.form);
                  setEditStream(s.stream);
                }}
                className="bg-yellow-400 px-3 py-1 rounded"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(s.id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* ================= EDIT MODAL ================= */}
      {editId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-96 space-y-3">

            <h2 className="font-bold">Edit Stream</h2>

            <select
              value={editForm}
              onChange={(e) => setEditForm(e.target.value)}
              className="border p-2 w-full"
            >
              <option>Form 1</option>
              <option>Form 2</option>
              <option>Form 3</option>
              <option>Form 4</option>
            </select>

            <select
              value={editStream}
              onChange={(e) => setEditStream(e.target.value)}
              className="border p-2 w-full"
            >
              <option>A</option>
              <option>B</option>
              <option>C</option>
            </select>

            <button
              onClick={handleUpdate}
              className="bg-green-500 text-white px-3 py-1"
            >
              Update
            </button>

          </div>
        </div>
      )}
    </div>
  );
}