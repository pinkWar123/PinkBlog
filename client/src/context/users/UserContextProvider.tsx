import { ReactElement, ReactNode, useState } from "react";
import UserStateContext from "./UserContext";
import { IUser } from "../../types/backend";
type UserStateProviderProps = {
  children: ReactNode | ReactElement | null;
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
