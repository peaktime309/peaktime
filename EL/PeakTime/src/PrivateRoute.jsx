import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";

const PrivateRoute = ({ children }) => {
  // localStorage에서 유저가 있는지 확인,  'isAuthenticated' 같은거 하는거 좋을듯
  const isAuthenticated = localStorage.getItem("user");

  return isAuthenticated ? children : <Navigate to="/login" />;
};

// props validation 추가
PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired, // children은 필수이고, 렌더링 가능한 모든 노드를 허용
};

export default PrivateRoute;
