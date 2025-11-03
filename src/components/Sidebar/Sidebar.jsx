import React, { useEffect, useState } from "react";
import { FaBars, FaChevronDown, FaSignOutAlt } from "react-icons/fa";
import routes from "../../routes/routes";
import { NavLink } from "react-router-dom";
import { useUserContext } from "@/providers/UserProvider";
import { useTranslation } from "react-i18next";
import { LogOut } from "@/api/Auth";
import { showToast } from "@/providers/ToastProvider";
import { deleteCookie } from "@/helper/Cookie";

const Sidebar = ({ setIsOpen, isOpen }) => {
  const [loading, setLoading] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const { setIsLoggedIn } = useUserContext();
  const { t } = useTranslation();

  const toggleSidebar = () => setIsOpen(!isOpen);
  const handleLogOut = async () => {
    try {
      setLoading(true);
      await LogOut();
      showToast({
        severity: "success",
        summary: t("success"),
        detail: "",
      });
      setIsLoggedIn(false);
      deleteCookie("token");
      deleteCookie("refreshToken");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleMainClick = (route) => {
    if (route.children && route.children.length > 0) {
      setOpenMenuId((prev) => (prev === route.id ? null : route.id));
    } else {
      setOpenMenuId(null);
    }
  };
  // useEffect(() => {
  //   if (!isOpen) {
  //     setOpenMenuId(null);
  //   }
  // }, [isOpen]);

  return (
    <div
      className={`bg-[#2d3e50]  text-white  transition-all duration-300 ${
        isOpen ? "w-70" : "w-14"
      } flex flex-col overflow-y-scroll scrollbar-hidden`}
    >
      <div className="flex h-14 items-center mx-1 gap-4 p-4">
        <button onClick={toggleSidebar} className="h-full focus:!shadow-none">
          <FaBars />
        </button>
        <span
          className={`font-bold text-white transition-all duration-300 overflow-hidden whitespace-nowrap   ${
            isOpen ? "block" : "hidden"
          }`}
        >
          Sirab BTB
        </span>
      </div>

      <nav className="flex-1 border-t">
        {routes.map((r) => {
          const Icon = r.icon;
          const hasChildren = r.children && r.children.length > 0;
          const isOpenMenu = openMenuId === r.id;

          return (
            <div
              key={`${r.id}-${r.path}`}
              className=""
              title={t(`menu.${r.id}`) || r.label}
            >
              <NavLink
                disabled={loading}
                to={r.path}
                onClick={() => handleMainClick(r)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-4 mt-1 mx-1 min-h-10 rounded-2xl  text-white hover:bg-[#34495c]  transition-all duration-200 ${
                    isActive ? "bg-[#34495c]" : ""
                  }`
                }
              >
                <div className="flex items-center gap-4 w-full">
                  <div>
                    <Icon />
                  </div>
                  <span
                    // əgər clamp-text-1 götürsən sidebar açılıb bağlananda glitch effekti yaranır
                    className={`font-semibold text-left clamp-text-1 transition-all duration-300 break-words ${
                      isOpen ? "block" : "hidden"
                    }`}
                  >
                    {t(`menu.${r.id}`) || r.label}
                  </span>
                </div>
                {hasChildren && isOpen && (
                  <FaChevronDown
                    className={`ml-2 transition-transform duration-300 ${
                      isOpenMenu ? "rotate-180" : ""
                    }`}
                  />
                )}
              </NavLink>
              {hasChildren && isOpen && isOpenMenu && (
                <div className="ml-[34px] mt-1 flex flex-col">
                  {r.children.map((child) => (
                    <NavLink
                      disabled={loading}
                      key={child.id}
                      to={child.path}
                      className={({ isActive }) =>
                        `block  font-semibold text-white px-1.5 py-2 mx-1 mt-1 rounded-2xl hover:bg-[#3d566e] transition-all clamp-text-1 duration-200  ${
                          isActive ? "bg-[#3d566e]" : ""
                        }`
                      }
                    >
                      {t(`menu.${child.id}`) || child.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
      <button
        onClick={handleLogOut}
        className="bg-red-500 rounded-2xl flex flex-row items-center h-8 px-4 py-[18px] gap-4 mx-1 my-8"
        disabled={loading}
      >
        <div>
          <FaSignOutAlt />
        </div>
        <span
          className={`font-semibold text-white transition-all duration-300 overflow-hidden whitespace-nowrap   ${
            isOpen ? "block" : "hidden"
          }`}
        >
          {t("menu.logout")}
        </span>
      </button>
    </div>
  );
};

export default Sidebar;
