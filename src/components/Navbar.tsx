import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <Link to="/">📚 StudyPlanner</Link>
      <Link to="/subjects">Subjects</Link>
      <Link to="/sessions">Sessions</Link>
    </nav>
  );
}

export default Navbar;