import RegisterPage from './pages/auth/RegisterPage';
import { Route, Routes } from 'react-router-dom';
import Page from './pages/page-example';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Page />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  );
}

export default App;
