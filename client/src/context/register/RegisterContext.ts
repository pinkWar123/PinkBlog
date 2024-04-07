import { createContext } from "react";
import { UserRegisterDto } from "../../types/auth";

type RegisterContextType = {
  registerInfo: UserRegisterDto | undefined;
  setRegisterInfo: React.Dispatch<
    React.SetStateAction<UserRegisterDto | undefined>
  >;
};

// const RegisterStateContext = createContext<RegisterContextType>({
//   registerInfo: undefined,
//   setRegisterInfo: () => {},
// });

const RegisterStateContext = createContext<RegisterContextType>({
  registerInfo: undefined,
  setRegisterInfo: () => {},
});

export default RegisterStateContext;
