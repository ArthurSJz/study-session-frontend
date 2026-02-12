import { useEffect, useState } from "react";
import { getAllSubjects, getAllSessions, createSession, deleteSession } from "../services/api";
import type { Subject, StudySession } from "../types";

const QUICK_DURATIONS = [15, 30, 45, 60, 90, 120];

function SessionsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [filterSubject, setFilterSubject] = useState<number | "all">("all");
  const [searchNotes, setSearchNotes] = useState("");
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | "">("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [duration, setDuration] = useState<number | null>(null);
  const [customDuration, setCustomDuration] = useState("");
  const [notes, setNotes] = useState("");

  const fetchData = async () => {
    const [subjectsRes, sessionsRes] = await Promise.all([
      getAllSubjects(),
      getAllSessions(),
    ]);
    setSubjects(subjectsRes.data);
    setSessions(sessionsRes.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter sessions
  const filteredSessions = sessions
    .filter((s) => filterSubject === "all" || s.subjectId === filterSubject)
    .filter((s) => !searchNotes || s.notes?.toLowerCase().includes(searchNotes.toLowerCase()))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Group by day
  const groupedSessions: Record<string, StudySession[]> = {};
  filteredSessions.forEach((session) => {
    const dayKey = new Date(session.date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    if (!groupedSessions[dayKey]) groupedSessions[dayKey] = [];
    groupedSessions[dayKey].push(session);
  });

  // Stats
  const totalMinutes = filteredSessions.reduce((sum, s) => sum + s.duration, 0);
  const totalH = Math.floor(totalMinutes / 60);
  const totalM = totalMinutes % 60;

  // Form handlers
  const getFinalDuration = () => {
    if (duration) return duration;
    if (customDuration) return Number(customDuration);
    return 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalDuration = getFinalDuration();
    if (!finalDuration || !selectedSubjectId) return;

    await createSession({
      date: new Date(date).toISOString(),
      duration: finalDuration,
      notes: notes || undefined,
      subjectId: Number(selectedSubjectId),
    });

    setSelectedSubjectId("");
    setDate(new Date().toISOString().slice(0, 10));
    setDuration(null);
    setCustomDuration("");
    setNotes("");
    setShowForm(false);
    fetchData();
  };

  const handleSelectDuration = (mins: number) => {
    setDuration(mins);
    setCustomDuration("");
  };

  const handleCustomDuration = (value: string) => {
    setCustomDuration(value);
    setDuration(null);
  };

  const setDateShortcut = (offset: number) => {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    setDate(d.toISOString().slice(0, 10));
  };

  const handleDelete = async (sessionId: number) => {
    await deleteSession(sessionId);
    fetchData();
  };

  const getSubjectColor = (subjectId: number) => {
    return subjects.find((s) => s.id === subjectId)?.color || "#4A90D9";
  };

  return (
    <div className="sessions-page">
      <h1>🗓️ All Sessions</h1>

      {/* Stats bar */}
      <div className="sessions-stats">
        <span>{filteredSessions.length} sessions</span>
        <span>•</span>
        <span>{totalH}h {totalM}m total</span>
      </div>

      {/* Toolbar */}
      <div className="sessions-toolbar">
        <select
          value={filterSubject}
          onChange={(e) => setFilterSubject(e.target.value === "all" ? "all" : Number(e.target.value))}
          className="filter-select"
        >
          <option value="all">All Subjects</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="🔍 Search notes..."
          value={searchNotes}
          onChange={(e) => setSearchNotes(e.target.value)}
          className="search-input"
        />

        <button
          className="add-session-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "✕ Close" : "➕ Add Session"}
        </button>
      </div>

      {/* Add Session Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="session-form">
          <div className="form-section">
            <label>Subject</label>
            <div className="subject-select-buttons">
              {subjects.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className={selectedSubjectId === s.id ? "active" : ""}
                  style={{
                    borderColor: s.color,
                    background: selectedSubjectId === s.id ? s.color : "transparent",
                  }}
                  onClick={() => setSelectedSubjectId(s.id)}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>

          <div className="form-section">
            <label>When?</label>
            <div className="date-shortcuts">
              <button type="button" className={date === new Date().toISOString().slice(0, 10) ? "active" : ""} onClick={() => setDateShortcut(0)}>Today</button>
              <button type="button" className={date === (() => { const d = new Date(); d.setDate(d.getDate() - 1); return d.toISOString().slice(0, 10); })() ? "active" : ""} onClick={() => setDateShortcut(-1)}>Yesterday</button>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
          </div>

          <div className="form-section">
            <label>How long?</label>
            <div className="duration-buttons">
              {QUICK_DURATIONS.map((mins) => (
                <button
                  key={mins}
                  type="button"
                  className={duration === mins ? "active" : ""}
                  onClick={() => handleSelectDuration(mins)}
                >
                  {mins >= 60 ? `${mins / 60}h` : `${mins}m`}
                </button>
              ))}
              <input
                type="number"
                placeholder="Custom (min)"
                value={customDuration}
                onChange={(e) => handleCustomDuration(e.target.value)}
                className={customDuration ? "active-input" : ""}
              />
            </div>
          </div>

          <div className="form-section">
            <label>Notes (optional)</label>
            <input type="text" placeholder="What did you study?" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>

          <div className="form-actions">
            <button type="submit" disabled={!getFinalDuration() || !selectedSubjectId}>
              Save Session
            </button>
          </div>
        </form>
      )}

      {/* Grouped Sessions */}
      {Object.keys(groupedSessions).length === 0 ? (
        <p className="empty-message">No sessions found.</p>
      ) : (
        Object.entries(groupedSessions).map(([day, daySessions]) => {
          const dayTotal = daySessions.reduce((sum, s) => sum + s.duration, 0);
          const dH = Math.floor(dayTotal / 60);
          const dM = dayTotal % 60;
          return (
            <div key={day} className="day-group">
              <div className="day-header">
                <h3>{day}</h3>
                <span className="day-total">{dH}h {dM}m</span>
              </div>
              <ul>
                {daySessions.map((session) => (
                  <li key={session.id}>
                    <span className="session-color-dot" style={{ background: getSubjectColor(session.subjectId) }} />
                    <span className="session-subject">{session.subject?.name}</span>
                    <span className="session-duration">{session.duration} min</span>
                    {session.notes && <span className="session-notes">{session.notes}</span>}
                    <button onClick={() => handleDelete(session.id)}>Delete</button>
                  </li>
                ))}
              </ul>
            </div>
          );
        })
      )}
    </div>
  );
}

export default SessionsPage;