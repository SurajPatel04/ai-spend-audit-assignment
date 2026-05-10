import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuditPage } from "./pages/AuditPage";
import Results from "./pages/Results";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuditPage />} />
        <Route path="/results" element={<Results />} />
        <Route path="/audit/:auditId" element={<Results />} />
      </Routes>
    </Router>
  );
}

export default App;
