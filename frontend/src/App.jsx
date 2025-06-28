import { Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import Login from './components/logIn';
import Signup from './components/signUp';
import VerifyEmail from './components/verifyEmail';
import Main from './pages/main';
import OneToOneChat from './components/oneToOneChat';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/verify" element={<VerifyEmail/>}/>
      <Route path="/main" element={<Main/>}/>
      <Route path="/chat/one-to-one-chat" element={<OneToOneChat/>}/>
    </Routes>
  );
};

export default App;
