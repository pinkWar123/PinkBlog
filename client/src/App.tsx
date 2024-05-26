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
import Tags from "./pages/AdminPage/Tags/Tags";
import Roles from "./pages/AdminPage/Roles/Roles";
import { default as PostControl } from "./pages/AdminPage/Posts";
import CreateSeries from "./pages/Series/CreateSeries";
import WithHeaderLayout from "./layouts/WithHeaderLayout";
import { default as SeriesProfile } from "./pages/ProfilePage/Series";
import Permissions from "./pages/AdminPage/Permissions/Permissions";
import { default as SeriesDetail } from "./pages/Series/Series";

export default function App() {
  const [user, setUser] = useState<IUser | undefined>();
  useEffect(() => {
    const fetchUserRes = async () => {
      const res = await getUserInfo();
      if (res?.status === 200) {
        const _user = res?.data?.data;
        console.log(_user);
        setUser({ ..._user } as UserContextType["user"]);
      }
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
            <Route path="series" element={<WithHeaderLayout />}>
              <Route path="create" element={<CreateSeries />} />
              <Route path=":id" element={<SeriesDetail />} />
            </Route>

            <Route path="profile/:id" element={<ProfileLayout />}>
              <Route index element={<Posts />} />
              <Route path="followers" element={<Followers />} />
              <Route path="series" element={<SeriesProfile />} />
            </Route>

            <Route path="admin" element={<AdminLayout />}>
              <Route path="users" element={<User />} />
              <Route path="tags" element={<Tags />} />
              <Route path="roles" element={<Roles />} />
              <Route path="posts" element={<PostControl />} />
              <Route path="permissions" element={<Permissions />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </UserStateContext.Provider>
      </BrowserRouter>
    </>
  );
}
