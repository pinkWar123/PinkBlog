import { createContext } from "react";
import { User } from "../../types/auth";
import { IUser } from "../../types/backend";

type UserContextType = {
  user: User | undefined;
  setUser: React.Dispatch<React.SetStateAction<IUser | undefined>>;
};
const UserStateContext = createContext<UserContextType>({
  user: undefined,
  setUser: () => {},
});

export default UserStateContext;
