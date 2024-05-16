import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { MainLayout } from "./layouts";
import NotFound from "./components/shared/not-found";
import "./App.css";
import { Auth, HomePage, PostPage, Register } from "./pages";
import AuthLayout from "./layouts/AuthLayout";
import { useEffect, useState } from "react";
import UserStateContext, { UserContextType } from "./context/users/UserContext";
import { getUserInfo } from "./services/authApi";
import EditLayout from "./pages/EditLayout/EditLayout";
import Posts from "./pages/ProfilePage/Posts";
import { IUser } from "./types/backend";
import {
  ContentCreator,
  Following,
  Latest,
  Series,
} from "./pages/HomePage/Latest";
import { ShowTopPostsProvider } from "./context/top-posts";
import ProfileLayout from "./layouts/ProfileLayout/ProfileLayout";
import Followers from "./pages/ProfilePage/Followers";
import AdminLayout from "./layouts/AdminLayout/AdminLayout";
import User from "./pages/AdminPage/User";
import Tags from "./pages/AdminPage/Tags";
import Roles from "./pages/AdminPage/Roles/Roles";

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
            <Route path="/" element={<Navigate to={"/latest"} />} />
            <Route
              element={
                <ShowTopPostsProvider>
                  <MainLayout></MainLayout>
                </ShowTopPostsProvider>
              }
            >
              <Route element={<HomePage />}>
                <Route path="latest" element={<Latest />} />
                <Route path="following" element={<Following />} />
                <Route path="series" element={<Series />} />
                <Route path="content-creator" element={<ContentCreator />} />
              </Route>
              <Route path="posts/:id" element={<PostPage />} />

              <Route path="*" element={<NotFound />} />
            </Route>

            <Route path="auth" element={<AuthLayout></AuthLayout>}>
              <Route index element={<Auth />} />
              <Route path="register" element={<Register />} />
            </Route>

            <Route path="edit" element={<EditLayout />} />

            <Route path="profile/:id" element={<ProfileLayout />}>
              <Route index element={<Posts />} />
              <Route path="followers" element={<Followers />} />
            </Route>

            <Route path="admin" element={<AdminLayout />}>
              <Route path="users" element={<User />} />
              <Route path="tags" element={<Tags />} />
              <Route path="roles" element={<Roles />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </UserStateContext.Provider>
      </BrowserRouter>
    </>
  );
}
