import type { LoaderFunction } from "@remix-run/node";
import { useState, useEffect } from "react";
import { redirect, json } from "@remix-run/node";
import { Outlet, useNavigate, useParams, useLocation } from "@remix-run/react";
import { getSession } from "~/utils/session";

import {
  SideMenu,
  Navigation,
  DialogueModal,
  InfoModal,
} from "~/components/admin";

//Check for Auth
export const loader: LoaderFunction = async ({ request }) => {
  //Check for authentication
  const cookieHeader = request.headers.get("Cookie");
  const session = await getSession(cookieHeader);

  //If user is unauthorized
  if (!session.get("isAdmin")) {
    return redirect("/login");
  }

  //If everything went fine - just return null
  return json(null);
};

const AdminMain = () => {
  //Side menu state
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

  const nav = useNavigate();
  const location = useLocation();

  //Get language from params
  const { lang } = useParams<{ lang: string }>();

  //Handle redirect logic
  useEffect(() => {
    //Check if language preference already set in localStorage
    if (!localStorage.getItem("langPref")) {
      //If not set it as params value
      localStorage.setItem("langPref", lang ?? "eng");
    }

    //If user just logged in - redirect him to admin default route (Projects)
    if (location.pathname === `/admin/${lang}`) {
      nav(
        `/admin/${localStorage.getItem("langPref") ?? lang ?? "eng"}/projects`,
        {
          replace: true,
        }
      );
    }
  }, [nav, lang, location.pathname]);

  //Function toggle side menu
  const toggleSideMenu = () => {
    setIsSideMenuOpen((prev) => !prev);
  };

  //Function to just close side menu
  const closeSideMenu = () => {
    setIsSideMenuOpen(false);
  };

  //Handle document overflow
  useEffect(() => {
    if (isSideMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "scroll";
    }
  }, [isSideMenuOpen]);

  return (
    <>
      <main className="lg:flex lg:justify-start lg:gap-x-10">
        <Navigation toggleSideMenu={toggleSideMenu} />
        <SideMenu
          sideMenuState={isSideMenuOpen}
          closeSideMenu={closeSideMenu}
        />
        <Outlet />
      </main>
      <DialogueModal />
      <InfoModal />
    </>
  );
};

export default AdminMain;
