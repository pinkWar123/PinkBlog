import { createContext } from "react";
import { IUser } from "../../types/backend";

export type UserContextType = {
  user: IUser | undefined;
  setUser: React.Dispatch<React.SetStateAction<IUser | undefined>>;
};
const UserStateContext = createContext<UserContextType>({
  user: undefined,
  setUser: () => {},
});

export default UserStateContext;
