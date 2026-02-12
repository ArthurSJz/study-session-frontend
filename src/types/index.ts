export interface Subject {
  id: number;
  name: string;
  description: string | null;
  color: string;
  createdAt: string;
  updatedAt: string;
  sessions: StudySession[];
}

export interface StudySession {
  id: number;
  date: string;
  duration: number;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  subjectId: number;
  subject?: Subject;
}

// Form types
export interface CreateSubjectData {
  name: string;
  description?: string;
  color?: string;
}

export interface UpdateSubjectData {
  name?: string;
  description?: string;
  color?: string;
}

export interface CreateSessionData {
  date: string;
  duration: number;
  notes?: string;
  subjectId: number;
}

export interface UpdateSessionData {
  date?: string;
  duration?: number;
  notes?: string;
  subjectId?: number;
}