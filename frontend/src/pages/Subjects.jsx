import { useEffect, useState } from "react";
import api from "../services/api";

export default function Subjects() {
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    api.get("/subjects").then(res => setSubjects(res.data.data || res.data));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Subjects</h2>

      <ul className="space-y-2">
        {subjects.map(s => (
          <li key={s.id} className="p-2 bg-gray-100 rounded">
            {s.name} ({s.code})
          </li>
        ))}
      </ul>
    </div>
  );
}