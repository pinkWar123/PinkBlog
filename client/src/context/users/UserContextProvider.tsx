import { ReactElement, createContext, useState } from "react";
import { User } from "../../types/auth";
import UserStateContext from "./UserContext";
type UserStateProviderProps = {
  children: ReactElement | null;
};

const UserStateProvider: React.FC<UserStateProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | undefined>();
  return (
    <UserStateContext.Provider value={{ user, setUser }}>
      {children}
    </UserStateContext.Provider>
  );
};

export default UserStateProvider;
