import { ReactElement, ReactNode, useState } from "react";
import { UserRegisterDto } from "../../types/auth";
import ShowTopPostsContext from "./ShowTopPostContext";
type UserStateProviderProps = {
  children: ReactNode | null;
};

const UserStateProvider: React.FC<UserStateProviderProps> = ({ children }) => {
  const [showTopPosts, setShowTopPosts] = useState<boolean>(true);
  return (
    <ShowTopPostsContext.Provider value={{ showTopPosts, setShowTopPosts }}>
      {children}
    </ShowTopPostsContext.Provider>
  );
};

export default UserStateProvider;
