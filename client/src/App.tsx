import { Route, Routes } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import Page from './pages/page-example';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Page />} />
      <Route path='/auth-login' element={<LoginPage />}/>
    </Routes>
  );
}

export default App;
