import { Outlet } from "react-router-dom";
import Header from "./Header";

function Layout() {
  return (
    <div className="pt-3 px-5 max-w-screen-lg m-auto text-white">
      <Header />
      <main className="m-5">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
