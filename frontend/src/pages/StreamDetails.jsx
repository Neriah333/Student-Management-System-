import { useEffect, useState } from "react";
import api from "../services/api";
import { useParams } from "react-router-dom";

export default function StreamDetails() {
  const { id } = useParams();
  const [stream, setStream] = useState(null);

  useEffect(() => {
    const fetchStream = async () => {
      try {
        const res = await api.get(`/classstreams/${id}`);
        setStream(res.data.data || res.data || null);
      } catch (err) {
        console.log(err.response?.data || err.message);
      }
    };

    fetchStream();
  }, [id]);

  if (!stream) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 space-y-6">

      {/* STREAM HEADER */}
      <div className="bg-white p-4 shadow rounded">
        <h1 className="text-2xl font-bold">
          {stream.form} {stream.stream}
        </h1>

        <p className="text-gray-600">
          Total Students: {stream.students?.length || 0}
        </p>
      </div>

      {/* STUDENT LIST */}
      <div className="bg-white p-4 shadow rounded">
        <h2 className="font-bold mb-3">Students in this Stream</h2>

        {stream.students?.length === 0 ? (
          <p>No students assigned</p>
        ) : (
          <ul className="space-y-2">
            {stream.students.map((student) => (
              <li
                key={student.id}
                className="border p-2 rounded"
              >
                {student.firstName} {student.lastName}
              </li>
            ))}
          </ul>
        )}
      </div>

    </div>
  );
}