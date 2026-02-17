import { ReactNode } from "react";
import { NavigationBar, Footer, BetterModal } from "~/components/client";

const HomeLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-dvh flex flex-col">
      <NavigationBar />
      <main className="flex-1">{children}</main>
      <Footer />
      <BetterModal />
    </div>
  );
};

export default HomeLayout;
