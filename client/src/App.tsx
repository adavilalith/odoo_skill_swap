import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';

const Dashboard = () => <h1 className="text-center mt-10 text-2xl">Welcome to Dashboard</h1>;

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
