import { ReactElement, ReactNode, useState } from "react";
import { UserRegisterDto } from "../../types/auth";
import RegisterStateContext from "./RegisterContext";
type UserStateProviderProps = {
  children: ReactNode | null;
};

const UserStateProvider: React.FC<UserStateProviderProps> = ({ children }) => {
  const [registerInfo, setRegisterInfo] = useState<
    UserRegisterDto | undefined
  >();
  return (
    <RegisterStateContext.Provider value={{ registerInfo, setRegisterInfo }}>
      {children}
    </RegisterStateContext.Provider>
  );
};

export default UserStateProvider;
