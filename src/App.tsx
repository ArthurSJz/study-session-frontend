import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage.tsx";
import SubjectsPage from "./pages/SubjectsPage.tsx";
import SubjectDetailsPage from "./pages/SubjectDetailsPage.tsx";
import SessionsPage from "./pages/SessionsPage.tsx";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/subjects" element={<SubjectsPage />} />
          <Route path="/subjects/:id" element={<SubjectDetailsPage />} />
          <Route path="/sessions" element={<SessionsPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;