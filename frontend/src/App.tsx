import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuditPage } from "./pages/AuditPage";
import Results from "./pages/Results";
import { pingBackend } from "./services/api";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [isServerReady, setIsServerReady] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    const checkServer = async () => {
      const ready = await pingBackend();
      if (ready) {
        setIsServerReady(true);
        if (interval) clearInterval(interval);
      }
    };

    // Initial check
    checkServer();

    // Poll every 3 seconds
    interval = setInterval(checkServer, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {!isServerReady && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-wheat-50/60 backdrop-blur-md">
          <div className="bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex flex-col items-center max-w-md w-full mx-4 border border-wheat-200">
            <div className="w-16 h-16 border-4 border-wheat-200 border-t-wheat-600 rounded-full animate-spin mb-6"></div>
            <h2 className="text-2xl font-bold text-stone-800 mb-2">Waking up the server</h2>
            <p className="text-stone-600 text-center">
              Backend is spinning up. This usually takes about 60 seconds. Please hold on...
            </p>
          </div>
        </div>
      )}
      <div className={!isServerReady ? "blur-sm pointer-events-none transition-all duration-500 h-screen overflow-hidden" : "transition-all duration-500"}>
        <Router>
          <Routes>
            <Route path="/" element={<AuditPage />} />
            <Route path="/results" element={<Results />} />
            <Route path="/audit/:auditId" element={<Results />} />
          </Routes>
        </Router>
      </div>
      <ToastContainer position="bottom-center" autoClose={3000} theme="light" hideProgressBar={true} />
    </>
  );
}

export default App;
