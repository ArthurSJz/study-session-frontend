import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSubjectById, createSession, deleteSession, updateSession } from "../services/api";
import type { Subject, StudySession } from "../types";

const QUICK_DURATIONS = [15, 30, 45, 60, 90, 120];

function SubjectDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [subject, setSubject] = useState<Subject | null>(null);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [duration, setDuration] = useState<number | null>(null);
  const [customDuration, setCustomDuration] = useState("");
  const [notes, setNotes] = useState("");
  const [editingSessionId, setEditingSessionId] = useState<number | null>(null);

  const fetchSubject = async () => {
    const response = await getSubjectById(Number(id));
    setSubject(response.data);
  };

  useEffect(() => {
    fetchSubject();
  }, [id]);

  const getFinalDuration = () => {
    if (duration) return duration;
    if (customDuration) return Number(customDuration);
    return 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalDuration = getFinalDuration();
    if (!finalDuration) return;

    if (editingSessionId) {
      await updateSession(editingSessionId, {
        date: new Date(date).toISOString(),
        duration: finalDuration,
        notes: notes || undefined,
        subjectId: Number(id),
      });
      setEditingSessionId(null);
    } else {
      await createSession({
        date: new Date(date).toISOString(),
        duration: finalDuration,
        notes: notes || undefined,
        subjectId: Number(id),
      });
    }
    resetForm();
    fetchSubject();
  };

  const resetForm = () => {
    setDate(new Date().toISOString().slice(0, 10));
    setDuration(null);
    setCustomDuration("");
    setNotes("");
    setEditingSessionId(null);
  };

  const handleEditSession = (session: StudySession) => {
    setEditingSessionId(session.id);
    setDate(session.date.slice(0, 10));
    setNotes(session.notes || "");

    if (QUICK_DURATIONS.includes(session.duration)) {
      setDuration(session.duration);
      setCustomDuration("");
    } else {
      setDuration(null);
      setCustomDuration(String(session.duration));
    }
  };

  const handleSelectDuration = (mins: number) => {
    setDuration(mins);
    setCustomDuration("");
  };

  const handleCustomDuration = (value: string) => {
    setCustomDuration(value);
    setDuration(null);
  };

  const handleDeleteSession = async (sessionId: number) => {
    await deleteSession(sessionId);
    fetchSubject();
  };

  const setDateShortcut = (offset: number) => {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    setDate(d.toISOString().slice(0, 10));
  };

  if (!subject) return <p>Loading...</p>;

  const totalMinutes = subject.sessions.reduce((sum, s) => sum + s.duration, 0);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return (
    <div className="subject-details">
      <button onClick={() => navigate("/subjects")}>← Back</button>
      <h1 style={{ color: subject.color }}>{subject.name}</h1>
      <p>{subject.description}</p>
      <p className="total-studied">Total studied: <strong>{hours}h {minutes}m</strong></p>

      <h2>{editingSessionId ? "✏️ Edit Session" : "➕ Add Session"}</h2>
      <form onSubmit={handleSubmit} className="session-form">

        {/* Date shortcuts */}
        <div className="form-section">
          <label>When?</label>
          <div className="date-shortcuts">
            <button type="button" className={date === new Date().toISOString().slice(0, 10) ? "active" : ""} onClick={() => setDateShortcut(0)}>Today</button>
            <button type="button" className={date === (() => { const d = new Date(); d.setDate(d.getDate() - 1); return d.toISOString().slice(0, 10); })() ? "active" : ""} onClick={() => setDateShortcut(-1)}>Yesterday</button>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
        </div>

        {/* Duration buttons */}
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

        {/* Notes */}
        <div className="form-section">
          <label>Notes (optional)</label>
          <input type="text" placeholder="What did you study?" value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>

        <div className="form-actions">
          <button type="submit" disabled={!getFinalDuration()}>
            {editingSessionId ? "Update Session" : "Save Session"}
          </button>
          {editingSessionId && <button type="button" onClick={resetForm}>Cancel</button>}
        </div>
      </form>

      <h2>📋 Sessions</h2>
      {subject.sessions.length === 0 ? (
        <p className="empty-message">No sessions yet! Add your first one above.</p>
      ) : (
        <ul>
          {subject.sessions
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map((session) => (
              <li key={session.id}>
                <span className="session-date">{new Date(session.date).toLocaleDateString()}</span>
                <span className="session-duration">{session.duration} min</span>
                {session.notes && <span className="session-notes">{session.notes}</span>}
                <button onClick={() => handleEditSession(session)}>Edit</button>
                <button onClick={() => handleDeleteSession(session.id)}>Delete</button>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}

export default SubjectDetailsPage;