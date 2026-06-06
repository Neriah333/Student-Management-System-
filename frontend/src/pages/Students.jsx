import { useEffect, useState } from "react";
import api from "../services/api";

export default function Students() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    api.get("/students").then(res => setStudents(res.data));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Students</h2>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th>Name</th>
            <th>Admission No</th>
          </tr>
        </thead>

        <tbody>
          {students.map(s => (
            <tr key={s.id} className="border-t">
              <td>{s.firstName} {s.lastName}</td>
              <td>{s.admissionNumber}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}