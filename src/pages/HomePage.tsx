import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllSubjects, getAllSessions } from "../services/api";
import type { Subject, StudySession } from "../types";

function HomePage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [sessions, setSessions] = useState<StudySession[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [subjectsRes, sessionsRes] = await Promise.all([
        getAllSubjects(),
        getAllSessions(),
      ]);
      setSubjects(subjectsRes.data);
      setSessions(sessionsRes.data);
    };
    fetchData();
  }, []);

  const totalMinutes = sessions.reduce((sum, s) => sum + s.duration, 0);
  const totalHours = Math.floor(totalMinutes / 60);
  const totalMins = totalMinutes % 60;

  const recentSessions = [...sessions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const getSubjectMinutes = (subjectId: number) => {
    return sessions
      .filter((s) => s.subjectId === subjectId)
      .reduce((sum, s) => sum + s.duration, 0);
  };

  return (
    <div className="home-page">
      <h1>📚 Study Session Planner</h1>
      <p className="home-subtitle">Track your progress and stay on top of your studies!</p>

      {/* Stats Overview */}
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-number">{totalHours}h {totalMins}m</span>
          <span className="stat-label">Total Studied</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{subjects.length}</span>
          <span className="stat-label">Subjects</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{sessions.length}</span>
          <span className="stat-label">Sessions</span>
        </div>
      </div>

      {/* Subject Cards */}
      <h2>📖 Subjects Overview</h2>
      {subjects.length === 0 ? (
        <p className="empty-message">
          No subjects yet! <Link to="/subjects">Create your first subject</Link>
        </p>
      ) : (
        <div className="subject-cards">
          {subjects.map((subject) => {
            const mins = getSubjectMinutes(subject.id);
            const h = Math.floor(mins / 60);
            const m = mins % 60;
            return (
              <Link to={`/subjects/${subject.id}`} key={subject.id} className="subject-card" style={{ borderTop: `4px solid ${subject.color}` }}>
                <div className="subject-card-color" style={{ background: subject.color }} />
                <h3>{subject.name}</h3>
                <p>{subject.sessions.length} sessions</p>
                <span className="subject-card-hours">{h}h {m}m</span>
              </Link>
            );
          })}
        </div>
      )}

      {/* Recent Sessions */}
      <h2>🕐 Recent Sessions</h2>
      {recentSessions.length === 0 ? (
        <p className="empty-message">No sessions recorded yet!</p>
      ) : (
        <ul className="recent-sessions">
          {recentSessions.map((session) => (
            <li key={session.id}>
              <span className="session-subject">{session.subject?.name}</span>
              <span className="session-date">{new Date(session.date).toLocaleDateString()}</span>
              <span className="session-duration">{session.duration} min</span>
              {session.notes && <span className="session-notes">{session.notes}</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default HomePage;