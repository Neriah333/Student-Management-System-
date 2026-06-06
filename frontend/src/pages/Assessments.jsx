import { useEffect, useState } from "react";
import api from "../services/api";

export default function Assessments() {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get("/assessments").then(res => setData(res.data.data));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Assessments</h2>

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
            <tr key={a.id} className="border-t">
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