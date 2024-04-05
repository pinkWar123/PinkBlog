import { ReactElement, ReactNode, createContext, useState } from "react";
import { User } from "../../types/auth";
import UserStateContext from "./UserContext";
import { IUser } from "../../types/backend";
type UserStateProviderProps = {
  children: ReactNode | null;
};

const UserStateProvider: React.FC<UserStateProviderProps> = ({ children }) => {
  const [user, setUser] = useState<IUser | undefined>();
  return (
    <UserStateContext.Provider value={{ user, setUser }}>
      {children}
    </UserStateContext.Provider>
  );
};

export default UserStateProvider;
