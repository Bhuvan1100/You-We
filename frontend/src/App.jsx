import { Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';
import Home from './pages/home';
import Login from './components/logIn';
import Signup from './components/signUp';
import VerifyEmail from './components/verifyEmail';
import Main from './pages/main';
import OneToOneChat from './components/oneToOneChat';
import GroupRoom from './components/groupChat';
import GroupTopic from './components/groupTopic';
import PrivateRoute from './components/protectedRoute';
import RoomPage from './components/roomPage';
import PersonalizedChat from './components/personalizedRoom';
import useUserStore from './store/userStore';

const App = () => {


  const verifyToken = useUserStore((state) => state.verifyToken);

   useEffect(() => {
    const checkUser = async () => {
      await verifyToken();
    };
    checkUser();
  }, []);




  return (
    <Routes>
      
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route
        path="/verify"
        element={
            <VerifyEmail />
        }
      />
      <Route
        path="/main"
        element={
          <PrivateRoute>
            <Main />
          </PrivateRoute>
        }
      />
      <Route
        path="/chat/one-to-one-chat"
        element={
          <PrivateRoute>
            <OneToOneChat />
          </PrivateRoute>
        }
      />
      <Route
        path="/chat/group"
        element={
          <PrivateRoute>
            <GroupTopic />
          </PrivateRoute>
        }
      />
      <Route
        path="/chat/group-room/:topic"
        element={
          <PrivateRoute>
            <GroupRoom />
          </PrivateRoute>
        }
      />
      <Route
        path="/chat/roomPage"
        element={
          <PrivateRoute>
            <RoomPage/>
          </PrivateRoute>
        }
      />
      <Route
        path="/chat/personalizedroom/:roomId"
        element={
          <PrivateRoute>
            <PersonalizedChat/>
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default App;
