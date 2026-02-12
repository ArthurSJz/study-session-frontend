import axios from "axios";
import type { AxiosResponse } from "axios";
import type {
  Subject,
  StudySession,
  CreateSubjectData,
  UpdateSubjectData,
  CreateSessionData,
  UpdateSessionData,
} from "../types";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
});

// Subjects
export const getAllSubjects = (): Promise<AxiosResponse<Subject[]>> =>
  api.get<Subject[]>("/subjects");

export const getSubjectById = (id: number): Promise<AxiosResponse<Subject>> =>
  api.get<Subject>(`/subjects/${id}`);

export const createSubject = (data: CreateSubjectData): Promise<AxiosResponse<Subject>> =>
  api.post<Subject>("/subjects", data);

export const updateSubject = (id: number, data: UpdateSubjectData): Promise<AxiosResponse<Subject>> =>
  api.put<Subject>(`/subjects/${id}`, data);

export const deleteSubject = (id: number): Promise<AxiosResponse<void>> =>
  api.delete(`/subjects/${id}`);

// Sessions
export const getAllSessions = (): Promise<AxiosResponse<StudySession[]>> =>
  api.get<StudySession[]>("/sessions");

export const getSessionById = (id: number): Promise<AxiosResponse<StudySession>> =>
  api.get<StudySession>(`/sessions/${id}`);

export const createSession = (data: CreateSessionData): Promise<AxiosResponse<StudySession>> =>
  api.post<StudySession>("/sessions", data);

export const updateSession = (id: number, data: UpdateSessionData): Promise<AxiosResponse<StudySession>> =>
  api.put<StudySession>(`/sessions/${id}`, data);

export const deleteSession = (id: number): Promise<AxiosResponse<void>> =>
  api.delete(`/sessions/${id}`);

export default api;