import { createContext } from "react";
import { UserRegisterDto } from "../../types/auth";

type ShowTopPostsContextType = {
  showTopPosts: boolean;
  setShowTopPosts: React.Dispatch<React.SetStateAction<boolean>>;
};

// const RegisterStateContext = createContext<ShowTopPostsContextType>({
//   registerInfo: undefined,
//   setRegisterInfo: () => {},
// });

const ShowTopPostsContext = createContext<ShowTopPostsContextType>({
  showTopPosts: true,
  setShowTopPosts: () => {},
});

export default ShowTopPostsContext;
