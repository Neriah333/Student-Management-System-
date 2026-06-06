import { useEffect, useState } from "react";
import api from "../services/api";

export default function Rankings() {
  const [streams, setStreams] = useState([]);
  const [selectedStreamId, setSelectedStreamId] = useState(null);
  const [rankings, setRankings] = useState([]);
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStreams = async () => {
      try {
        const res = await api.get("/classstreams");
        const data = res.data.data || res.data || [];
        setStreams(data);
        if (data.length > 0) {
          setSelectedStreamId(data[0].id);
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Failed to load streams.");
      }
    };

    fetchStreams();
  }, []);

  useEffect(() => {
    if (!selectedStreamId) return;

    const fetchRanking = async () => {
      setLoading(true);
      try {
        const [rankRes, perfRes] = await Promise.all([
          api.get(`/results/class-ranking?classStreamId=${selectedStreamId}`),
          api.get(`/results/class-performance?classStreamId=${selectedStreamId}`),
        ]);

        setRankings(rankRes.data.data || rankRes.data || []);
        setPerformance(perfRes.data || null);
        setError("");
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Failed to load ranking data.");
      } finally {
        setLoading(false);
      }
    };

    fetchRanking();
  }, [selectedStreamId]);

  const downloadUrl = selectedStreamId
    ? `${api.defaults.baseURL.replace(/\/$/, "")}/pdf/class-performance/${selectedStreamId}`
    : "";

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold">Class Results</h2>
          <p className="text-sm text-gray-600">Ranking and performance by class stream.</p>
        </div>

        <div className="flex gap-3 flex-wrap">
          <select
            className="border p-2 rounded"
            value={selectedStreamId || ""}
            onChange={(e) => setSelectedStreamId(e.target.value)}
          >
            <option value="">Select Stream</option>
            {streams.map((stream) => (
              <option key={stream.id} value={stream.id}>
                {stream.form} {stream.stream}
              </option>
            ))}
          </select>

          {selectedStreamId && (
            <a
              href={downloadUrl}
              target="_blank"
              rel="noreferrer"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Download Class PDF
            </a>
          )}
        </div>
      </div>

      {error && <div className="text-red-600">{error}</div>}
      {loading && <div>Loading...</div>}

      {performance && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-sm uppercase text-gray-500">Students</h3>
            <p className="text-3xl font-bold">{performance.studentCount}</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-sm uppercase text-gray-500">Average</h3>
            <p className="text-3xl font-bold">{performance.classAverage}</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-sm uppercase text-gray-500">Subjects</h3>
            <p className="text-3xl font-bold">{performance.subjectCount}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-bold mb-3">Class Ranking</h3>
          {rankings.length === 0 ? (
            <p className="text-sm text-gray-500">No ranking data available.</p>
          ) : (
            <ol className="space-y-2">
              {rankings.map((r) => (
                <li key={r.rank} className="p-3 border rounded">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-bold">#{r.rank}</span>
                    <span>{r.student.name}</span>
                    <span>{r.totalScore}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    Avg: {r.average || "-"} | Grade: {r.grade || "-"}
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-bold mb-3">Subject Performance</h3>
          {performance?.subjects?.length > 0 ? (
            <div className="space-y-2">
              {performance.subjects.map((subject) => (
                <div key={subject.subject} className="border rounded p-3">
                  <div className="font-semibold">{subject.subject}</div>
                  <div className="text-sm text-gray-600">
                    Avg: {subject.average} | High: {subject.highest} | Low: {subject.lowest}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No subject performance data available.</p>
          )}
        </div>
      </div>
    </div>
  );
}