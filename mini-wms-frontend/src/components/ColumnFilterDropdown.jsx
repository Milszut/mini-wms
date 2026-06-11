import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { IoMdArrowDropdown } from "react-icons/io";
import { MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md";

export default function ColumnFilterDropdown({label, options = [], selectedValues = [], onChange, className = "", noSelectAll = false, }) {
  const [open, setOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const btnRef = useRef(null);
  const menuRef = useRef(null);
  const isActive = selectedValues.length !== options.length;

  useEffect(() => {
    const handler = (e) => {
      if (!open) return;

      const menu = menuRef.current;
      const btn = btnRef.current;

      if (menu && menu.contains(e.target)) return;
      if (btn && btn.contains(e.target)) return;

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

  const toggleSelectAll = () => {
    if (selectedValues.length === options.length) {
      onChange([]);
    } else {
      onChange(options.map((o) => String(o.id)));
    }
  };

  const toggleValue = (id) => {
    const idStr = String(id);

    const updated = selectedValues.includes(idStr)
      ? selectedValues.filter((x) => x !== idStr)
      : [...selectedValues, idStr];

    onChange(updated);
  };

  useEffect(() => {
    if (!open || !menuRef.current) return;

    const adjust = () => {
      const rect = menuRef.current.getBoundingClientRect();
      let left = menuPos.left;

      if (rect.right > window.innerWidth - 8) {
        left -= rect.right - (window.innerWidth - 8);
      }

      if (rect.left < 8) {
        left += 8 - rect.left;
      }

      setMenuPos((p) => ({ ...p, left }));
    };

    adjust();
    window.addEventListener("resize", adjust);
    return () => window.removeEventListener("resize", adjust);
  }, [open]);

  const menu = (
    <div
      ref={menuRef}
      className="fixed z-[50] bg-[#203047] w-auto min-w-46 border border-white rounded-md overflow-auto max-h-140 custom-scrollbar text-white shadow-xl"
      style={{
        top: menuPos.top,
        left: menuPos.left,
        transform: "translateX(-50%)",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {!noSelectAll && (
      <>
        <button
          className="w-full px-1 py-1 text-left hover:bg-black/50 flex items-center gap-2 outline-none"
          onClick={(e) => {
            e.stopPropagation();
            toggleSelectAll();
          }}
        >
          {selectedValues.length === options.length ? (
            <MdCheckBox className="text-blue-300 text-xl" />
          ) : (
            <MdCheckBoxOutlineBlank className="text-blue-300 text-xl" />
          )}
          <span>Zaznacz wszystko</span>
        </button>
      </>
      )}
      <div className="border-b border-white/40"></div>

      {options.map((opt) => {
        const isChecked = selectedValues.includes(String(opt.id));

        return (
          <div
            key={opt.id}
            className="flex items-center gap-2 p-1 pr-2 cursor-pointer hover:bg-black/50"
            onClick={(e) => {
              e.stopPropagation();
              toggleValue(opt.id);
            }}
          >
            {isChecked ? (
              <MdCheckBox className="text-blue-300 text-xl" />
            ) : (
              <MdCheckBoxOutlineBlank className="text-blue-300 text-xl" />
            )}

            <span className="truncate">{opt.name}</span>
          </div>
        );
      })}
    </div>
  );

  return (
    <>
      <div ref={btnRef} onClick={toggleMenu} className={`cursor-pointer flex flex-row items-center justify-center select-none ${className}`}>
        <IoMdArrowDropdown className="text-xl invisible" />
        <span className="text-white">{label}</span>
        <IoMdArrowDropdown className={`text-2xl transition ${isActive ? "text-yellow-400" : "text-white"}`}/>
      </div>
      {open && createPortal(menu, document.body)}
    </>
  );
}