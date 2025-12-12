import { Outlet } from "@remix-run/react";

const AdminProjectsRoute = () => {
  return (
    <section className="w-full grid grid-cols-1 px-10 mt-10 relative z-0 pb-20">
      <Outlet />
    </section>
  );
};

export default AdminProjectsRoute;
