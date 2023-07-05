import { Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import HomePage from "./components/HomePage";
import Layout from "./components/Layout";
import Login from "./components/Login";
import Register from "./components/Register";
import { UserContextProvider } from "./context/UserContext";
import CreatePostPage from "./components/CreatePostPage";

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="new" element={<CreatePostPage />} />
          <Route
            path="*"
            element={<div className="text-center text-lg">404 Error</div>}
          />
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
