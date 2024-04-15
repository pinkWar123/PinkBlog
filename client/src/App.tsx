import { BrowserRouter, Route, Routes } from "react-router-dom";
import { MainLayout } from "./layouts";
import NotFound from "./components/shared/not-found";
import "./App.css";
import { Auth, HomePage, PostPage, Register } from "./pages";
import AuthLayout from "./layouts/AuthLayout";
import { useEffect, useState } from "react";
import UserStateContext, { UserContextType } from "./context/users/UserContext";
import { getUserInfo } from "./services/authApi";
import EditLayout from "./pages/EditLayout/EditLayout";
import Profile from "./pages/Profile";
import { IUser } from "./types/backend";
import { MainHeader } from "./components/shared";
import { Layout } from "antd";

export default function App() {
  const [user, setUser] = useState<IUser | undefined>();
  useEffect(() => {
    const fetchUserRes = async () => {
      const res = await getUserInfo();
      if (res?.status === 200) {
        const _user = res.data.data;
        console.log(_user);
        setUser({ ..._user } as UserContextType["user"]);
      }
      console.log(res?.data.data);
    };
    fetchUserRes();
  }, [setUser]);

  return (
    <>
      <BrowserRouter>
        <UserStateContext.Provider value={{ user, setUser }}>
          <Routes>
            <Route path="/" element={<MainLayout></MainLayout>}>
              <Route index element={<HomePage />} />
              <Route path="posts/:id" element={<PostPage />} />
              <Route path="*" element={<NotFound />} />
            </Route>
            <Route path="auth" element={<AuthLayout></AuthLayout>}>
              <Route index element={<Auth />} />
              <Route path="register" element={<Register />} />
            </Route>

            <Route path="edit" element={<EditLayout />} />
            <Route path="profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </UserStateContext.Provider>
      </BrowserRouter>
    </>
  );
}
