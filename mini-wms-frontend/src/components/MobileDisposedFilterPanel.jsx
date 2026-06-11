import { useState } from "react";
import { FiX } from "react-icons/fi";
import { IoMdArrowDropdown } from "react-icons/io";
import { MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md";

export default function MobileDisposedFilterPanel({ isOpen, onClose, filters, setFilters, sort, setSort, statuses = [], conditions = [], onReset,}) {
  const [open, setOpen] = useState(null);

  const checkboxSources = {
    status: { label: "Status", data: statuses, selectAll: false },
    condition: { label: "Stan", data: conditions, selectAll: false },
  };

  const sortOptions = {
    quantity: {
      label: "Sortuj wg ilości",
      data: [
        { value: "none", label: "Brak sortowania" },
        { value: "quantity_desc", label: "Od największej" },
        { value: "quantity_asc", label: "Od najmniejszej" },
      ],
    },
  };

  const defaults = {
    status: statuses.map((x) => String(x.id)),
    condition: conditions.map((x) => String(x.id)),
  };

  const hasActiveFilters =
  sort.quantity !== "none" ||
  filters.status.length !== statuses.length ||
  filters.condition.length !== conditions.length;

  const isModified = (key) =>
    sort[key] !== undefined
      ? sort[key] !== "none"
      : JSON.stringify(filters[key]) !== JSON.stringify(defaults[key]);

  return !isOpen ? null : (
    <>
      <div className="fixed inset-0 bg-[#203047] z-40" onClick={onClose}/>
      <div className="fixed inset-0 z-50 text-white px-6 py-6 overflow-y-auto scrollbar-none" onClick={onClose}>
        <div className="max-w-3xl mx-auto" onClick={(e) => e.stopPropagation()}>
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-2xl font-semibold">Filtry</h2>
            <FiX className="text-3xl cursor-pointer" onClick={onClose} />
          </div>
          <div className="flex flex-col w-full justify-center items-center mb-2">
            {hasActiveFilters && (
              <button
                onClick={() => {
                  onReset?.();
                  onClose();
                }}
                className="w-1/2 py-3 rounded-lg bg-red-800 hover:bg-orange-950 text-white font-semibold"
              >
                Resetuj filtry
              </button>
            )}
          </div>
          <div className="flex flex-col gap-2">
            {Object.entries(checkboxSources).map(([key, cfg]) => (
              <div key={key}>
                <button className="w-full flex justify-between items-center py-3 px-3 bg-white/15 rounded text-lg" onClick={() => setOpen(open === key ? null : key)}>
                  <span className="">{cfg.label}
                  </span>
                  <IoMdArrowDropdown className={`text-2xl transition ${open === key ? "rotate-180" : ""} ${isModified(key) ? "text-yellow-400" : ""}`}/>
                </button>

                <div className={`transition-all overflow-hidden ${open === key ? "max-h-[900px] mt-2" : "max-h-0"}`}>
                  <div className="flex flex-col px-1">
                    {cfg.data.map((opt) => {
                      const id = String(opt.id);
                      const checked = filters[key].includes(id);

                      return (
                        <div
                          key={id}
                          className="flex items-center gap-2 bg-white/15 px-3 py-2 cursor-pointer"
                          onClick={() => {
                            const next = checked
                              ? filters[key].filter((x) => x !== id)
                              : [...filters[key], id];
                            setFilters((f) => ({ ...f, [key]: next }));
                          }}
                        >
                          {checked ? (
                            <MdCheckBox className="text-blue-300 text-xl" />
                          ) : (
                            <MdCheckBoxOutlineBlank className="text-blue-300 text-xl" />
                          )}
                          <span>{opt.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}

            {Object.entries(sortOptions).map(([key, cfg]) => (
              <div key={key}>
                <button className="w-full flex justify-between items-center py-3 px-3 bg-white/15 rounded text-lg" onClick={() => setOpen(open === key ? null : key)}>
                  <span>
                    {cfg.label}
                  </span>
                  <IoMdArrowDropdown className={`text-2xl transition ${open === key ? "rotate-180" : ""} ${isModified(key) ? "text-yellow-400" : ""}`}/>
                </button>

                <div className={`transition-all px-1 overflow-hidden ${open === key ? "max-h-[600px] mt-2" : "max-h-0"}`}>
                  <div className="flex flex-col">
                    {cfg.data.map((opt) => {
                      const checked = sort[key] === opt.value;

                      return (
                        <div
                          key={opt.value}
                          className="flex items-center gap-2 px-3 py-2 cursor-pointer bg-white/15"
                          onClick={() => setSort((s) => ({ ...s, [key]: opt.value }))}
                        >
                          {checked ? (
                            <MdCheckBox className="text-blue-300 text-xl" />
                          ) : (
                            <MdCheckBoxOutlineBlank className="text-blue-300 text-xl" />
                          )}

                          <span className="text-white">
                            {opt.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}