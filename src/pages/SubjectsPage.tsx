import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllSubjects, deleteSubject, createSubject, updateSubject } from "../services/api";
import ColorPicker from "../components/ColorPicker";
import type { Subject } from "../types";

function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#4A90D9");
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchSubjects = async () => {
    const response = await getAllSubjects();
    setSubjects(response.data);
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await updateSubject(editingId, { name, description, color });
      setEditingId(null);
    } else {
      await createSubject({ name, description, color });
    }
    setName("");
    setDescription("");
    setColor("#4A90D9");
    fetchSubjects();
  };

  const handleEdit = (subject: Subject) => {
    setEditingId(subject.id);
    setName(subject.name);
    setDescription(subject.description || "");
    setColor(subject.color);
  };

  const handleCancel = () => {
    setEditingId(null);
    setName("");
    setDescription("");
    setColor("#4A90D9");
  };

  const handleDelete = async (id: number) => {
    await deleteSubject(id);
    fetchSubjects();
  };

  return (
    <div>
      <h1>Subjects</h1>

      <form onSubmit={handleSubmit}>
        <input placeholder="Subject name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <ColorPicker value={color} onChange={setColor} />
        <button type="submit">{editingId ? "Update" : "Add"} Subject</button>
        {editingId && <button type="button" onClick={handleCancel}>Cancel</button>}
      </form>

      <ul>
        {subjects.map((subject) => (
          <li key={subject.id} style={{ borderLeft: `4px solid ${subject.color}`, paddingLeft: "10px" }}>
            <Link to={`/subjects/${subject.id}`}>{subject.name}</Link>
            <span> — {subject.sessions.length} sessions</span>
            <button onClick={() => handleEdit(subject)}>Edit</button>
            <button onClick={() => handleDelete(subject.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SubjectsPage;