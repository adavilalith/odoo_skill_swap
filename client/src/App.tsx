import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Profile from './pages/Profile';
import UserPage from './pages/UserPage';
import SendRequest from './pages/SendRequest';
import RequestsPage from './pages/RequestsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/user/:id" element={<UserPage />} />
        <Route path="/send-request" element={<SendRequest />} />
        <Route path="/requests" element={<RequestsPage />} />

      </Routes>
    </Router>
  );
}

export default App;
