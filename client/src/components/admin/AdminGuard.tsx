import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserStateContext from "../../context/users/UserContext";

interface AdminGuardProps {
  children: React.ReactElement;
}

const AdminGuard: React.FC<AdminGuardProps> = ({ children }) => {
  const navigate = useNavigate();
  const { user } = useContext(UserStateContext);
  if (!user || user.role.name !== "ADMIN") {
    navigate("/");
  }
  return <>{children}</>;
};

export default AdminGuard;
