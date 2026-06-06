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

    if (!form || !stream) {
      alert("Please select form and stream");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/classstreams", {
        form,
        stream,
      });

      setForm("");
      setStream("");
      fetchStreams();
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  // ======================
  // DELETE STREAM
  // ======================
  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/classstreams/${id}`
      );
      fetchStreams();
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  // ======================
  // OPEN EDIT
  // ======================
  const openEdit = (s) => {
    setEditId(s.id);
    setEditForm(s.form);
    setEditStream(s.stream);
  };

  // ======================
  // UPDATE STREAM
  // ======================
  const handleUpdate = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/classstreams/${editId}`,
        {
          form: editForm,
          stream: editStream,
        }
      );

      setEditId(null);
      fetchStreams();
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  return (
    <div className="p-6 space-y-6">

      {/* ================= ADD FORM ================= */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-bold mb-3">Add Stream</h2>

        <form onSubmit={handleAdd} className="flex gap-3">

          {/* FORM DROPDOWN */}
          <select
            className="border p-2 rounded w-1/3"
            value={form}
            onChange={(e) => setForm(e.target.value)}
          >
            <option value="">Select Form</option>
            <option value="Form 1">Form 1</option>
            <option value="Form 2">Form 2</option>
            <option value="Form 3">Form 3</option>
            <option value="Form 4">Form 4</option>
          </select>

          {/* STREAM DROPDOWN */}
          <select
            className="border p-2 rounded w-1/3"
            value={stream}
            onChange={(e) => setStream(e.target.value)}
          >
            <option value="">Select Stream</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
          </select>

          <button className="bg-blue-500 text-white px-4 rounded">
            Add
          </button>
        </form>
      </div>

      {/* ================= STREAM CARDS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {streams.map((s) => (
          <div
            key={s.id}
            className="bg-white p-4 shadow rounded space-y-2"
          >
            <Link
            to={`/streams/${s.id}`}
            className="text-lg font-bold text-blue-600 hover:underline"
            >
            {s.form} {s.stream}
            </Link>

            <p className="text-sm text-gray-500">
              Students: {s.students?.length || 0}
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => openEdit(s)}
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

            <h2 className="text-xl font-bold">Edit Stream</h2>

            <select
              className="border p-2 w-full"
              value={editForm}
              onChange={(e) => setEditForm(e.target.value)}
            >
              <option value="">Select Form</option>
              <option value="Form 1">Form 1</option>
              <option value="Form 2">Form 2</option>
              <option value="Form 3">Form 3</option>
              <option value="Form 4">Form 4</option>
            </select>

            <select
              className="border p-2 w-full"
              value={editStream}
              onChange={(e) => setEditStream(e.target.value)}
            >
              <option value="">Select Stream</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
            </select>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditId(null)}
                className="px-3 py-1"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdate}
                className="bg-green-500 text-white px-3 py-1 rounded"
              >
                Update
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}