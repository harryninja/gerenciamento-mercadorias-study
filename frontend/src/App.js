import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "../../frontend/src/pages/login";
import Dashboard from "../../frontend/src/pages/dashboard";
import PrivateRoute from "../../frontend/src/auth/PrivateRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
