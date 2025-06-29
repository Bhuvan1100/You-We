
import { Navigate } from 'react-router-dom';
import useUserStore from '../store/userStore';

const PrivateRoute = ({ children }) => {
  const {user} = useUserStore();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;
