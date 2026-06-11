import Header from "../components/Header";
import PageTemplate from "../components/PageTemplate";
import { useEffect, useState } from "react";
import TableTooltip from "../components/TableTooltip";
import { getItems } from "../services/items";
import { getStatuses } from "../services/status";
import { getConditions } from "../services/condition";
import ColumnFilterDropdown from "../components/ColumnFilterDropdown";
import SortDropdown from "../components/SortDropdown";
import MobileDisposedFilterPanel from "../components/MobileDisposedFilterPanel";
import { FaFilter } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Disposed() {
  const navigate = useNavigate();
  const STORAGE_KEY = "disposedState";
  const savedState = (() => {
    try {
      return JSON.parse(sessionStorage.getItem(STORAGE_KEY));
    } catch {
      return null;
    }
  })();
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState(
    savedState?.searchTerm || ""
  );
  const [filters, setFilters] = useState(
    savedState?.filters || {
      condition: [],
      status: [],
    }
  );
  const [sort, setSort] = useState(
    savedState?.sort || {
      date: "date_desc",
      quantity: "none",
    }
  );
  const [statuses, setStatuses] = useState([]);
  const [conditions, setConditions] = useState([]);
  const [mobileFiltersOpen, setMobileFiltersOpen,] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [st, c] = await Promise.all([getStatuses(), getConditions(),]);
        setStatuses(st || []);
        setConditions(c || []);
        const disposedStatuses = (st || []).filter((o) => o.name !== "Na stanie").map((o) => String(o.id));
        if (!savedState?.filters) {
          setFilters({condition: (c || []).map((o) => String(o.id)),status: disposedStatuses,});
        }
      } catch (err) {
        console.error("Dropdown load error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleResetFilters = () => {
    const disposedStatuses = statuses.filter((o) => o.name !== "Na stanie").map((o) => String(o.id));
    setSearchTerm("");
    setFilters({condition: conditions.map((o) => String(o.id)),status: disposedStatuses,});
    setSort({date: "date_desc",quantity: "none",});
    sessionStorage.removeItem(STORAGE_KEY);
  };

  useEffect(() => {
      const computeSortParam = (s) => {
          if (s.quantity && s.quantity !== "none") {
            return s.quantity;
          }
          return (s.date || "date_desc");
        };
      const sortParam = computeSortParam(sort);
      const f = {
        search: searchTerm,
        condition: filters.condition.join(","),
        status: filters.status.join(","),
        sort: sortParam,
      };
      getItems(f).then(setItems).catch(console.error);
    }, [filters,searchTerm,sort,]);

  useEffect(() => {
    sessionStorage.setItem(
      STORAGE_KEY, 
      JSON.stringify({
        searchTerm,
        filters, 
        sort, 
        itemIds: items.map((i) => i.id),
      }));
  }, [searchTerm, filters, sort, items]);

  const disposedStatuses = statuses.filter((o) => o.name !== "Na stanie").map((o) => String(o.id));

  const hasActiveFilters =
  searchTerm.trim() !== "" ||
  sort.date !== "date_desc" ||
  sort.quantity !== "none" ||
  filters.condition.length !== conditions.length ||
  JSON.stringify(filters.status) !==
  JSON.stringify(disposedStatuses);

   if (loading) {
    return (
      <PageTemplate>
        <div className="flex items-center justify-center h-full">
          <LoadingSpinner />
        </div>
      </PageTemplate>
    );
  }
 
  return (
    <PageTemplate>
      <Header title="Archiwum"/>
      <div className="flex flex-col w-full h-full items-center justify-start overflow-hidden">
        <div className="flex flex-row px-1 mdl:px-2 py-1 w-full items-center bg-[#18202D]">
          <input className="h-8 px-2 w-full mdl:w-1/3 xl:w-1/4 rounded-l-lg mdl:rounded-lg font-medium text-white border-2 border-blue-600  placeholder-gray-500 focus:outline-none focus:border-white hover:border-white"
            type="text"
            placeholder="Szukaj..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="hidden mdl:block ml-2 h-8 px-3 rounded-lg bg-red-800 hover:bg-orange-950 text-white font-medium whitespace-nowrap"
            >
              Resetuj filtry
            </button>
          )}
          <div className="mdl:hidden rounded-r-lg p-1.5 bg-blue-600 pr-2">
            <FaFilter className="text-xl text-white cursor-pointer"
              onClick={() => setMobileFiltersOpen(true)}
              title="Filtry"
            />
          </div>
        </div>
        <div className="flex flex-col bg-[#203047]/15 w-full overflow-y-auto custom-scrollbar">
          <table className="hidden mdl:table w-full table-auto text-base text-left text-white">
            <thead className="bg-[#203047] backdrop-blur-xs sticky top-0 z-10 overflow-visible">
              <tr>
                <th className="px-1 py-2 whitespace-nowrap w-full lg:w-100 text-left overflow-visible">
                  Nazwa sprzętu
                </th>
                <th className="px-1 py-2 w-30 text-center hidden 2xl:table-cell overflow-visible relative">
                  <SortDropdown
                    label="Data"
                    value={sort.date}
                    defaultValue="date_desc"
                    onChange={(v) => setSort((s) => ({...s, date: v,}))}
                    options={[
                      { value: "date_desc", label: "Od najnowszych",},
                      { value: "date_asc", label: "Od najstarszych",},
                    ]}
                  />
                </th>
                <th className="px-1 py-2 text-center w-26 relative overflow-visible">
                  <SortDropdown
                    label="Ilość"
                    value={sort.quantity}
                    defaultValue="none"
                    onChange={(v) => setSort((s) => ({...s, quantity: v,}))}
                    options={[
                      { value:"none", label:"Brak sortowania",},
                      { value:"quantity_desc", label:"Od największej",},
                      { value:"quantity_asc", label: "Od najmniejszej",},
                    ]}
                  />
                </th>
                <th className="px-1 py-2 text-center hidden xl:table-cell w-36">
                  <ColumnFilterDropdown
                    label="Status"
                    options={statuses.filter((s) => s.name !== "Na stanie")}
                    selectedValues={filters.status}
                    onChange={(v) => setFilters((f) => ({...f, status: v,}))}
                    noSelectAll={true}
                  />
                </th>
                <th className="px-1 py-2 text-center w-52">
                  Lokalizacja docelowa
                </th>
                <th className="px-1 py-2 w-30 hidden xl:table-cell text-center relative overflow-visible">
                  <ColumnFilterDropdown
                    label="Stan"
                    options={conditions}
                    selectedValues={filters.condition}
                    onChange={(v) => setFilters((f) => ({...f, condition: v,}))}
                    noSelectAll={true}
                  />
                </th>
                <th className="px-1 py-2 text-left hidden 2xl:table-cell">
                  Uwagi
                </th>
              </tr>
            </thead>
            <tbody className=" hidden mdl:table-row-group">
              {items.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => navigate(`/disposeddetails/${item.id}`)}
                  className="hover:bg-black/20 border-b border-white/20 cursor-pointer"
                >
                  <TableTooltip className="text-left max-w-40 tooltip-left">
                    {item.item_name}
                  </TableTooltip>
                  <td className="px-2 py-2 text-center hidden min-w-30 2xl:table-cell">
                    {new Date(item.operation_date || item.entry_date).toLocaleDateString("pl-PL")}
                  </td>
                  <td className="px-2 py-2 min-w-26 text-center">
                    {item.quantity}
                  </td>
                  <td className="px-2 py-2 text-center hidden min-w-36 xl:table-cell">
                    {item.status}
                  </td>
                  <TableTooltip className="text-center min-w-52 tooltip-center">
                    {item.destination || "Brak..."}
                  </TableTooltip>
                  <td className={` px-2 py-2 text-center min-w-30 hidden xl:table-cell text-white
                      ${
                        item.condition_name === "Nowy"
                          ? "bg-green-600/60"
                          : "bg-orange-500/60"
                      }
                    `}
                  >
                    {item.condition_name}
                  </td>
                  <TableTooltip className="text-left max-w-40 hidden 2xl:table-cell tooltip-right">
                    {item.notes || "Brak..."}
                  </TableTooltip>
                </tr>
              ))}
            </tbody>
          </table>
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate(`/disposeddetails/${item.id}`)}
              className="p-3 m-1 bg-black/50 rounded-xl border border-white/10 shadow-sm mdl:hidden"
            >
              <div className="text-xs xs:text-base text-white flex flex-wrap gap-2 items-center">
                <span>
                  {item.status}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] xs:text-xs font-semibold
                    ${
                      item.condition_name === "Nowy"
                        ? "bg-green-600/60"
                        : "bg-orange-500/60"
                    }
                  `}
                >
                  {item.condition_name}
                </span>
              </div>
              <div className="text-sm xs:text-base font-semibold line-clamp-1 break-words mt-1">
                {item.item_name}
              </div>
              <div className="text-xs xs:text-base text-white/70 mt-1 line-clamp-1 break-words">
                  Lokalizacja docelowa: {item.destination || "Brak lokalizacji docelowej"}
              </div>
              <div className="mt-1 text-xs mt-1 xs:text-base text-white/90">
                Ilość: {" "}
                <b>
                  {item.quantity}
                </b>
              </div>
            </div>
          ))}
        </div>
      </div>

      <MobileDisposedFilterPanel
        isOpen={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        filters={filters}
        setFilters={setFilters}
        sort={sort}
        setSort={setSort}
        statuses={statuses.filter((s) => s.name !== "Na stanie")}
        conditions={conditions}
        onReset={handleResetFilters}
      />
    </PageTemplate>
  );
}