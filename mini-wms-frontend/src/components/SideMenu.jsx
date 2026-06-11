import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { logout } from "../services/login";
import { resetDemoData } from "../services/reset";
import { useState } from "react";
import { PopUpConfirm } from "./PopUpConfirm";

export default function SideMenu({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { refresh } = useAuth();
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [showResetPopup, setShowResetPopup] = useState(false);
  const menuItems = [
    { path: "/list", label: "Towary" },
    { path: "/disposed", label: "Archiwum" },
    { path: "/add", label: "Dodaj Towar" },
    { path: "/locations", label: "Lokalizacje" },
    { path: "/services", label: "Działy" },
    { path: "/stats", label: "Statystyki" },
  ];

  const handleReset = async () => {
    try {
      setShowResetPopup(false);
      onClose();
      await resetDemoData();
      window.location.reload();
    } catch (err) {
      console.error("Błąd resetowania:", err);
    }
  };

  const handleLogout = async () => {
    try {
      setShowLogoutPopup(false);
      onClose();
      await logout();
      await refresh();
      navigate("/login", { replace: true });
    } catch (err) {
      console.error("Błąd wylogowania:", err);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            className="fixed top-0 right-0 w-full sm:w-64 h-full bg-[#203047] text-white shadow-lg z-50 flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
          >
            <div className="flex justify-between h-20 items-center px-6 pb-5 pt-4">
              <h2 className="font-rubik text-2xl text-white">
                Menu
              </h2>
              <FiX
                className="w-8 h-8 xs:w-10 xs:h-12 mr-1 cursor-pointer hover:text-red-600 transition"
                onClick={onClose}
              />
            </div>
            <div className="flex flex-col justify-between h-full pb-6">
              <nav className="flex flex-col gap-6 xs:gap-4">
                {menuItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `mx-6 py-1 xs:py-3 text-lg text-center transition-colors duration-200 rounded-sm ${
                        isActive
                          ? "bg-blue-950 text-white"
                          : "bg-blue-600 text-white hover:bg-blue-950"
                      }`
                    }
                    onClick={onClose}
                  >
                    {item.label}
                  </NavLink>
                ))}
              </nav>
              <div className="h-full"></div>
             <button
                onClick={() => setShowResetPopup(true)}
                className="mx-6 mb-4 py-1 xs:py-3 text-lg text-center cursor-pointer rounded-sm bg-amber-700 hover:bg-amber-800 transition-colors duration-200"
              >
                Reset danych demo
              </button>

              <button
                onClick={() => setShowLogoutPopup(true)}
                className="mx-6 py-1 xs:py-3 text-lg text-center cursor-pointer rounded-sm bg-red-900 hover:bg-red-950 transition-colors duration-200"
              >
                Wyloguj
              </button>
            </div>
          </motion.div>
        </>
      )}
      {showResetPopup && (
        <PopUpConfirm
          message="Czy chcesz przywrócić dane demonstracyjne?"
          confirmText="Resetuj"
          confirmColor="bg-amber-700 hover:bg-amber-900"
          onConfirm={handleReset}
          onClose={() => setShowResetPopup(false)}
        />
      )}
      {showLogoutPopup && (
        <PopUpConfirm
          message="Czy chcesz się wylogować?"
          confirmText="Wyloguj"
          confirmColor="bg-red-700 hover:bg-red-900"
          onConfirm={handleLogout}
          onClose={() => setShowLogoutPopup(false)}
        />
      )}
    </AnimatePresence>
  );
}