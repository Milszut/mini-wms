import { useState, useRef, useEffect } from "react";
import { RiExpandUpDownLine } from "react-icons/ri";
import Tooltip from "./Tooltip";

export default function CustomSelectForm({label, placeholder = "Wybierz...", options = [], value = null, onChange, className = "", error = "",}) {
  const [open, setOpen] = useState(false);
  const [openUp, setOpenUp] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        wrapperRef.current && !wrapperRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown",handleClickOutside);
    return () => {document.removeEventListener("mousedown",handleClickOutside);};
  }, []);

  const handleToggle = () => {
    if (!wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const dropdownHeight = Math.min(options.length * 40, 192);
    setOpenUp(spaceBelow < dropdownHeight && spaceAbove > spaceBelow);
    setOpen((prev) => !prev);
  };

  const selectedLabel = options.find((opt) => Number(opt.id) === Number(value))?.name;

  return (
    <div className={`min-w-40 w-full text-white select-none ${className}`}>
      {label && (
        <p className="mb-1">
          {label}
        </p>
      )}

      <div ref={wrapperRef} className="relative">
        <Tooltip forcePosition={open ? "top" : "bottom"}>
          <button
            type="button"
            onClick={handleToggle}
            className={`w-full min-w-0 flex items-center justify-between border-2 bg-transparent rounded p-1 pl-2 cursor-pointer transition-all duration-150 hover:border-blue-700
              ${
                open
                  ? "border-blue-700"
                  : "border-white"
              }

              ${
                error
                  ? "border-red-500"
                  : ""
              }
            `}
          >
            <span className={`flex-1 min-w-0 text-left truncate
                ${
                  selectedLabel
                    ? "text-white"
                    : "text-gray-400"
                }
              `}
            >
              {selectedLabel ||
                placeholder}
            </span>

            <RiExpandUpDownLine className="flex-shrink-0 text-white text-lg ml-2"/>
          </button>
        </Tooltip>

        {open && (
          <div className={`absolute left-0 w-full z-20 overflow-auto custom-scrollbar bg-[#203047] border-2 border-white rounded shadow-lg max-h-40 sm:max-h-48
              ${
                openUp
                  ? "bottom-full mb-1"
                  : "top-full mt-1"
              }
            `}
          >
            {options.length > 0 ? (
              options.map((opt) => {
                const selected = Number(opt.id) === Number(value);

                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      onChange(Number(opt.id));
                      setOpen(false);
                    }}
                    className={`w-full p-2 text-left truncate transition hover:bg-black/50
                      ${
                        selected
                          ? "bg-black/70"
                          : ""
                      }
                    `}
                  >
                    {opt.name}
                  </button>
                );
              })
            ) : (
              <div className="p-2 text-sm text-gray-400">
                Brak danych
              </div>
            )}
          </div>
        )}
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}