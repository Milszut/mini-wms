import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { IoMdArrowDropdown } from "react-icons/io";

export default function SortDropdown({ label, value, defaultValue, onChange, options = [], className = "",}) {
  const [open, setOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const btnRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (!open) return;
      if (menuRef.current?.contains(e.target)) return;
      if (btnRef.current?.contains(e.target)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const toggleMenu = () => {
    if (!btnRef.current) return;
    if (open) {
      setOpen(false);
      return;
    }
    const rect = btnRef.current.getBoundingClientRect();
    setMenuPos({
      top: rect.bottom + 6,
      left: rect.left + rect.width / 2,
    });
    setOpen(true);
  };

  const menu = (
    <div
      ref={menuRef}
      className="fixed z-[50] bg-[#203047] w-36 border border-white rounded-md overflow-auto custom-scrollbar text-white shadow-xl"
      style={{
        top: menuPos.top,
        left: menuPos.left,
        transform: "translateX(-50%)",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <div
            key={opt.value}
            className={`p-1 px-2 cursor-pointer hover:bg-black/30 ${active ? "bg-black/50" : ""}`}
            onClick={() => {
              onChange(opt.value);
              setOpen(false);
            }}
          >
            {opt.label}
          </div>
        );
      })}
    </div>
  );

  return (
    <>
      <div
        ref={btnRef}
        onClick={toggleMenu}
        className={`cursor-pointer flex flex-row items-center justify-center gap-2 select-none ${className}`}
      >
        <IoMdArrowDropdown className="text-xl invisible" />
        <span className="select-none">{label}</span>
        <IoMdArrowDropdown className={`text-2xl transition ${value !== defaultValue ? "text-yellow-400" : "text-white"}`}/>
      </div>

      {open && createPortal(menu, document.body)}
    </>
  );
}