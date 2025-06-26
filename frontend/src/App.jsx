import { Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import Login from './components/logIn';
import Signup from './components/signUp';
import VerifyEmail from './components/verifyEmail';
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/verify" element={<VerifyEmail/>}/>
    </Routes>
  );
};

export default App;
