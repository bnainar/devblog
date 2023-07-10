import Login from "./components/auth/Login";
import Layout from "./components/Layout";
import HomePage from "./components/HomePage";
import Register from "./components/auth/Register";
import ViewPost from "./components/post/ViewPost";
import EditPost from "./components/post/EditPost";
import UserPosts from "./components/post/UserPosts";
import CreatePostPage from "./components/post/CreatePostPage";
import { Route, Routes } from "react-router-dom";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="new" element={<CreatePostPage />} />
          <Route path="/author/:username" element={<UserPosts />} />
          <Route path="post/:id" element={<ViewPost />} />
          <Route path="post/edit/:id" element={<EditPost />} />
          <Route
            path="*"
            element={
              <div className="text-center text-lg text-red-500">404 Error</div>
            }
          />
        </Route>
      </Routes>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
