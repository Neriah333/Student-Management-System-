import { useEffect, useState } from "react";
import api from "../services/api";

export default function Rankings() {
  const [rankings, setRankings] = useState([]);

  useEffect(() => {
    api.get("/results/class-ranking?classStreamId=1")
      .then(res => setRankings(res.data.data));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Class Rankings</h2>

      <ol className="space-y-2">
        {rankings.map(r => (
          <li key={r.rank} className="p-2 bg-yellow-100 rounded">
            #{r.rank} {r.student.name} - {r.totalScore}
          </li>
        ))}
      </ol>
    </div>
  );
}