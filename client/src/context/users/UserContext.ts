import { createContext } from "react";
import { User } from "../../types/auth";

type UserContextType = {
  user: User | undefined;
  setUser: (user: User | undefined) => void;
};
const UserStateContext = createContext<UserContextType>({
  user: undefined,
  setUser: () => {},
});

export default UserStateContext;
